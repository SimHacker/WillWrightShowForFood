# [Laszlo-Dev] Laszlo Architecture Confusion

*2 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@donhopkins.com>

        **Date:** 7 November 2006 at 00:03:46 GMT+1  
        **Subject:** Re: [Laszlo-dev] Laszlo Architecture Confusion  
        **To:** Alik Hochner <alik.hochner@gmail.com>, OpenLaszlo development and bug reporting <laszlo-dev@openlaszlo.org>

        I'm glad that helped! You're certainly welcome.

Since you found it useful, I'll ask the Laszlo tech writers about working the answers to your questions into the documentation or programming guide somewhere.

The crossdomain.xml is a solution to a restriction that only applies to the Flash player. Code running on the server isn't restricted, so you can configure apache to proxy automatically, or write a script that proxies, to fetch content from sites that don't have a crossdomain.xml.

But of course you should be careful about the security implications, because you're opening your server up to abuse with an unrestricted proxy.

You can use Apache rewrite rules and tricks like that to restrict the urls that it will proxy (but it's easy to make subtle mistakes and leave unexpected security holes), or you can write a proxy script that carefully validates the parameters and figures out the url to proxy in a trustworthy manner.
For example, the client could pass the video id, and the server looks up the url and proxies its contents, instead of the client sending the actual URL to proxy.
That way you don't have to trust the client to hand you a valid url, so it's more secure.

I've had problems with the same error "WARNING: LzLoadQueue.serverlessOnDataHandler load failed".
It has to do with a request coming back but missing data (by the time it gets to the Flash player).
That happened when I tried to download an gzip compressed html file into the Flash player embedded in Internet Explorer. It worked in Firefox though.
So try it out in different browsers and if you can on different platforms, to see if it's a browser related issue.

Use Fiddler to take a look at all the headers and content, and look to see if it's actually returning any data, or using any encodings.
http://www.fiddlertool.com

The IE bug I was experiencing actually received the complete gzip encoded result from the request, which fiddler could un-gzip and display correctly, but it just wasn't making it to the Flash plug-in. The plug-in's receive data handler was being called, but the data was null, which caused the "load failed" error to happen (and the ui would freeze of for a few seconds).

One way to check if it has something to do with the zgip encoding is to use Fiddler's Rules => Remove All Encodings feature.
When the YouTube player was scraping web pages directly, it worked in Firefox but wouldn't work in IE unless I ran it through Fiddler and enabled "Remove All Encodings".

  -Don


Alik Hochner wrote:
WOW! This is one great answer!!!
Thanks a lot!

As you suggested I started writing something with the RESTain architecture.
The problem I have is with the crossdomain.xml thing.
I succeeded calling the php webservices only with the redirect inside Apache (as you did in your tutorial). I couldn't make it work with the crossdomain.xml ...

I've searched the forums and found the following post:
http://forum.openlaszlo.org/showthread.php?t=7503
I did exactly as it stated and still it doesn't work.

If you have any idea I'd appreciate it very much and if not I still appreciate your time and effort.

Thanks,
          Alik




Begin forwarded message:

---

## 2 · John Sundman <jsundman@laszlosystems.com>

        **Date:** 7 November 2006 at 01:00:28 GMT+1  
        **Subject:** Re: [Laszlo-dev] Laszlo Architecture Confusion  
        **To:** Don Hopkins <dhopkins@donhopkins.com>

        I have noted with great appreciation Don's two recent posts on this subject.

Inasmuch as we have a signed contributor's agreement from Don, I'll be borrowing liberally from his lucid explications when I revisit this topic for Legals documentation.  Because this is fresh in all our minds, I'll try to get that done this week.

Thanks,

jrs


Begin forwarded message:

---
