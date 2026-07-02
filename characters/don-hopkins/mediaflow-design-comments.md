---
title: MediaFlow Design Comments
author: Don Hopkins
character_id: don-hopkins
canonical_url: https://donhopkins.com/home/interval/mediaflow-design.html
machine_index: history/interval-research.yml
---

# MediaFlow Design Comments

**Don Hopkins · Interval Research Corporation · written 1996**

| | |
|---|---|
| **Era** | Interval Research (Camelot) — parallel with Bounce, [IFC vs Bongo](ifc-vs-bongo-comparison.md), [Pluggers](https://donhopkins.com/home/interval/pluggers) |
| **Implementation** | Don's **Mac Common Lisp + QuickTime** MediaFlow (separate from Bounce extensions) |
| **Original** | [donhopkins.com/home/interval/mediaflow-design.html](https://donhopkins.com/home/interval/mediaflow-design.html) |
| **Machine index** | [`history/interval-research.yml`](history/interval-research.yml) |
| **Topics** | mediaflow · visual programming · dataflow · streams · Bongo · ScriptX · Snap! · MOOLLM |

---

## Preface — reading design as a journey

One thing I love to do: **read and study expertly written code and design writing**, trace its structure, and **write about the journey of interpretation** — what it meant then, what it connects to now, where the bones show through.

This Interval essay is in that tradition. Not a manual — a **design notebook** written while MediaFlow and Bounce were both in flight. Same impulse as working through a beautiful Lisp (ScriptX, PostScript interpreters, later MOOLLM skills): follow the author's choices, name the tradeoffs, map the unfinished edges. The [Modern echo — Snap!](#modern-echo--snap-written-before-it-existed) and [Modern echo — MOOLLM](#modern-echo--moollm-written-before-it-existed) sections at the end are part of that reading — 1996 primary text, 2026 footnotes.

**Navigate this repo:** [Interval overview](interval-research-pluggers-and-mediaflow.md) · [IFC vs Bongo](ifc-vs-bongo-comparison.md) (Bongo persistence deep dive) · [Tom Ngo ECG](tom-ngo-embedded-constraint-graphics-at-interval.md) · [Kaleida ScriptX](kaleida-scriptx-dreamscape-multimedia-lisp-machine.md) · [Dan Ingalls Fabrik](../dan-ingalls/ideas.md) · [Snap!](../jens-monig/README.md) · [YAML Jazz trail](../../process/trails/yaml-jazz-collaboration-stack.md) · [`import-self-from-self.md`](import-self-from-self.md)

---

## Introduction

> *So far, MediaFlow has many requirements, but little overall design. We still need to decide what kind of language it's going to be, or if it's going to be a language at all.*

**Context (2026):** Marc Davis's hypermedia / stream-dataflow thread at Interval. Don implemented MediaFlow in **Mac Common Lisp + QuickTime** while separately extending **Bounce / Body Electric** on Mac (live TV compositor, caption-driven puppets, COM on wires) — [two parallel projects](interval-research-pluggers-and-mediaflow.md), not one port of the other.

**Written before Snap!** — but speaks to it. Snap! got so much right: first-class lists and procedures (enough for the **Y combinator**), **Build Your Own Blocks**, live editing without mistaking MacDraw for programming. [Brian Harvey](../brian-harvey/README.md) + [Jens Mönig](../jens-monig/README.md) resolved many tensions here via Logo/constructionism, not Interval's COM soup.

**Written before MOOLLM** — but the tree namespace + path-to-every-element (like **Self**) paragraph is on the nose: **K-lines**, directories as rooms, Self-ish OOP over the filesystem. See [§ Keyboard-first editing](#keyboard-first-editing) callout and [Modern echo — MOOLLM](#modern-echo--moollm-written-before-it-existed).

*Below: the 1996 essay, inlined. Section-end notes link forward; original voice preserved.*

---

## Contents

- [Preface — reading design as a journey](#preface--reading-design-as-a-journey)
- [Introduction](#introduction)

1. [What kind of language?](#what-kind-of-language)
2. [Requirements vs generality](#requirements-vs-generality)
3. [Data flow and state](#data-flow-and-state)
4. [Visual vs textual editing](#visual-vs-textual-editing)
5. [Namespaces, persistence, and the web](#namespaces-persistence-and-the-web)
6. [Streams and sessions](#streams-and-sessions)
7. [Build on Java, not around it](#build-on-java-not-around-it)
8. [Control and data abstractions](#control-and-data-abstractions)
9. [Stateful modules in Bounce](#stateful-modules-in-bounce)
10. [Closures, PostScript, and continuations](#closures-postscript-and-continuations)
11. [Multiple dispatch and session collapsing](#multiple-dispatch-and-session-collapsing)
12. [Plug-in data types and clay](#plug-in-data-types-and-clay)
13. [Functions on wires](#functions-on-wires)
14. [Bounce control flow vs Max](#bounce-control-flow-vs-max)
15. [Tiny languages and Pluggers](#tiny-languages-and-pluggers)
16. [Modern echo — Snap!](#modern-echo--snap-written-before-it-existed)
17. [Modern echo — MOOLLM](#modern-echo--moollm-written-before-it-existed)

---

## What kind of language?

So far, MediaFlow has many requirements, but little overall design. We still need to decide what kind of language it's going to be, or if it's going to be a language at all.

- Will it piggy-back on top of a pre-existing non-visual language like Java, the way the NeWS **PSIBER Space Deck** provided a visual interface to the PostScript language?
- Will it have its own data type system, or will it provide full undiluted access to an underlying class hierarchy?
- Will it try to replace component integration and scripting languages like Visual Basic, or will it take advantage of them as plug-in execution engines?
- Will it be a general purpose programming language, or more like a high level behavior authoring tool, or a functional dependency editor?
- Will it consist of general purpose class libraries useable from other languages, or will it have its own closed language and development environment?
- Will it interoperate with and add value to other programming languages, desktop environments, and authoring tools, or should it attempt to replace them?

---

## Requirements vs generality

Some of the requirements detract from the potential generality of the language. Some goals are conflicting, like how the real time simulation approach of **Bounce** doesn't fit well with the temporal stream based approach of **MediaCalc**. But these goals are not as conflicting if you think of them as sets of plug-in classes instead of fundamental language features.

Certain higher level requirements, like polyphonic streams and rational numbers, would be better addressed as separate specialized classes, instead of trying to build them into the language at a low level, because they impose space, time, and complexity overheads that will make the competing goals of ease-of-use and real-time operation impossible to achieve.

Several of the demos we want to be able to express very easily, are just not worth the time and difficulty of implementing a language that makes them trivial to express. That's the difference between a general purpose language, and a special purpose authoring tool. Trying too hard to make a particular demo easy wastes a lot of time and effort, in a way that isn't re-usable.

Many things are always going to take a lot of effort to express, by their very nature. **Common things should be easy and unusual things should be possible.** But just because something's possible doesn't mean it's a good idea, or would really work in practice.

---

## Data flow and state

Our experiences with Bounce and MediaFlow show that **pure functional data flow is unwieldy and impractical**, and there needs to be some comprehensive way to represent and manipulate complex state. You can't pass everything around on wires, it just becomes too tangled.

> A visual programming language cannot take away the need to design programs. Once a program is designed, expressing that design in the syntax of the language should be the easy part.

But with most visual languages, it boils down to a graphics editing task, like using MacDraw, which is quite difficult compared to simply typing the program in a textual language.

---

## Visual vs textual editing

Languages like **Frontier**, whose syntax is based on a tree structured outliner, occupy a middle ground between visual and textual languages. Frontier allows you to easily type in and edit the program with a text editor, using keyboard commands like tab, shift-tab, and arrows to manipulate and navigate the tree structure, as well as mouse commands like direct manipulation, drag-and-drop, and menus for editing the tree.

But as Frontier also demonstrates, **monomedia trees are much too restrictive**. A true visual language should be structured as a general multimedia graph (then you can implement anonymous recursion by dragging and dropping a function into itself — *who needs the Y combinator!*). So we need a general **butterfly editor** (like Strassman's work in Dylan), instead of just a tree editor. And we need to support arbitrary embedded multimedia views, as well as different multiple views of the same content.

### Type expressions into graphs

You should be able to type in textual expressions like:

```text
sqrt(x*x+y*y)
```

…that are parsed into functional graphs. It knows from the free variables to make an encapsulation with two inputs named `x` and `y` and one output. It automatically wires up the two multiplies, one add, and square root for you. It could even wire it into some outer function, by selecting the appropriate input and output wires from the current context.

### Keyboard-first editing

There should be a reliable, complete and consistent set of keyboard commands for navigating, creating, and editing the language structures. By **reliable**, I mean that type-ahead should work perfectly, and never miss any keystrokes, or lag behind frantically updating the screen. You should be able to create any new functional or literal data element simply by typing its name, or dragging and dropping it from a pallet, or making a copy of another object.

The system should arrange language elements in a tree structured name space, like Java packages. The interface should offer prompting and type-in completion over the dynamic environment, like Emacs and PSIBER. Language elements can have visual representations and sound effects, but will always have unique textual names, and could have other convenient shorthand nick-names, and even scoping rules, to make typing easier. There should be a path through which you can address any data or code element, like **Self**.

> **MOOLLM echo (Don, 2026):** On the nose — and fundamental. Tree-structured namespace → **directories are nested rooms**. A path to every data and code element, like Self → **`import self from self`**: Self-ish prototype OOP over the directory tree, not Java's or JavaScript's castrated projection. Unique textual names + nicknames / synonyms (from HyperTIES) + scoping → **K-lines** (symbolic activators; filenames *are* the advertisement index). Emacs/PSIBER completion over the dynamic environment → GLANCE → CARD → SKILL, yaml-jazz, and agents that load context by path. See [`import-self-from-self.md`](import-self-from-self.md) · [MOOLLM](https://github.com/SimHacker/moollm) · [David Ungar](../david-ungar/README.md) · [YAML Jazz trail](../../process/trails/yaml-jazz-collaboration-stack.md).

Programs should be able to contain literal manifest resources like images and sounds (i.e. `for i in ([image1], [image2], [image3])` or `f(x,y) ::= [image].getPixel(x,y)`), that are stored separately in resource files and referred to by name in the program's textual representation. Circular and self-referential structures in code and data are permitted, and can even be used to implement some types of control flow (like recursion).

You should be able to drag and drop any content from the web, directly into your program, and even drag and drop your program back into the web!

There could be a textual, human readable representation for the language, used by the persistence mechanism, or even by humans.

---

## Namespaces, persistence, and the web

**Bongo's** persistence mechanism, as well as its interface editor's dynamic property sheets, are based on components externalizing their state as a graph of dictionaries, that it knows how to write out and read in. A Bongo component is created in an uninitialized state without any arguments, then given a dictionary to initialize itself from. When it needs to be persisted, it returns a dictionary that represents all the state it cares about. The interface editor dynamically generates a property sheet to edit any component, by asking the component for its dictionary and metadata.

> **Full analysis in this repo:** Don's Interval comparison [**IFC vs Bongo**](ifc-vs-bongo-comparison.md) — `getProperties` as persistence **and** metadata, Arthur van Hoff's Bongo vs Netscape's string-based Target model, component-framework wars, and the MOOLLM/yaml-jazz echo. [Original HTML](https://donhopkins.com/home/interval/ifc-vs-bongo.html).
One approach is to represent the structure of a program as web pages, using link anchors as labels and references, and interpreting the marked up text as instructions. But html is not the ideal syntax, even though it could be made to work. More traditionally, we could use html syntax to encode applet properties and class names and object code url references, and embed our programs on web pages as applets, activex controls, or whatever.

> **The content is the program:** intertwingled literals, executables, and interpretables!

---

## Streams and sessions

Here is my understanding of **streams**, as influenced by MediaCalc.

A **stream** manages the flow of data between functional elements. There are many different kinds of streams, to represent the many different forms of data.

A **session** is an iterator over a stream, through which you access it. Data can be read and written to a stream via a session. A stream and its sessions can be writable, readable, or both. Sessions can provide direct read or write access, via Lock/Unlock. You can have any number of active sessions open on a stream.

A stream and its sessions manage a set of buffers, translating and passing read and write requests and direct access locks through to the appropriate buffers. The stream keeps track of the outstanding sessions, to manage its buffers efficiently.

Functions access streams through sessions, instead of interacting directly with the streams. Sessions can translate and buffer data from the stream. A function can negotiate with a stream or session to get the most appropriate and efficient kind of session to read or write.

There could be a registry of automatic data type converters and bufferers, that can be consulted to automatically construct higher level adaptor sessions. Sessions can be chained and telescoped, to implement lazy streams.

### Things we want to do with streams and sessions

| Category | Capabilities |
|----------|--------------|
| **Buffering** | scrolling buffers · streaming enormous files · network buffering · circular buffers · circular audio streams (blips, DirectX buffers) · audio and video capture buffers |
| **Time** | periodic infinite streams · key framing · buffering video key frames · implementing backwards sessions efficiently · preroll · read-ahead, prepare to play · lru buffers · random access paging |
| **Efficiency** | minimize copying · shared buffer references · operate in-place when possible |
| **Functional style** | lazy functions — avoid copying by outputting a lazy session chained to the input session |
| **Mutational style** | directly access buffers in place |
| **Composition** | caching · lazy sessions · chain sessions together · collapsing telescoped sessions |
| **Optimizations** | collapse temporal warping · collapse two dimensional image transformations · collapse two dimensional clipping · push clipping back through transformations, so we only process the pixels that touch the screen |

### Specialized session interfaces

| Interface | Purpose |
|-----------|---------|
| **TextSession** | Enumerate the text of events in a stream — subtitles in video, text in a web page, strings in structured graphics |
| **SizeSession** | Enumerate the sizes of events without realizing or decompressing contents |
| **ImageRGBSession** | Enumerate graphics as 24-bit images; 8-bit streams puffed up to 24 |
| **ImageRGBASession** | Images with alpha channels |
| **ShapeSession** | Shapes of images (alpha channel or bounding box only) |

Maybe specialized sessions are a bad idea, and instead there should be one generic session (or iterator or enumerator), that returns lazy events or objects directly.

### Don't reinvent Java's collections

I question whether, in most cases, our fancy streams have much more to offer than, for example, the arrays and collection classes built into Java. There's got to be a compelling reason to roll our own and use them, if the environment already provides efficient built-in collections, that we can get along with and build on top of, and that can be accessed from plug-ins.

We shouldn't think of our streams and collections as replacing the regular lower-tech data types that come with (say) Java. If Java arrays are sufficient for a task (which will usually be the case), then a visual programmer should be able to use them directly and efficiently, without shoe-horning them through all those fancy streaming event session data flow interfaces.

It would be a hassle to need to use our own time or rational number data type, that we have to convert to and from, when calling common methods of built-in classes. It would be a shame if in order to loop over the characters in a string, you had to deal with special sessions and events.

---

## Build on Java, not around it

We should be able to compile our visual language into **Java byte code**, and it will run quite efficiently with a good just-in-time compiler, especially if our language uses native Java data types when possible.

The **Bongo** interface editor is based on an incremental Java compiler. It allows you to edit the Java language source code script of any component. It creates specialized classes for components with scripts, that it dynamically compiles into Java bytecodes, which are persisted as strings with the presentation. Bongo's user interface script editor is meant to eventually support other languages that compile into Java bytecode. So we could plug our visual language into Bongo for scripting user interface components!

Java is a general purpose language, known to be very good for networking; but networking support is not built into the actual language, it's just a library. The general purpose language is designed very well and has a complete set of general purpose primitives (threads, locks, streams, etc.) so that it does not get in the way of implementing complex networked applications.

I think we should design a general purpose visual programming language in the same way: with what we're going to use it for embodied in our minds and our plug-ins, but **not in the language itself**. Because I think it will be useful for many more things than we can imagine, especially if it has first class access to the Windows desktop, web browser, networking and multimedia services, the way other plug-in programming languages like Visual Basic and JavaScript do.

---

## Control and data abstractions

We need to put a lot more thought into the control abstractions, at the same time we're designing the data abstractions.

> **Richard P. Gabriel, *Patterns of Software*, p. 27:**  
> "Let's look at another problem of abstractions: Data and control abstractions are generally best when they are codesigned, and this is rarely done any more."

> **Richard P. Gabriel, *Patterns of Software*, p. 30:**  
> "Regardless of what you make of this view of data versus control abstraction, it is certainly true that because almost every programming language does not allow any sort of meaningful user-defined control abstractions, there is always a mismatch in abstraction levels between control and data. If there is a good reason for allowing data abstractions, why isn't that a good reason for allowing control abstractions; and if there is a good reason to disallow control abstractions, why isn't that a good reason to disallow data abstractions? Nevertheless, it is accepted practice to use existing control abstractions to implement others using common patterns. My argument is that perhaps we should be more willing to use common patterns for other things as well."

### ScriptX: control and data designed together

In the case of the **ScriptX** language, control and data abstractions were designed together. The looping structures like `for` worked together with iterators over collections, sequences, intervals, etc. The statement `for x := 0 to 10 by 2` was implemented as an iterator over the sequence `0 to 10 by 2`, a virtual collection, equivalent but more efficient than the literal manifest: `for x := #(0, 2, 4, 6, 8, 10)`.

ScriptX collections support a **pipe** protocol that lets you pipe collections through functions and into other collections:

```text
#(1, 2, 3) | print              → prints each element
#(2, 3, 1) | SortedArray         → #(1, 2, 3)
#(1, 2, 3) | #(4, 5, 6)          → appends into second array → #(4, 5, 6, 1, 2, 3)
```

---

## Stateful modules in Bounce

The control abstractions in **Bounce** are a mixed bag. I like the **enable line**, an implicit "do once if non-zero" input that every module has. It could be generalized to be an integer telling how many times to execute a module.

What didn't work in Bounce were the **while loops**, or executing encapsulations more than once per frame. The problem was that some functional modules store state, and they expect to be executed once per frame, but they might be executed many times if they're inside a while loop.

One example is the **`smooth`** function, that remembers the last output value, so it can smooth the current input value with it. It does not expect to be applied to a bunch of different values per frame in a while loop. In order to do that, it would need to store one previous output value per loop of the while. But it has no way of knowing how many times the loop might execute, or what runtime object it should associate its state with.

When doing the **Bots** demo, I made a house fly module, which worked as I expected. But then I tried to make a swarm of independent flies, by embedding the fly module in a while loop, over a bunch of different fly dictionaries. They mysteriously all swarmed in the same direction, like they were a school of fish. The problem was that they were all using the same **`smooth`** function on their directions, which should have been independently smoothed.

So I restructured the program to do the smoothing manually, by storing the last value in a numeric key in the fly's dictionary. This approach required me to make up a unique key name, and hard wire that name into the manual smoothing module. So that code was still not reusable in the same fly module without changing the key name (for example, if I wanted to smooth the movement of each leg independently, I'd have to have a different key for each leg).

There would have to be some way for it to access the execution context of the interpreter, and store its dynamic state somewhere in the appropriate stack frame. For example, you might make a module that smooths the motion of a robot arm, but you are looping over 10 robots, each with a different number of arms. Somehow you have to tell the program where to store the runtime state it needs to smooth the motion of however many arms there are.

A coherent solution to this problem becomes very important, when we start passing functions around on wires as objects, like Lisp. There needs to be some sort of lexical or dynamic scoping supported by the interpreter, so we can do all the things in our visual language that Lisp programmers are used to doing by passing functions and closures around. **We need the data flow equivalents of closures and continuations.**

---

## Closures, PostScript, and continuations

**ScriptX**, like Scheme and Dylan, supports "language level" lexical closures. Whenever a ScriptX bytecoded function pushes a lexical closure onto the stack (which refers to some embedded bytecode), it makes a new closure over that code, allocating a certain number of cells to store the lexical variables used by the closure. The closure also has a reference to the embedded bytecode shared by all instances of that closure. Each time the code containing the closure is executed, it makes a new instance, and copies the lexical values the closure refers to into storage cells of the new closure instance. So an instance of the closure can be returned from the function, and it can be applied later, and it will see the values of the lexical variables stored in those cells at the time the function containing the closure was executed.

ScriptX also has a more primitive **substrate level** closure. There is a C function in the substrate that dynamically creates a primitive closure from C code, which holds a pointer to a C function and a pointer to a user data argument to pass to the function. The closure is a primitive operator, that the interpreter can apply like any other scriptx function or built-in primitive.

### PostScript's three stacks

The way some PostScript interpreters implement control structures with state may be applicable. PostScript interpreters are unique in that they have **three separate stacks**:

1. **Operand stack** — for passing arguments  
2. **Execution stack** — for flow of control  
3. **Dictionary stack** — for dynamic scoping  

A PostScript interpreter executes an array by pseudo-recursively executing each of its elements in turn. The execution stack is used to store the control state; so instead of the interpreter calling itself recursively, it loops.

It remembers where it is in the array, by pushing an **array execution continuation** onto the execution stack; then it pushes the current array element onto the execution stack. Finally it returns, and the interpreter loops: popping the array element off the execution stack and executing it.

When it's done, it loops again and pops the array execution continuation off the execution stack, then executes that.

An array execution continuation contains a pointer to the C code that implements it, as well as a reference to the array, and the current index into the array, which is all the continuation needs to know. It executes the next element of the array by incrementing the counter and pushing the continuation and the next array element onto the execution stack again. When it hits the end of the array, it terminates the array execution loop by simply not pushing anything onto the execution stack and returning.

In general, a PostScript looping operator works by taking parameters and an executable code array as arguments on the operand stack, and saving references to them and any other needed state in a special continuation, which it pushes onto the execution stack, followed by the code to perform one loop.

The **`for`** loop continuation remembers the current index, the step, the limit, and the array to execute (which is a function that takes the current index as an argument on the operand stack). The **`forall`** loop iterates over each element of an array or dictionary, in a similar manner. The infinite **`loop`** continuation just repeatedly re-pushes itself and the code array onto the execution stack. It's terminated by the **`break`** operators, that pops the execution stack until it finds a loop continuation.

We don't want the undisciplined dynamic scoping you get with the PostScript dictionary stack. (NeWS used an object oriented programming package to manage the dictionary stack in a reasonable way.) But we do need a way for functions like **`smooth`**, who need to store some state, to find a safe and sane run-time niche to hang that state, that they can find again when they need it, that won't interfere with other applications of the function that we can't keep track of. At least Java has a garbage collector.

This sounds like an intractable problem, so we need a new way of thinking about it. Or just to give up the notion of stateful functions, and pass in references to storage for functional state. It seems a bit much to ask smooth to crawl up the execution stack and analyze the nested loop frames to figure out where to hang its last value cache.

---

## Multiple dispatch and session collapsing

One problem of designing object oriented graphics systems, is how do you efficiently implement the crossbar of blitting between every different image representation? The various image classes are not supposed to know a lot about each other, so where is the "object oriented" place to hang the code that blits in video ram, in system ram, between system and video ram, and all the other combinations of image formats?

**Multiple dispatch** is one answer to this question. Instead of dispatching the method on the class of just the first argument, you can register a method that dispatches on more than one argument. In the terminology of ScriptX (which is like Dylan or CLOS), a **generic** is the name of a message, and a **method** is an implementation of that message for a particular class. Normal object oriented programming languages dispatch the method on the type of the first argument, but a generalization of that is to select the method to execute based on the class of more than one argument.

Example — one generic `Blit`, two classes `MemoryImage` and `VideoImage`, four multiply dispatched methods:

```text
Blit(MemoryImage source, MemoryImage dest)
Blit(MemoryImage source, VideoImage dest)
Blit(VideoImage source, MemoryImage dest)
Blit(VideoImage source, VideoImage dest)
```

Then fallbacks for classes you haven't special-cased:

```text
Blit(VideoImage source, Image dest)
Blit(Image source, VideoImage dest)
Blit(Image source, Image dest)
```

We can make macros that unify over parameterized type specification, and dynamically generate specialized code for the instantiated parameter types:

```text
macro Copy((Array of ?type) source, (Array of ?type) dest)
```

### Session concatenation and QuerySession

What's a clean way to do local session collapsing optimizations? We can design a **session concatenation protocol**, that allows session classes to register methods that collapse themselves with their neighbors in the chain:

```text
Concatenate(TransformationSession s1, TransformationSession s2)
Concatenate(TimeWarpSession s1, TimeWarpSession s2)
Concatenate(ClipSession s1, TransformationSession s2)
```

Another approach (orthogonal or not?) is to implement a **QuerySession** protocol, like QueryInterface, that lets you ask a stream or session for a particular session interface, which either the class supports directly, or the system tries to construct by consulting the session adaptor registry, and chaining together the sessions it needs to provide the interface. Various optimizations could take place in QuerySession.

Another even simpler approach, is to know what you're going to want to communicate before hand, and lay down the law about what the format is going to be. Then design simple APIs that all agree on passing just that information around.

Some things like images and sounds may be well enough known that we can simply pick one or two formats and stick with them. That's what Java does, with its 8 and 32 bit image representations, and ColorModel objects. We could just use that.

### Lock/Unlock direct access

One approach to efficiency is to provide and use direct access sessions whenever possible, which you ask for when opening a session, by specifying the access modes and format constraints. There is a **Lock/Unlock** protocol, to which you pass a "read" flag on the Lock, and a "write" flag on the Unlock. The session can read and write the buffer when necessary. A good example of this is the way DirectDraw provides direct access to video memory, or at least a buffered simulation of direct access, if the hardware does not support it. But DirectDraw doesn't provide as fine a grain control as the protocol that optionally reads on lock and writes on unlock.

- **Lock(read)** — set read to true if you care about reading the data. For an output session, pass false.  
- **Unlock(write)** — set write to true if you changed the data. If you're just reading, pass false. For search-and-replace, pass false for buffers that didn't contain the pattern, true only for buffers you changed.

---

## Plug-in data types and clay

**What is a plug-in data type?** It's an interface to some state and metadata. For every plug-in data type, we will have a unique interface id, associated with an interface that exposes its public state and functionality. Built on top of that will be a higher level data type composition system, that lets you say "a stream of blas", or "a bla bla bla session".

A plug-in data type might not be general purpose; it might not expose any state or services at all and just be used as an opaque handle.

The object system does not need to support the ability of highly dynamic systems like Self, PostScript, or ScriptX, that can dynamically add fields to any object at run time.

For such purposes, we can use **clay-like** data types designed for general purpose modeling, like dictionaries, polymorphic arrays, piece-wise linear mappings, and relational databases.

If you need dynamic modeling, or want to rapidly prototype, then you can work with the built-in clay data types, instead of defining your own interfaces and classes. Because the built-in clay will be common to all parts of the system, different plug-ins written by different people at different times can use those general purpose data types to communicate with each other, and to externalize state (for persistence and property sheets).

The clay data types should at least include:

| Type | Role |
|------|------|
| **dictionaries** | General associative storage |
| **polymorphic arrays** | Heterogeneous collections |
| **strings** | Text |
| **numbers** | Numeric values |
| **names** | Internalized atoms useful as hash table keys |
| **operators** | Generic executable objects that can call back into C or Java code, and have state like a closure |

Plug-ins can implement mini-language interpreters, that interpret programs made of clay syntax, so other plug-ins and scripts can create and manipulate those programs as first class objects. For example, you could have a plug-in state machine engine, that was driven by an array of dictionaries indexed by state, that represented the graph with dictionaries and names, with operators that are called on state transitions, the execution of which can be implemented by other plug-ins (like Microsoft's plug-in JScript interpreter).

---

## Functions on wires

Imagine a visual data flow language whose objects are like Lisp data.

- What would it mean for **functions to flow down wires**? Has anyone done a data flow language that supports passing lexical closures, pointers, or passing objects by reference? Lexical in the syntax of graphically nested boxes, instead of parens.
- How would you visually represent **applying a function** to some dynamically chosen inputs? How can you choose which inputs to apply to a function dynamically?
- What would it mean for a **reference to the input** of a function (an indirect wire connection point) to flow down a wire? What would be the equivalent to C's `*` and `&` operators, or is there a more sanitary way of thinking about it? Do pointers even make any sense in this context? Is it better to think of wrapping an object in a mutable container (say an array of length 1), and passing that instead?
- Would you have a literal graphical **lambda** form you could wrap around a function so it was not evaluated, but had an output that was a lexical closure? How can you satisfy some of its inputs, and then pass the curried function downstream? A partially wired up functional network is just a piece of data that you can pass downstream to be satisfied with more inputs later, by a generic **apply** icon!
- What would it mean to have a **continuation**, in a visual language where control flow is implicit? Would they be useless, or break the model, or is there some data-flow dual of continuations that would be as powerful a control flow mechanism? Should such a powerful control flow mechanism be hidden from the programmer (the way Pascal hides `goto` with `while`, or ScriptX implements exceptions and non-local exits internally in terms of "downward passing" continuations that never get handed back to the programmer, but are used behind the scenes by the compiler, which translates them into branches, calls, and returns)?

---

## Bounce control flow vs Max

Bounce figures out the order to execute the icons in, by computing a partial ordering based on the wires. So the programmer does not have to think about the path the program counter is taking through the elements on the screen, instead thinks about the data flow dependencies. It doesn't keep you from wiring up loops, which result in the data on the upstream wire being delayed one frame. So you can take a `+` icon, connect a `1` constant to one of its inputs, and its output to its other input, to make a counter that increments every frame! Bug or feature, you decide.

The **switch** icon is purely data flow, like a relay that switches between one of two inputs, based on a third binary input. On the other hand, the **enable line** is an input that you can hook up on any icon, that operates like a power switch. It can be used for control flow, by turning on and off whole nested modules, or individual icons.

One interesting behavior is that by using the enable line to turn an icon on and off, you can get the behavior of an **implicit latch** on the icon's output, because if the icon is not powered, the last value calculated stays on its outputs, and the icons downstream continue to execute with that value as input. David says he discourages people from using the enable line this way, because they should use an explicit latch icon instead.

The other thing you can use the enable line for, is **sequencing** the execution of the icons, in case the automatically generated partial ordering is not sufficient, because of side effects (like setting global variables, or drawing graphics).

The enable line is an output as well as an input, and its output value is the same as its input. You can sequence a series of Bounce icons by wiring their enable lines together in the order you want. So as long as you pass a true value, it operates kind of like a no-op wire, whose side-effect is to establish an ordering dependency (because of the wire).

And then there's Bounce's **while encapsulation**, like a nested folder module with inputs and outputs, that has the same number of inputs as outputs, including one binary conditional input. As long as the conditional is true, the circuit inside the module is executed, and its outputs are looped back to its inputs. So the encapsulated function is automatically "telescoped" while the condition is true. I don't think it's possible to implement recursion in Bounce this way, though, because of the implementation, but it would be cool if it worked (kind of like Geometer's Sketch Pad's recursion by demonstration)!

**Max**, on the other hand, has this explicit notion of control flow, because the programmer can draw loops and conditionals on a page, and the programmer thinks in terms of navigating the program counter around a maze of icons on screen, instead of pure data flow.

Bounce is different in that every icon on the screen is executed once, and if a wire goes **against the flow**, from the output of one downstream icon to the input of an upstream icon, the upstream icon gets as input the value of the downstream output during the **last frame**.

You can take advantage of this if you want, for example, to calculate the velocity of the mouse, using the against-the-flow wire to delay the last value of the mouse position for one frame, and subtracting that from the current position — yet another way to avoid using a latch!

One UI improvement I want to make to Bounce is to draw or color upstream wires differently, so it's more obvious that they are tunneling data through time to the next frame. It's debatable if this is a good programming technique, or if the system should disallow upstream links, and force you to use explicit latches or delay icons instead.

I think I like Bounce's way of breaking up control flow into different orthogonal concepts (data flow switching, enabling and sequencing execution, and the telescoping while loop). I haven't programmed in Max or Prograph, but I get the impression that there's something unsavory about the way Max tries to project both control and data flow onto the same two dimensions.

Ideally, you should be able to look at the multidimensional program from the many different perspectives, by projecting any number of its dimensions onto the two of the screen, and rotating it between different projections. (There could be some automatic dynamic layout involved here, as well as programmer specified coordinates or relative layout hints, like tension on the wires to indicate the degree of coupling — loosely coupled components would be further apart, and closely coupled components would be clustered!)

---

## Tiny languages and Pluggers

I think visual interfaces are better for implementing **tiny languages** to address specific problem domains, more like behavior authoring tools than general purpose programming languages. For example, it would be useful to have a graphical state machine editor, but you certainly would not want to shoe-horn everything you're doing into a state machine, no matter how easy it was to edit. The state machine editor could be a separate component than the state machine interpreter, loaded only at authoring time, and they could communicate via generic persistent **clay-like** data structures, using a documented format, so that other programs and components could inspect, construct, and modify state machines, too.

This brings us to using **component technology**. Instead of trying to come up with the one "killer visual programming language", it would be better to have a system that allows you to plug together a collection of micro-visual-languages, into a common framework through which they can communicate. This is the way Microsoft's going with their ActiveX strategy, using the plug-in **IScriptingEngine** interface, that allows Visual Basic Script, Java, JavaScript, and other languages to interoperate in Internet Explorer the Windows desktop, and other environments. I think there are wonderful opportunities for synergy.

---

## Modern echo — Snap! (written before it existed)

The closing pitch — **micro-visual-languages** in a common framework, not one closed killer VPL — is what [**Snap!**](https://snap.berkeley.edu/) actually shipped, via Logo and constructionism rather than ActiveX.

| MediaFlow question (1996) | Snap! answer |
|---------------------------|--------------|
| General language vs special-purpose authoring tool? | **Serious** blocks language — lists, procedures, continuations — still approachable |
| One killer VPL vs plug-in micro-languages? | **Build Your Own Blocks** — custom blocks as reusable micro-languages |
| Closures and control on wires? | First-class procedures; **Y combinator** in blocks ([Jens Mönig](../jens-monig/README.md)) |
| Clay dictionaries for persistence? | First-class data — lists, sprites, costumes — inspectable and shareable |
| Type `sqrt(x*x+y*y)` into a graph? | Compose blocks; scripts are readable text too |
| Compile to Java bytecode? | Run in the browser on **Morphic.js** — live, forkable, classroom-scale |

**Snap! got so much right.** Don's 2026 read: read this 1996 essay as prior art that Snap! vindicated — especially the insistence that visual programming must not devolve into graphics editing alone.

Show seeds: [Brian Harvey](../brian-harvey/README.md) · [Jens Mönig](../jens-monig/README.md) · [Snap!/Logo show](../../repo-shows/REPO-SHOWS.yml) · [constructionist trail](../../process/trails/constructionist-lineage.md)

---

## Modern echo — MOOLLM (written before it existed)

The **Keyboard-first editing** namespace paragraph is the MOOLLM constitution in embryo:

| MediaFlow (1996) | MOOLLM |
|------------------|--------|
| Tree-structured namespace (Java packages) | **Directories are rooms** — the filesystem is the game board |
| Path to address any element, like **Self** | **`import self from self`** — prototype OOP over paths ([David Ungar](../david-ungar/README.md)) |
| Unique names, nicknames, scoping rules | **K-lines** — symbolic activators; mix in APIs and people by naming them |
| Prompting / completion over dynamic environment | **Semantic Image Pyramid** — GLANCE → CARD → SKILL; yaml-jazz for humans and LLMs |
| Textual human-readable persistence | Git-addressable yaml-jazz artifacts; [GitHub-as-MMORPG](../../process/trails/yaml-jazz-collaboration-stack.md) |
| Clay dictionaries externalize state | YAML structure carries data; comments carry *why* |

Written in 1996 for a visual dataflow language that never shipped as one product — but the **addressing model** is what MOOLLM runs on today.

→ [`import-self-from-self.md`](import-self-from-self.md) · [MOOLLM](https://github.com/SimHacker/moollm) · [Self × MOOLLM](../../repo-shows/david-ungar-self-moollm.yml) · [moollm-compose trail](../../process/trails/moollm-compose.md)

---

## See also

| Link | Why |
|------|-----|
| [Tom Ngo ECG at Interval](tom-ngo-embedded-constraint-graphics-at-interval.md) | Simplicial complexes, Mouther — parallel Interval thread |
| [Breakfast simplex](breakfast-simplex-barycentric-direct-manipulation.md) | Barycentric direct manipulation — same geometry as ECG |
| [Pluggers survey (1996)](https://donhopkins.com/home/interval/pluggers) | COM, OLE, CORBA, OpenDoc, Java — the component landscape this doc assumes |
| [Kaleida ScriptX](kaleida-scriptx-dreamscape-multimedia-lisp-machine.md) | Pipe protocol, closures, control+data codesign in practice |
| [Dan Ingalls — Fabrik / Livelymerge](../dan-ingalls/ideas.md) | Parallel visual-programming thread; Ink & Switch episode |
| [**Snap!** (Brian Harvey + Jens Mönig)](../jens-monig/README.md) | Vindicates much of this essay — BYOB, first-class procedures, live Morphic |
| [Constructionist lineage](../../process/trails/constructionist-lineage.md) | Logo → Snap! → Micropolis — where the micro-language vision landed |
| [**MOOLLM — import self from self**](import-self-from-self.md) | Tree namespace + Self paths → K-lines, rooms, Self-ish OOP over git |
| [YAML Jazz collaboration stack](../../process/trails/yaml-jazz-collaboration-stack.md) | Clay-like persistence, comments as intent — modern echo of Bongo dictionaries |
| [**IFC vs Bongo**](ifc-vs-bongo-comparison.md) | Full Interval analysis of Bongo `getProperties` + property sheets |
| [Live objects trail](../../process/trails/live-objects.md) | Smalltalk → Self → NeWS → Java; Fabrik and live authoring lineage |
| [`history/interval-research.yml`](history/interval-research.yml) | Machine-readable distill of this era |

*Original publication: [donhopkins.com/home/interval/mediaflow-design.html](https://donhopkins.com/home/interval/mediaflow-design.html)*
