# [Laszlo-Dev] Proposed Video Api Changes

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Sarah Allen <sallen@laszlosystems.com>

        **Date:** 24 August 2006 at 00:42:04 GMT+2  
        **Subject:** Re: [Laszlo-dev] Proposed video api changes  
        **To:** Don Hopkins <dhopkins@donhopkins.com>

        Thanks for writing up all of this Don!  My comments interspersed
below...

On Wed, Aug 23, 2006 at  3:05 PM, Don Hopkins wrote:

I'm working on cleaning up and refactoring the OpenLaszlo video 
components, and I've got some changes to the api to propose. I'd 
appreciate any comments, please.

The name of the "stream" class seemed pretty vague and likely to cause 
name collisions with user code, and it was the same name as other 
classes were using for an instance variable, so I propose changing it 
to "mediastream". The videoview's "stream" instance variable (which 
holds a mediastream) will remain the same.

I like the "mediastream" name idea

The microphone and the camera classes share a lot of code, so I 
factored out a common base class called "mediadevice" that handles all 
the stuff that's the same about the camera and the microphone. In 
refactoring, I found there were some instance variables and methods 
that did the same things but were named differently. So I standardized 
the names of the shared attributes and methods between the camera and 
the microphone.

This is nice.

Both the camera and microphone now have attributes named "deviceindex" 
and "devicename" (instead of the "index" and "name" attributes that 
one of them had before). They also have a boolean "allowed" that tells 
if the user allowed their use via the security dialog (instead of the 
previous string attribute "access" whose values were "allowed" or 
"denied"). Before it knows if it's allowed or not, "allowed" is set to 
null, then it's set to boolean true or false when it gets the callback 
or manages to initialize the device without causing the security 
dialog to pop up (if the user checked the box to always allow access).

Macromedia's apis use the name "mute" to disable the camera and the 
microphone, but I propose changing it to "capturing" (and negating the 
sense of the boolean value, since capturing == !mute). That word 
applies to both audio and visual, while "mute" isn't appropriate for a 
camera and is more appropriate for a speaker (output) than a 
microphone (input). Of course "deaf" and "blind" would be more 
descriptive for disabling a microphone and a camera respectively, but 
that's just too anthropomorphic for me, and I'd rather they both use 
the same word for the same concept, so the best I could come up with 
was "capturing". Can anyone think of a better word?

Can't think of a better one.  Capturing sounds fine.

The way Macromedia's notification works when the user allows access to 
the camera or microphone is pretty cheezy. It conflates permission to 
use any camera equivalent to permission to use any microphone, and 
vice-verse, but it only notifies one of them arbitrarily. So if you 
have both a camera and a microphone, or any number of each, and you 
enable any one of them or all of them, the user will be prompted with 
one security dialog, and only one device but not any of the others 
will be notified of the status change. Any reasonable OpenLaszlo 
programmer would expect notification for each microphone and camera, 
so you can make a constraint on the "allowed" attribute that controls 
the presentation or whatever (like giving the user visual feedback of 
each device's status). So I'm handling that stuff in the shared 
mediadevice base class, instead of handling the cameras and 
microphones separately. It keeps a list of all existing mediadevices 
(camera or microphone), and then it broadcasts the "allowed" status 
change to all devices, whenever one device of any type is either 
notified of an allowed status change, or figures out the allowed 
status (by initializing the device for the first time, and noticing 
that it's actually enabled immediately -- in the case that the user 
checked the box to always allow permission, there is no notification 
so you have to figure it out on the fly).

The point of this API is to hide the quirky behavior and 
inconsistencies of Macromedia's classes, so that the same API could be 
used to wrap other audio/video apis on other platforms, as simply as 
possible (but no simpler). Howerever, it does still expose the concept 
of an "rtmpconnection", and it passes through a bunch of other 
Macromedia specific methods and attributes like the camera's setMode 
and setBandwidth methods.

What do people think of renaming "rtmpconnect" to something more 
generic like "mediaserver" or something like that? Or is it better to 
let that part of the API remain Flash-specific? I'd like to strike a 
balance between coming up with a super-generic interface, and 
supporting (and not surprising) Flash programmers who want to take 
full advantage of what Flash and the Media Server / Red 5 can do.

well... I was thinking that 'rtmpconnection' isn't specific to Flash 
per-say, but rather to the rtmp protocol which was created by the  Flash 
folk.  I would think that if it talked to a different server, there 
would need to be another class that spoke that protocol (maybe with a 
common base class in the future).


Here is the wiki page with the current documentation, which I'll 
update with the new api when the paint is dry:

http://wiki.openlaszlo.org/Video

   -Don


_______________________________________________
Laszlo-dev mailing list
Laszlo-dev@openlaszlo.org
http://www.openlaszlo.org/mailman/listinfo/laszlo-dev



Begin forwarded message:

---
