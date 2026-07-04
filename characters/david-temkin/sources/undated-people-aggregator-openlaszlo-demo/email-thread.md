# People Aggregator Openlaszlo Demo

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 29 September 2006 at 18:46:08 GMT+2  
        **Subject:** People Aggregator OpenLaszlo demo  
        **To:** Marghi Hopkins <marghi1@netzero.com>, Sarah Allen <sallen@laszlosystems.com>, Don Hopkins <dhopkins@DonHopkins.com>

        Here's an OpenLaszlo PeopleAggregator demo that I developed for Marc Canter, to show to AOL.
He just demonstrated it to them, and it impressed them, and we got the gig!

http://www.donhopkins.com:8080/video/my-apps/bbm/main.lzx

It talks to the server written in Python, that goes out to Google Video, YouTube and MySpace, logs into your account, and scrapes the html web pages to download lists of all the videos, and let you play them by clicking on their thumbnails!

The Google Video tab all works, but I'm still working on the YouTube and MySpace tabs.

I factored the video components out into separate files, one per class, and rewrote the YouTube and videoplayer tests as well as Marc's fancy demo to use the components.
The YouTube demo has a new feature: now you can resize the pane by dragging the gray bar between the video player and the controls.

http://www.donhopkins.com/video/test/video/test-youtubeplayer.lzx?lzt=swf

Here are the new components, which you can view by putting "?lzt=source" and the end of the urls in the directory listing:

http://www.donhopkins.com:8080/video/lps/components/av/

  -Don




Begin forwarded message:

---
