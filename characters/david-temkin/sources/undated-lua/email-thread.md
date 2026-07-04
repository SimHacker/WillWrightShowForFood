# Lua

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · David Temkin <temkin@laszlosystems.com>

        **Date:** 31 August 2006 at 18:59:17 GMT+2  
        **Subject:** Re: Lua  
        **To:** Don Hopkins <dhopkins@DonHopkins.com>

        Wow, you're serious about this!! I'll read more (via the links below).

I don't think this is super-realistic right now (particularly given that it's a *serious* chunk of work and that it would involve a runtime that no one has installed now) but it sure is interesting. One related thing that's going on now, FYI, is making OL work with mobile Java (J2ME). People at Sun are working on this and we hope we'll get the work integrated sometime soon. That configuration will use Rhino in order to compile JS into Java bytecode. Performance implications are currently unclear.

- D.


On Aug 31, 2006, at 3:49 AM, Don Hopkins wrote:

Here's a summary of what I've learned about Lua, and my answer to your question about what would be cool for Dave Ungar to do.

In terms of speed and memory, here's how Lua stacks up against other languages:

http://shootout.alioth.debian.org/gp4/benchmark.php?test=all

Lua gets a better score than Python, Pike, TCL, MzScheme, Perl, PHP, Icon, Smalltalk GST, Ruby and SpiderMonkey. Most of the faster languages are compiled (though SmallTalk VisualWorks, C# Mono and Java JDK server score quite well, with their good VM's).

SpiderMonkey is at the bottom of the pile, while Lua's at the top of the interpreted languages:
http://shootout.alioth.debian.org/gp4/benchmark.php?test=all

Lua totally kicks SpiderMonkey's ass in a head-to-head -- it's not even funny, except for that one exception that proves the rule (Lua used a lot of memory for fannkuch):
http://shootout.alioth.debian.org/gp4/benchmark.php?test=all&lang=lua&lang2=javascript

Lua is a simple, well designed language with a very nice VM, and its object and execution models are close enough to JavaScript (but not nearly as quirky), that I think it would be straightforward to target it with the OpenLaszlo compiler (not trivial of course, since I'm sure there are a lot of wrinkles to get fucked up JavaScript semantics exactly right, but we have a compiler and that's what it's for).

You'll be interested to know that there's a JIT for Lua:
http://luajit.luaforge.net/

Earlier you asked me what would be cool for Dave Ungar to contribute to OpenLaszlo.
I think a series of fun things he could do is: create a kick-ass Lua back-end (a non-JavaScript-based platform would prove that OpenLaszlo supports a wide variety of runtimes, and since it's open source and easily extensible, we can build our own engine with extra features, and implement parts of the lzx runtime in native code), and then a kick-ass Lua compiler (work with LuaJIT project and make it into a state-of-the art industrial strength compiler, and extend it to support other processors like ARM, to target embedded devices), then a kick-ass debugger, then a kick-ass 3d rendering engine to celebrate the all previous asses kicked, and then a cool user interface to top it all off!

Then we'd have the much sought after open source OpenLaslzo engine and debugging environment, and it wouldn't suck, and it would run on small platforms, and it would be great for developing games with!

There's also the fact that Lua has a lot of appeal to computer game developers (also embedded device and handheld developers), since everybody's already using it, and it's successfully proven itself in that space.
And having Dave Ungar working on a Lua compiler would certainly legitimize Lua and OpenLaszlo to the Java and Smalltalk communities, who benefit from his work every day.

Next time I'm in and you have a few minutes, I'll show you some of the World of Warcraft user interface stuff people are doing with XML+Lua. There's an extension called "auctioneer" that scans and analyzes all the stuff in the in-game auction house, keeps a database of objects and prices, and helps you search and snipe good deals at the last minute, competitively price your own objects, undercut other people offering the same objects, etc. Totally scripted in Lua by a team of WOW players who know Lua!

http://auctioneeraddon.com/

Screen shots:
http://auctioneeraddon.com/?p=screen

  -Don




Begin forwarded message:

---
