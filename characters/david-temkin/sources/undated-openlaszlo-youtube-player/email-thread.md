# Openlaszlo Youtube Player

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 5 November 2006 at 00:24:33 GMT+1  
        **Subject:** OpenLaszlo YouTube player  
        **To:** proposals@oreilly.com, Don Hopkins <dhopkins@DonHopkins.com>

        I have an idea for an interesting and practical article, which is very timely:

I'm developing video streaming components for OpenLaszlo, and I've written a YouTube video player demo, in OpenLaszlo and Java. All the code is open source and cleanly written.

OpenLaszlo YouTube Player Demo and Source Code:
http://www.donhopkins.com/drupal/node/126

OpenLaszlo YouTube Player full size in a resizable window:
http://www.donhopkins.com/trunk/demos/youtube/youtube.lzx?lzt=swf

It has a client side written in OpenLaszlo, and a server side written in Java. 

The server is a simple JSP that calls on YouTube's web API, and does some html screen scraping to get the URL of the FLV video file, and it returns search results and video details to OpenLaszlo as XML documents. 

The client has a button to display today's featured videos, a text field to search videos by keyword, and a user name field to display a user's videos. It has a scaling scrolling list of video thumbnails that pop up the title and description when you mouse over them, and play the video when you click them. It immediately starts playing the results of a search, and automatically goes on to the next result after one finishes playing, so you can run it like a "screen saver" to continuously play a list of videos from YouTube. 

The YouTube player demonstrates some important OpenLaszlo programming techniques and efficient AJAX protocol design patterns, and it's an ideal starting point for anyone who wants to develop their own custom video players for YouTube, Google Video, MySpace, Yahoo, or any other FLV video source (like Flash Media Server or Red5). It's timely because of the current interest in video streaming services like YouTube, the drive to integrate web services and build custom AJAX applications around user created content, and its use of the new video streaming classes that I'm developing that will be included with the next version of OpenLaszlo. 

Here's a message I wrote about it, in response to someone's questions about Laszlo architecture and client/server protocol design.

    -Don


Alik Hochner wrote:
Hello there,

My name is Alik Hochner, I'm from Jerusalem, Israel and I'm 24 years old.
Recently I'm involved in an idea for a website for collaboration of video production.
Since my background in computers is mainly system administrator and not web developing, 
I started searching the net to see what's hot. Till I found Laszlo and immediately fell in love.

I wrote some small applications and completed several tutorials (including yours "Spice PHP applications"). 
But I'm still confused regrading they way to implement Laszlo at my website.
I've read that there are two ways: Proxied / Solo.
The problem with proxied is that you need to maintain a Laszlo server and with solo that it is a bit limited. 

I've searched the net for hosting solutions for Laszlo and found out that there are a few and quite expensive.
I've searched the forums to see what the solution Pandora.com and others chose with no success. 

I tend to build the website in similar architecture to your tutorial: A php server with Laszlo GUI. 
In that case, should I deploy my Laszlo solo or proxied?
What about performance issues?

Another issue that bothers me is whether Laszlo able to work with Hebrew?
I've tried writing a small application with UTF8 but it didn't work ...
Any ideas? An example would be awesome.

I'd appreciate any kind of help. 

Thanks a lot,
                   Alik Hochner

Don Hopkins wrote:
Hello Alik. Thanks for your questions, which I'll attempt to answer.

It's best to avoid OpenLaszlo proxied mode if possible, and just run the OpenLaszlo server on your development machine. 

The OpenLaszlo server can perform a lot of different functions, including transcoding, proxying and compiling programs, not all of which are needed by a particular application. 

It's possible to write proxies and transcoders in other languages, so you only really need the OpenLaszlo server if you want to dynamically compile OpenLaszlo programs on the fly. Python, Ruby, Java and PHP all work well for writing proxies and transcoders, depending on the kind of data formats you need to work with. 

The OpenLaszlo source code depends on a bunch of stand-alone Java libraries for manipulating Flash files, XML and images, which (if you're using Java) you could use in your own applications without incorporating the entire OpenLaszlo server. 

One thing the OpenLaszlo server does that you can implement in other ways is transcoding media. Different versions of the flash player only support certain types of media, so if you want to load a gif image from another server whose content you don't have control over (for example, a gif thumbnail of a person from a social networking site), then you need a server somewhere to transcode it from gif to something the flash player can read like swf or png. A lot of scripting languages support the "ming" dynamic swf generation toolkit, and there are other libraries like Python's "flashticle" for reading and writing Flash content on the fly (including swf and flv). 

Another thing is performing SOAP and XML/RPC requests on behalf of the OpenLaszlo client. It's easiest to use ReST instead of SOAP and XML/RPC, since it's so much less complicated and lets you tailor the XML for your particular application (simplifying the XML to make data binding to visual Laszlo classes more direct, resulting in less processing and simpler code on the client). But if there's an existing SOAP or ReST service you have to use, then you can write a proxy on the server to translate between simple ReST requests from OpenLaszlo to more complex remote procedure calls. This lets you do some processing and filtering and multiple requests on the server side  (where the network's lightning fast), so you can have a more efficient client/server protocol (because that goes through skinny pipes to the client, so it should be optimized, where remote procedure calls from server to server across the backbone can send lots of fluffy data quickly and don't need to be boiled down to the bare essentials). 

A great example of this philosophy in action is the Cooqy OpenLaszlo interface to eBay, which lets you browse eBay efficiently over a low-bandwidth dial-up line. The Cooqy server talks to the eBay web API, and boils it down to the essential results to display in the OpenLaszlo client, which downloads XML and images incrementally and starts displaying results immediately. So the client/server protocol between the client and Cooqy is extremely efficient, while the server/server protocol between Cooqy and eBay runs between fast servers over the internet backbone. 

http://www.cooqy.com/

Rich object oriented interfaces like the eBay web service API aren't always the right level of abstraction for the most efficient client/server communication. So there are some good reasons to make a proxy server that boils everything down to your own application specific XML format, instead of trying to mash together a whole bunch of complex general purpose APIs in the client. Cooqy does a great job of distributing the processing and network load so it works well over a low speed network connection, so it's much more efficient that the equivalent html pages. Plus it doesn't hurt that the entire Cooqy application is smaller than eBay's html home page!

The other issue you have to deal with are the security restrictions on the Flash player downloading xml and swf files from other servers than the one it's running from. The remote server you want to download xml from must give you permission with a "crossdomain.xml" file. If you need to download swf or xml from a server that doesn't give the Flash player permission with a crossdomain.xml file, then that's another reason you might want to have a proxy running on your own server. 

And of course there are always unfortunate browser bugs that may force you to use a proxy. Internet Explorer has a bug that makes it impossible to download compressed content into plug-ins like Flash, which you can work around with a proxy. 

The first version of the YouTube player I wrote in OpenLaszlo had the Flash player directly download the YouTube text html web page for the video, and then it parsed out the url of the FLV file from the web page so it could play it directly. Unfortunately that only worked in Firefox because of a bug in Internet Explorer not delivering compressed text content to plug-ins (and YouTube gzip compresses their web pages). So I had to write a proxy on the server to perform the screen scraping. While I was at it, I moved most of the processing to the server, and that made the OpenLaszlo client a lot simpler and more generic. (For example, it could support other video streaming services as well as YouTube.) 

You can run the YouTube player here:

http://www.donhopkins.com/trunk/demos/youtube/youtube.lzx?lzt=swf

This is the youtubeplayer component source, and its supporting lzx files:

http://www.donhopkins.com/trunk/demos/youtube/youtubeplayer.lzx?lzt=source
http://www.donhopkins.com/trunk/demos/youtube/youtube.lzx?lzt=source
http://www.donhopkins.com/trunk/demos/youtube/videolibraryicon.lzx?lzt=source
http://www.donhopkins.com/trunk/demos/youtube/videolibrarypopup.lzx?lzt=source

Here's the source of the YouTube proxy I wrote in Java, as a JSP. I've copied it to another file and added the .txt extension so you can look at the source instead of executing it. 

http://www.DonHopkins.com/trunk/demos/youtube/youtube.jsp.txt

It performs a ReST call on the YouTube API to perform searches (which only returns the id of the video and the url of the html web page the view the video, but not the actual url of the FLV video file). When the user plays the video, it performs another call to download the web pages of the video, and scrape out the URL of the FLV file from each one. 

The youtube proxy supports the following functions:

videoGetFlvUrl(id)
http://www.DonHopkins.com/trunk/demos/youtube/youtube.jsp?method=videoGetFlvUrl&id=SRCux7wefH0

videosListFeatured()
http://www.DonHopkins.com/trunk/demos/youtube/youtube.jsp?method=videosListFeatured

videosListByTag(tag) // comma separated tags
http://www.DonHopkins.com/trunk/demos/youtube/youtube.jsp?method=videosListByTag&tag=kitten,cute

videosListByUser(user)
http://www.DonHopkins.com/trunk/demos/youtube/youtube.jsp?method=videosListByUser&user=marccanter

A lot of work has gone into optimizing the Laszlo Mail client/server API. You can watch how it works with the "Fiddler" proxy utility, which you can use as an http proxy with Internet Explorer or Firefox. It captures all the requests, responses, headers and bodies that go back and forth, so you can see exactly how Laszlo Mail, Cooqy, Pandora or any other application talks with the server. (Unfortunately the Fiddler proxy doesn't support streaming content, so when Fiddler is engaged you have to wait for stuff like flv videos and mp3's to completely download, before they start playing). 

I think OpenLaszlo is supposed to support Hebrew, but I haven't tried that myself. I've seen it display Chinese text in the descriptions of YouTube videos, so it probably works ok with unicode Hebrew text as well, once you hammer out all the xml encoding and declaration issues. So you can probably process Hebrew text, but I'm not sure if you can name your variables and classes in Hebrew (although that would be cool if you could). 

    -Don




Begin forwarded message:

---
