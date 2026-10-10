# PIXIE and FORTH on PDP-7 Cabinet Emulator with Type 340 Vector Graphics Display

Don Hopkins, 9 October 2026. https://www.youtube.com/watch?v=lo8kdY-5i6c

YouTube's captions, corrected by [corrections.tsv](corrections.tsv) and rebuilt by [build.py](build.py): misheard names and terms fixed, spoken phrasing kept. [transcript.vtt](transcript.vtt) is the same text with YouTube's timestamps, for uploading.

[0:01] This is Heinz Lemke at his PDP-7 with a Teletype and a Type 340 vector graphics display and a light pen  
[0:10] showing PIXIE that he developed at Cambridge University that has one of the first known  
[0:17] radial menus operated by a light pen. So you, that cursor in the center is what you can draw with  
[0:25] and the menu items are around the cursor. Also, there's menu items along the right edge of the  
[0:31] screen to set the different modes for drawing. And if you just touch this with the light pen,  
[0:40] that runs the command. And then it tracks by putting these dots on the screen. Now, see how  
[0:48] you can move it around by dragging the middle. And then you can pop up the menu to select different  
[0:56] components and the menu travels along with you. And the neat thing is you can draw a line and then  
[1:04] undo it by moving back along the line or just do diagonal lines and attach things. So this is a  
[1:12] general purpose drawing editor and it's a vector graphics display with beautiful green phosphor.  
[1:21] Heinz Lemke here scanned 128 pages of PDP-7 assembly language and we have OCR'ed it and  
[1:33] brought it back to life here. Let's see. This is a PDP-7 emulator with a Type 340 graphics display.  
[1:45] Now there's a little bit that we can do since we're running in the web browser. We can do  
[1:51] this vector graphics display is actually another CPU that's sharing the memory with  
[1:58] the PDP-7 and it draws characters and lines and the user interface can look at those things and  
[2:08] know what they are and like what code drew them and how it gets touched by the light pen. So,  
[2:16] see this little spiral here, see, I can zoom in here. This if when you press down and you  
[2:23] start moving, it starts moving along with you. I haven't done anything yet. It's just a track  
[2:27] and cross. But if you move too fast, it gets away from you. So, it pops the menu back up. So, uh,  
[2:33] now we can do these commands. S is to start. Now, that's changed to F. So, for finish. Now, what I  
[2:40] can do now is draw a line. And this is for stair-step lines that you'd use for electrical diagrams.  
[2:47] And then oh, if you don't like that, you can go back. Whoop. So this see this is what Shneiderman  
[2:52] says about uh direct manipulation with continuous reversible actions. So and then you you draw and  
[2:59] then you say, "Oh, I want a capacitor." Boop. And then you can draw some more and bring it  
[3:04] down here. And look how the the resistor goes in the direction that you're going. Resistor  
[3:12] And then like that. And then uh there's you can finish it. Now that becomes your your uh circuit  
[3:20] there. Maybe we can go over here and start another one. Uh so see how the menu goes away when you're  
[3:30] moving and then comes back. And uh you know these [laughter] here, let me go back to normal size.  
[3:38] Uh you know there's like a rubber band. I could finish this boop and then go into rubber band  
[3:44] mode and I'll bring him over here and I'll start one and then ah now we're doing a rubber band. So  
[3:52] um like that finish. Okay. Ah there's some neat things you can do since we're running  
[3:58] this emulator. Um I'll scroll down a little bit. So these are uh panels we can configure. We can  
[4:05] pause the CPU or make it run, you know, maximum 10 times fast or really slow. Oh, the cool thing  
[4:10] is like Oh, look at that. Oh my god. What in the world is that? Um, that's interesting. So,  
[4:16] uh, so we're running it really slow. It's supposed to be updating its screen really fast, but this  
[4:23] is kind of neat. I'll have to figure out why it's doing this. Um, but I've been debugging this code  
[4:30] by running it and finding OCR errors, so you never know. Um, so let's see. Now, a neat thing that you  
[4:38] can do is play. Gives you a little demo button and it's just going to play back some Oh, it's really  
[4:45] fast. I'm at max. Okay, that was not realistic. Let's just only do it at 10 times. So, this is  
[4:53] driving [clears throat] it through the light pen. Okay, so um just do normal one time. So,  
[5:01] see how you can draw and then you draw some more and then you move up. kind of have to steer around  
[5:06] the stuff that's drawn because it confuses the tracking. You kind of trip over it. Um, so yeah,  
[5:13] it's I mean it's very dependent on the way the input device works. So, uh, anyway, this is sort  
[5:21] of like something you your child would draw and you hang on the refrigerator. This was actually  
[5:26] Claude that just came up with these childlike uh, diagram, but that was exactly what I wanted.  
[5:34] So, um, let's see. But there are weird things that you can do since this is a, um, so there's  
[5:40] a TTY. Every good PDP-7 should have a TTY. Hello. Hello. Oh, this one has speech recognition. Um,  
[5:54] Help! It doesn't have any help. Oh, no. [laughter]  
[6:02] There are other programs. Um anyway, uh let me turn off the speech recognition. Uh so anyway,  
[6:10] PDP-10 or you know TTY can't do that, but we can. So uh and it scrolls. So uh let's see where was I?  
[6:19] Oh, right. Every good computer has registers. So and this is the front panel. We're going to make  
[6:25] a more skeuomorphic thing right now, but we're just kind of going for green screen. Um, so the uh Oh,  
[6:32] now registers are nice, but what about memory? Okay, what? Oh my god, look at this. Okay, this  
[6:38] is insane. Okay, I'm gonna have to pause here. Um, what we did is we hand scanned all this code on  
[6:48] paper that we can now single step through. So this is the original code. This is like a source map,  
[6:56] but it goes two levels. It goes from memory into lines from source code and we can even  
[7:04] choose the as7 translation of source code which is a different dialect of PDP-7. So there's multiple  
[7:11] source maps and source maps that go to the scan and we can uh let's see okay yes there go nice  
[7:20] speed here. So, so it's it's executing the code and um we can uh we could just like do a trace  
[7:28] or something like that. But uh anyway, what is interesting about this? Um well, first of all,  
[7:38] memory has the display list. So, these here are actually instructions to draw. And there's this  
[7:48] neat little thing I can do. There's I added like normally you have one light pen but  
[7:52] wow I added, there's eight light pens. We'll have like multi-user stuff for you soon. So you  
[7:57] can edit 340 instructions. So what these are are little drawing commands and they have relative uh  
[8:05] they you know they only have so many bits of how far they can move. So when you draw a long line,  
[8:10] see this line is broken up into smaller lines. And each of these is only allowed see he's he's  
[8:18] like at the end of the leash. So uh but what I'm doing is I'm editing the display instructions in  
[8:27] memory. So look at that. Okay. So see these this memory has PDP-7 code in it but it also has 340  
[8:37] display instructions which is move negative -1227 or so so I'm editing the move instruction and if I go  
[8:46] here it'll go up there and you know it's trying to disassemble it but um so the the the idea is this  
[8:54] display is a vector graphics display and I can make a user interface that just reaches down and  
[9:00] peeks and pokes into memory. Um, and uh, so why would you want to do that? I don't know. But um,  
[9:07] it it's interesting to debug your programs. And uh, let's see. Speaking of which, oh,  
[9:14] so we scanned all this code and the problem was there were some OCR errors and then it was like,  
[9:24] how do we make the light pen work? Okay. So, in 1964, DEC published a light pen test. Bless  
[9:32] their furry little hearts. So, what we can do Oh, yeah. See, that's all it does. It's very This is  
[9:39] so brutalistic. Okay, we do have a I mean, and this is DEC's. There was actually a page missing  
[9:45] from the code. Um, so we we we got to recreate that because it was not too hard to figure out.  
[9:53] But the the thing is oh look see we're we're slowing it down and you can see it's scanning  
[9:58] out. Um this is just uh it's either SVG or PNG but the plan is and Lars Brinkhoff has already done  
[10:07] this. [clears throat] We just need to integrate his code is to have a full uh WebGPU or WebGL  
[10:15] uh phosphor simulator so you'll have the beautiful fading effect. Um, and that that's but right now.  
[10:23] And what I want to do is make it slow enough that you can see the beam scanning out. That's the goal  
[10:29] here. So, but anyway. So, so now the light pen test normally, you know, it's just flickering like  
[10:35] this. And I'm going to get out of uh the thing is, see, this is procedural. So, there's only  
[10:41] really one line. It's just doing in a loop. Oh my god. Have I have I screwed it up? Show in memory.  
[10:47] Oh, you see? Um, so, oh, let me show you the reset button. You You don't want to do that,  
[10:53] but you have to pull it down like that. Anyway, so we're back. The uh there's a play demo for this.  
[11:02] And the demos are neat because they tell you what they're doing. Um, so it's going to it's going to  
[11:06] move the light pen around and uh test out all the light pen. I actually found bugs this way,  
[11:16] you know. So, [laughter] the light pen test was pretty useful. So, um anyway,  
[11:22] not too exciting. Uh more exciting, more to the point. Let's stop the play. Um okay. Oh no, we're  
[11:32] stuck in the demo here. Oh, no. Play. Stop. Okay. Not the world's greatest user interface. So, DUEL,  
[11:40] of course, from 1968. Oh, see see I'm already I'm in like I'm in um see see DUEL drew the two  
[11:52] um spaceships and I'm not running or well it's running but nobody's going anywhere yet. So So let  
[11:59] me go uh WD. So So see it's redrawing the little thing there but you know you you keep your same um  
[12:13] Uh oh. And then bam, bam, bam, bam, bam. Oh [expletive] I'm not that good at this. Oh, okay. Ah,  
[12:21] so what the cool thing is when DUEL ends, it hit a halt instruction. So the emulator knows  
[12:28] it's running DUEL and it halts and it can look in the memory and see like who won and keep a  
[12:34] tally like. So you got this whole outside state in the emulator that can look in and do anything. So  
[12:43] um that that's how we got a nice you know otherwise it just halted. See there's the  
[12:49] halt. There's a halt somewhere trace. Yeah. Halt. So that's uh but anyway so that's the DUEL. Um oh  
[13:01] okay. So I needed to test the TTY. Hello. For the PDP-7 teletype, I think of a number from 0  
[13:08] to 99. You guess it. Press return to start. Um uh return. I am thinking of a number. Your guess 50  
[13:27] your guess.  
[13:30] 20  
[13:34] 20. Well, we got a little 20 your guess. We got a little bounce on the thing here. But at any rate,  
[13:43] HILO game, you know that. And then of course there's LANDER. Lander for the  
[13:48] PDP-7 teletype. You are 500 ft up. Falling at 50 ft a second. You have 60 units of fuel each second.  
[13:55] Burn from 0 to 30. Time is zero. Altitude is 500. Speed 1. 0 time is 1, altitude is 410 time is 2,  
[14:03] time is time is 4, altitude is 380, speed is - 30, altitude is 34, 7.5, speed is - 6, altitude is  
[14:14] 310, speed is -4, your burn time is 7, altitude is 267, 5, speed is -5, your burn time is 8, altitude  
[14:25] is 220, speed is 50, fuel is, your burn time is 9, PDP-7 Forth. Okay, Mitch Bradley. I told Mitch,  
[14:33] "Hey, I have this PDP-7 emulator. It really needs a Forth." And he whipped one out in one day and  
[14:40] it's great. And it turns out the PDP-7 has this really perfect instruction set for Forth. Um,  
[14:49] so let's see where are we going here. If we slow this down. Um, okay. So, oh,  
[14:58] and see Mitch being like the Forth hacker that he is, uh, made a turtle graphics he made a turtle  
[15:08] graphics system. Oh, we're going really slow here. The demo is not designed to be that slow. 2 3 + ..  
[15:14] Okay. 4 0 DO 200 FD 90 RT LOOP. Okay. : SQ 4 0 DO 200 FD 90 RT LOOP ; : FLOWER 8 0 DO SQ 45 RT LOOP ;. Okay. So anyway, you got  
[15:27] : STAR 5 0 DO 400 FD 144 RT LOOP ;. Okay, so the cool thing is CS FLOWER PU 450 BK. Okay, it's Forth and it's turtle  
[15:38] graphics and it's vector graphics and Forth is like assembling uh you know vector graphics  
[15:44] processor code and then it just makes all these neat little uh programs to draw on the screen  
[15:50] that you can then edit like this. So, um, oh, but there's another thing going on. PIXIE. Oh, wait.  
[15:58] We'll do Unix first. Okay. Hello. Login is ken. Login: ken. Password: ken. At Oh, there. ls. ls.  
[16:16] Here. We'll make it a little faster. Like we'll have dd, s1.s s2.s s3.s s4.s s5.s  
[16:23] s6.s s7.s s8.s, ls system okay a you got all that great stuff ar as bc cat mod  
[16:36] uh oh s1.s so there's an assembler there's a BCPL compiler everything you ever needed I better oh  
[16:47] config here. I'm going to turn for your sanity we can turn off. Yes. Return lac in one in get  
[16:54] a number of interrupt one source nar zero jmp one off. Okay there that's a little better. So  
[17:01] we have options. So anyway the thing it does is it run this is the first version of Unix on a PDP-7.  
[17:11] Um so let's go back to PIXIE. So [clears throat and cough] when uh what it does, this is hard  
[17:20] to explain. Okay, you know like XML, JSON, YAML, all that stuff. PIXIE had a more general kind of  
[17:30] uh way to represent data that uh it's called rings uh PIXIE rings so to speak. And um what happens  
[17:42] is that's different. There's a different layer than the drawing instructions. So when I Oops,  
[17:49] I better turn off the drawing editor. [laughter] Go back to light pen mode. Okay. So in and turn  
[17:57] off the memory. We just have rings shown. So when I drag this No. No. Okay. And I start  
[18:07] and I draw. This is kind of in a in a buffer. It's just not committed yet. But I finish. Ah,  
[18:13] so what this is is a PIXIE ring, so to speak. It's it's like Lisp conses. It has a cons, a car,  
[18:20] and a cdr and and it has characters and data. And uh when I do things like zigzag,  
[18:33] then maybe maybe a capacitor and uh let's finish that. Okay. See, so I got some more stuff.  
[18:42] This view is just reading it right out of core memory 18-bit core memory live. So, you know,  
[18:51] you can see there's this double buffering going on because you you don't see what it's drawing  
[18:56] yet. But then if you commit it, boop. But then, oh, here we can go play demo. And now you can  
[19:07] see it is drawing the whole thing. That's the drawing. So, so but anyway, so it seemed to be  
[19:17] this is a nice little PDP-7 library to do this that's separate from PIXIE. So I thought, well,  
[19:24] why don't we make these things from Forth and I linked it in like this. So there's the TTY. Ah,  
[19:32] okay. So see, Forth starts out with this little thing that says,  
[19:38] HELLO WORLD FROM PDP-7 FORTH. There we go. So, let me spin it again. So, Forth can make these too and  
[19:53] uh the it's going to be able to send these back and forth to PIXIE and you can run several  
[19:58] emulators at once and stuff like that. But, um so, you know, the the turtle graphics of Forth  
[20:06] doesn't really know about PIXIE's drawings. See, the same way that SVG is an application of XML,  
[20:15] PIXIE drawings are an application of these PIXIE rings and that you could use them to  
[20:20] store whatever you wanted, like a hello world message. So, the turtle graphics is going to make  
[20:28] PIXIE graphics that you could send over to PIXIE and edit in PIXIE and then it'll render that into  
[20:36] uh into drawings. So, so but anyway, there's um all sorts of ideas here. Um turtle words and  
[20:46] uh let's see. So, there is this cabinet manifesto. We control the horizontal. We control the  
[20:53] vertical. The machine in the page is ours. All of it at once. Every register, every word of core,  
[20:59] every device, the host around them. Nothing here is a black box we have to squint at through a  
[21:03] keyhole. So, when something would be better, we make it better for whichever side is closest. This  
[21:08] 1960s machine stays honest. Everything around it is ours to invent. So basically tribute,  
[21:17] accessibility, and fun beat realism. Okay. So we, you know, we want to list who made this,  
[21:23] where did it come from, and then we want to make it accessible for like blind people to use or  
[21:28] speech recognition. So, and then the um anyway, we're going to we have some more ambitious plans  
[21:36] to model photorealistically the hardware and even the people operating it. So, let's see.  
[21:47] And there's like a little tutorial on PIXIE here. And there is a uh tutorial here on Forth how  
[21:59] to use the PIXIE rings and how to do turtle graphics. See there's these words to to make  
[22:06] things like here. Let's just do this. Copy this and then go boop like that. And then we get ah oh  
[22:16] look it it added them. Triangle square hello. So, so he said oops okay is not a thing here  
[22:30] like that. So basically the whole idea is this is a live coding platform with data  
[22:39] visualization and stuff. So square square you could even do Star Wars credits. Um,  
[22:48] but anyway, uh, let's see. I think that's enough for now. So, I'm going to go  
[23:01] Oh, wait. There was Did somebody I think somebody deleted.  
[23:12] Anyway, well, have fun.  
