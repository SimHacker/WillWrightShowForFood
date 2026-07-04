# Laszlo For Lua? "Openluaszlo"

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 24 August 2006 at 16:00:19 GMT+2  
        **Subject:** Laszlo for Lua? "OpenLuaszlo"  
        **To:** lua@bazar2.conectiva.com.br

        Hello, Lua community!

I just posted the following message to the OpenLaszlo developers mailing list, but it also might be of interest here.

But first for context, here's a little background about OpenLaszlo:

You can read about OpenLaszlo and Project Legals (OpenLaszlo for Multiple Runtimes) here:
http://www.openlaszlo.org

Here's an article I wrote about "What is OpenLaszlo, and what's it good for?", that shows many examples, and discusses the future of OpenLaszlo, which might help explain its potential relationship with Lua, as a runtime platform:

http://www.donhopkins.com/home/124

----

What's the Future of OpenLaszlo?

OpenLaszlo is designed to use open standards, and built with open
source tools and technologies. It's a high level architecture designed
to target multiple rendering environments, and the first one it
currently supports is Flash.

OpenLaszlo's platform independent architecture gives it the ability to
target other runtime environments like DHTML, Java, XUL, Avalon, SVG,
open source Flash players, cell phones and other embedded devices, as
they become more powerful and mature. The Platform Roadmap describes
the development goals and progress towards the next major release,
which will include support for multiple runtimes, and many
architectural improvements.

----

Laszlo for Lua? "OpenLuaszlo"

This is some long term dreaming about multiple runtimes -- I'm not
asking for this tomorrow (although that would be nice)...

I've been looking at Lua, and it's pretty amazingly simple and efficient
and well designed.

It's widely used for scripting computer games, like World of Warcraft,
because it's so small and efficient.

The Lua virtual machine only has 38 byte codes (!!!), and the C
extension interface is nice and clean and easy to use, and the language
itself is at least as flexible as JavaScript, and much better designed.

http://www.lua.org

And fortunately SWIG supports Lua, so it's quite easy to plug libraries,
C structures and C++ classes into the scripting language as first class
fully integrated objects.

http://www.swig.org
http://www.swig.org/Doc1.3/Lua.html

The issue of easily integrating native libraries and C++ classes with
the scripting language is extremely important, and Lua+SWIG really
supports that well.

I've used SWIG a lot to intergrate gnarly C++ classes and templates with
Python, and I really love it, since it's saved me decades of tedious
drudge work.

SWIG enables a whole new approach to incremental interactive
development, debugging and experimentation. Since SWIG automatically
generates your scripting language wrapper glue code for you, there is
absolutely no friction to changing an API or C++ class definition during
development. So you can try your new classes out in the scripting
language seconds after inventing or changing the API.

But without SWIG, you have to write all those wrappers by hand (and test
them to make sure you didn't make any typos). Then it becomes a huge
investment of time to make any change to the API, because you've painted
yourself into a corner. So without SWIG, you're discouraged from
iterative development, experimenting and making changes. You're forced
to delay plugging your objects into a scripting language until after the
API is stabilized, which is no fun.

But it's while you're making changes to the API that it's most useful to
play around with your objects from an interactive scripting language! So
SWIG totally accelerates the development process by letting you easily
iteratively evolve the APIs of the code you're developing, and instantly
regenerate perfect wrappers automatically, to test out the code from any
number of scripting languages.

I've been playing around with SpiderMonkey, and I've been disappointed
that SWIG doesn't support it, and that it has a really cheezy, confusing
and badly documentd C api.

So it's a real pain to add extensions to it, and a lot of work to make
C++ objects look and feel like JavaScript objects. (That's what SWIG's
great at doing automatically.)

http://www.mozilla.org/js/spidermonkey/

However, I've found a C++ template library called "SpiderApe" that helps
with interfacing C++ code with SWIG (kind of like the Boost.Python
library for integrating C++ and Python).

But SpiderApe is not as universal and powerful as SWIG.

http://spiderape.sourceforge.net/

SWIG lets you wrap C code and libraries whose APIs you don't control,
extend your wrappers with convenience functions to make your objects
easier to use in the scripting language, hide properties and methods you
don't want to expose, and write type specific input/output/return value
conversion functions with typemaps). SWIG also supports many other
scripting languages with the same interface definitions (you write ".i"
files that look like annotated C or C++ headers, and can have
conditional scripting-language-specific sections and typemap libraries
to tailor the interfaces to certain languages, and SWIG compiles them
into wrappers for any number of different scripting languages, including
Lua and many others, but currently not including SpiderMonkey). SWIG
(almost) totally understands C++ classes, including templates, smart
pointers, the standard template library, etc!

There's also an amazing project called jsdb that is based on
SpiderMonkey (with XML support) with some brilliant extensions for
database access, activex/ole automation integration, and a whole lot more.

The interfaces to native libraries in jsdb are tediously hand written
with weird CPP macros, instead of using something like SWIG or SpiderApe
to make it easier.

It looks like it was a lot of work, and since it's all hand written
wrapper code, it requires a lot of effort to modify and maintain or
write new interfaces, especially if the interfaces change during
development.

That's a good example of why SWIG needs to support SpiderMonkey: it
would really make it a whole lot easier to plug stuff together, and then
call it from OpenLaszlo.

http://www.jsdb.org

The source code of the ActiveX integration into jsdb's JavaScript is an
awesome and frightening sight to behold, if you're into watching slow
motion train wrecks that might actually be extremely useful.

http://www.jsdb.org/jsdbhelp.html#ActiveX

SpiderMonkey plus extensions like JSDB will make a fantastic "headless"
or "server-side" runtime for OpenLaszlo. Especially when OpenLaszlo
supports the E4X XML extension to JavaScript, which is built into
SpiderMonkey.

Unfortunately I'm pretty disappointed that SpiderMonkey weighs in as the
slowest language in the programming language shoot-off, even slower that
PHP!

http://shootout.alioth.debian.org/debian/benchmark.php?test=all&lang=all&lang2=gnat

So are the benchmarks in the shootoff unfair, or is SpiderMonkey just a
badly implemented JavaScript interpreter, or is JavaScript such a poorly
designed language that it's impossible to make it run fast, or what?

...Slower than PHP??! I mean, sheez! How embarrassing! That's like
getting picked for a dodgeball team AFTER the geekiest weakling nerd.

How much faster is Rhino running on a good Java VM?

How does SWF9 compare to Java's HotSpot VM (which uses compiler
technology derived from Self)?

Is there any open source JavaScript runtime that can compare to SWF9?

This all makes me wonder if Lua wouldn't be a good runtime for
OpenLaszlo to target, because it's so fast, portable, fits on small
platforms, and integrates easily with native libraries and C++ code.

Then you could write World of Warcraft add-ons in OpenLaszlo!  ;-)

Is there any way of making "OpenLuaszlo" run even faster?

How about writing parts of the OpenLaszlo runtime in super-optimized C
or C++, and then using SWIG to plug them into virtual machines like Lua
and SpiderMonkey (once somebody gets around to writing a SpiderMonkey
back-end for SWIG)? And then using SWIG to integrate other useful code
(like a sprite engine, or OpenGL)?

 -Don






Begin forwarded message:

---
