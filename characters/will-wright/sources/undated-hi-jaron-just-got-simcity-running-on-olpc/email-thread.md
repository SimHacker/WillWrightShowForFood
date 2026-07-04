# Hi Jaron! Just Got Simcity Running On Olpc!

*1 messages — verbatim from lots-of-chat.txt scoop.*

## 1 · Don Hopkins <dhopkins@DonHopkins.com>

        **Date:** 30 December 2006 at 23:50:35 GMT+1  
        **Subject:** Hi Jaron! Just got SimCity running on OLPC!  
        **To:** sugar@laptop.org

        Hi, Jaron! It was great fun talking with you at Will Wright's xmas party.

Will has started the ball rolling to convince EA to make SimCity open source, for the OLPC (One Laptop Per Child) project.
It's not a done deal yet, but so far it's going smoothly and nobody's head has exploded.

I just received an OLPC beta laptop, which runs RedHat Fedore Core Linux and a new user interface environment called "Sugar", written in Python (yum) with the GTK.
And now I have SimCity running on the OLPC laptop! I've enclosed some pictures.

It would be fun to hang out with you some time around Berkeley, and then you can check it out and play with the hardware and software.

The screen is quite amazing -- it has a very hires black and white resolution, with lower resolution color. So the interface comes out quite small but extremely sharp.
Unfortunately my webcam couldn't focus closely enough on the screen to bring out the detail, but at least the pictures let you see how much information is packed on the tiny display.

I like what they're doing with the Sugar user interface and programming environment: it has a good development environment based on Python, and includes interesting software like Squeak with the EToys visual programming language / simulation environment.

There's a bunch more integration work that needs to be done, rewriting SimCity to use Python as the scripting langauge and GTK/Cairo as the user interface and rendering library, instead of the ancient version of TCK/Tk it's currently using, and adapting the interface to the hardware.

And of course once it's integrated with Sugar and scriptable from Python, there will be many interesting ways to adapt it to take advantage of the Sugar environment, internationalize it, make it more accessible, usable with the game controller buttons when the screen is folded over in book mode, support multiple players, journaling, customization, scripting, and especially visual programming, etc.

Here's a message I sent to the OLPC Sugar mailing list, describing some ideas about the old HyperLook version of SimCity I developed. (It touches on Body Electric and mentions you as the primary user. Do you know of a good web page I could refer to, that explains Body Electric in depth? There should be a wikipedia article!)

Also I would like to discuss the multi player X11 TCL/Tk version, how it takes advantage of the TCL scripting language, and how it should be ported to Python and other scripting language (by making SimCity into a library or C++ class with proper interfaces and hooks, and using SWIG to wrap its interface, so it can be plugged into many different scripting language.
Another interesting topic is how to redesign and extend the collaborative multi player features (currently SimCity can open several X11 connections to different displays, and players can chat, draw on the map, and vote on issues like building power plants and changing the tax rate) to take advantage of the OLPC's mesh networking, messaging and journaling system, and to better fulfill its educational goals.

  -Don

To: sugar@laptop.org

---
