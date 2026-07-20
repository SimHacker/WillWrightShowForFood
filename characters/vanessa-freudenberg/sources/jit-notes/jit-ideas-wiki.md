_**Update March, 2021**: More concrete thoughts and some experimental [JIT mockups](https://squeak.js.org/docs/jit.md.html)._

Not sure how to best collaborate on ideas -- maybe just edit this.
Especially the example code section: once we're happy with it, we can build a JIT to produce it.

JIT Compiler
============

To achieve significantly better performance we need to employ just-in-time compilation and caching techniques (see [Deutsch/Schiffman](https://courses.engr.illinois.edu/cs426/Papers/smalltalk80.popl84.pdf)). This includes

* using actual temp vars for temporaries instead of the stack
* passing method arguments as function parameters instead of stack
* eliminating context creation for message sends
* reification of context objects when needed
* inline caching of method lookup result
* mapping jump bytecodes to JS control structures

How to deal with interrupts?
---------------------------

Context switches can occur at each message send and backwards jump.
We need to be able to return control to the browser at this point,
as well as switch execution to a different Smalltalk process.

Idea: Have a "fast path" that assumes there will be no interrupts.
It uses direct function calling and return, never reifing the context object.
Only in the case of an interrupt it creates the actual context object,
filling it with the values of the temp vars.
Then it returns and the calling function needs to also reify its context and return etc.

Resuming a context object is harder.
Ideally it would work just the other way around:
temps are initialized with values from the context object,
and then "somehow" the execution continues from the middle of the method.
The question is how to do that without a go-to statement in JS.

The SimpleJIT emulates go-to using a switch statement inside an endless loop,
with each case being a jump target.
My current thinking is to simply fall back onto the SimpleJIT or even the interpreter
when a method needs to be resumed (that is, the context's PC is not zero).
This would avoid having to check for this case in the "fast path".
We need to add support for entering the fast path to the SimpleJIT. 
That will get us back to fast land ASAP.

Inline Caching: Functions or methods?
-------------------------------------

Jitted Smalltalk methods could be represented as unbound functions, or as methods on the class objects. Functions might be easier to compose, e.g. if we need to break up functions into code blocks to be able to "jump" into the middle of a method after an interrupt.

Slava Egorov gave a nice talk about implementing fast dynamic lookup in JS:
[Video](http://2014.jsconf.eu/speakers/vyacheslav-egorov-invokedynamic-js.html)
and [Slides](http://mrale.ph/talks/jsconfeu2014/).
We probably want to do something along these lines.

Primitives
----------

Primitive methods expect arguments to be passed on the current context's stack. If we want to avoid having to pass arguments via the stack, we will have to rewrite the primitives. This is probably hard for the generated primitives. Perhaps it is sufficient to have a fast path for numbered primitives, and a slower path for named primitives?

Maximum call stack size
------------------------

Javascript limits the maximum stack depth to a few thousand calls. To avoid running into a "call stack size exceeded" exception we will have to limit our call depth. Every send and return needs to increment/decrement a global counter and trigger an interrupt (return to the main loop).

Another idea would be to use continuation-passing style (CPS), but the resulting code is not very readable so I'd rather avoid that. See this [tutorial](http://lisperator.net/pltut/) for a good explanation.

Examples
========

What should the generated code look like?

The Simple JIT
-----------

Our current simple JIT uses the same execution mechanism as the interpreter, 
that is, it has a single generic `send` method that allocates a new context
and then invokes the associated method. The speedup comes mostly from doing
the bytecode decoding work when jitting, and better locality of the resulting
bytecode sequence, which allows the JS JIT to optimize on a method level.

Example: This source method

    method
        [value yourself == nil] whileFalse.
        ^ 42
        
with these bytecodes

    0 <00> pushInstVar: 0
    1 <D0> send: #yourself
    2 <73> pushConst: nil
    3 <C6> send: #==
    4 <A8 02> jumpIfTrue: 8
    6 <A3 F8> jumpTo: 0
    8 <21> pushConst: 42
    9 <7C> return: topOfStack

is currently translated to this jitted code:

    function Class_method(vm) {
        var context = vm.activeContext,
            stack = context.pointers,
            rcvr = vm.receiver,
            inst = rcvr.pointers,
            temp = vm.homeContext.pointers,
            lit = vm.method.pointers;
        while (true) switch (vm.pc) {
        case 0:
            // 0 <00> pushInstVar: 0
            stack[++vm.sp] = inst[0];
            // 1 <D0> send: #yourself
            vm.pc = 2; vm.send(lit[1], 0, false);
            if (context !== vm.activeContext || vm.breakOutOfInterpreter !== false)
                return;
        case 2:
            // 2 <73> pushConst: nil
            stack[++vm.sp] = vm.nilObj;
            // 3 <C6> send: #==
            var cond = stack[vm.sp-1] === stack[vm.sp];
            stack[--vm.sp] = cond ? vm.trueObj : vm.falseObj;
            // 4 <A8 02> jumpIfTrue: 8
            var cond = stack[vm.sp--];
            if (cond === vm.trueObj) {
                vm.pc = 8;
                continue;
            }
        case 6:
            // 6 <A3 F8> jumpTo: 0
            vm.pc = 0;
            if (vm.interruptCheckCounter-- <= 0) {
               vm.checkForInterrupts();
               if (context !== vm.activeContext || vm.breakOutOfInterpreter !== false)
                    return;
            }
            continue;
        case 8:
            // 8 <21> pushConst: 42
            stack[++vm.sp] = lit[2];
            // 9 <7C> return: topOfStack
            vm.pc = 10; vm.doReturn(stack[vm.sp]);
            return;
        default:
            // someone played around with vm.pc
            vm.interpretOne(true);
            return bytecodes;
        }
    }

This method can be invoked with any valid PC.
E.g. if there was a context switch inside `yourself`, this method would be
resumed with `vm.pc == 2`, jumping right to the second case.
The default case even falls back to the interpreter,
in case the method was entered with an 'unusual' program counter.
This can pretty much only happen during single-stepping in the debugger.

As you can see, for each send it creates a new context and returns.
The main loop outside this code then executes that method.
This has the advantage of allowing an unlimited stack depth, because all calls are shallow.
It also has the disadvantage that called methods can never be inlined by the JS JIT.

New JIT
-------
Bytecodes and pseudo code:

    PC                          SP      while (true) {
    0 <00> pushInstVar: 0       1         tmp0 = rcvr.instvar[0]
    1 <D0> send: #yourself      1         tmp0 = send(tmp0, #yourself)
    2 <73> pushConst: nil       2         tmp1 = nil
    3 <C6> send: #==            1         tmp0 = tmp0 == tmp1
    4 <A8 02> jumpIfTrue: 8     0         if (tmp0 !== false) break;
    6 <A3 F8> jumpTo: 0         0       }
    8 <21> pushConst: 42        1       tmp0 = 42
    9 <7C> return: topOfStack   0       return tmp0

Here, temps are named according to their position on the stack.
This should make it easy to reify the stack when needed.
Not sure if that will work within blocks, though.

Rough idea for generated code:

    new Function('env', `
        var class0 = null, func0;
        return function Class_method(rcvr) {
            var tmp0, tmp1;
            if (env.depth-- < 0) return env.reifyStack(0);
            while (true) {
                tmp0 = rcvr.pointers[0];
                if (class0 !== tmp0.sqClass) {
                    class0 = tmp0.sqClass;
                    func0 = env.lookup(class0, lit[0], false);
                }
                tmp0 = func0(tmp0); if (tmp0 === false) return env.reifyStack(2, tmp0);

                tmp1 = env.nilObj;
                tmp0 = tmp0 === tmp1 ? env.trueObj : env.falseObj;

                if (tmp0 === env.trueObj) break;
                else if (tmp0 !== env.falseObj) return env.mustBeBoolean(4, tmp0);
            }
            tmp0 = 42;
            return tmp0;
        }
    `)(env);

The inline-cache check `class0 === rcvr.sqClass` should work even for SmallInts, their `sqClass` is `undefined`. 

`func0` is the jitted method for `#yourself`. It answers the special value `false` to indicate we have to leave the fast path.

`env.reifyStack(pc, ...args)` would create a proper context object from the given `pc` and temp vars (if any).