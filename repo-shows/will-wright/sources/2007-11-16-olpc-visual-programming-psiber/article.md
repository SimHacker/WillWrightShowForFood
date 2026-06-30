# OLPC Visual Programming Languages for Education

*Submitted by Don Hopkins · Fri, 2007-11-16 05:33*
*Tags: HyperTIES · Markup Language · Lisp · NeWS · OLPC · PostScript · Python · SimCity · Visual*


---

Simon Forman's stuff about xerblin is fascinating, and I'm excited about where it's heading, and how we can incorporate ideas from eToys into Python! I like the idea of having visual meta-languages that are compiled into Python, which avoids the problems of editing Python text or parse trees directly, and can support simplified "kindergarten" languages as well as more advanced forms.

The drag-and-drop stack and code outliner ideas work well with PostScript, which is a stack based but lispy code=data dynamic language that easily supports smalltalk-like object oriented programming via PostScript's "dictionary stack". Python + Cairo is also a great platform for implementing that kind of stuff, with dynamic layout of hybrid text and outline graphics, which scales and zooms and supports direct manipulation of data structures!

Here's a paper about PSIBER (PostScript Interactive Bug Eradication Routines), a visual interface to the PostScript interpreter in NeWS, and some links to video demos, too. Sorry about the flashing and poor compression — they're recorded off a hires Sun monitor whose refresh rate was different than the camera, and I mercilessly compressed them a few years ago when the Internet was slower.

**The Shape of PSIBER Space: PostScript Interactive Bug Eradication Routines**  
<http://www.donhopkins.com/drupal/node/97>

**PSIBER Demo** (9434433 bytes): Demo of the NeWS PSIBER Space Deck. Research performed under the direction of Mark Weiser and Ben Shneiderman. Developed and documented thanks to the support of John Gilmore and Julia Menapace. Developed and demonstrated by Don Hopkins.  
<http://www.donhopkins.com/home/movies/PSIBERDemo.mov>

One problem with PSIBER was that it was too easy to make a mistake dragging and dropping, and accidentally totally hose the internals of the window system, since you were editing shared structures in the NeWS server, like classes and canvases and event handler threads! It needed some kind of read-only safety shield or edit mode switch. Like Emacs, its main purpose in life was to develop and debug itself (and secondarily other NeWS applications like HyperTIES and NeMACS)!

A regular hierarchal outliner like most gui toolkits support might be too limiting for a visual programming language. Objects might have several ways to "open" them, and links coming in as well as going out. Any object might be at the intersection of several trees or sequences at once (like the class hierarchy, and the window hierarchy, the set of instances of the same class, and an ordered list of search results).

PSIBER supported "peripheral views" that let you attach embedded visual editors and open objects in different ways. Good XML editors support a branch for element attributes as well as a separate branch for sub-elements and text. Check out the way 3D Studio Max has outlines with two kinds of branching at each level of the 3d object tree (one branch for animatable object properties, and another branch for attached sub-objects), and the way it crosses a vertical outline with a horizontal timeline. It would be nice to be able to view an object in one or more hierarchies or sequences at once (like 3dsmax's property/sub-object outline + timeline), and easily pivot the editor between different hierarchies and sequences and alternative views (narrowing it to just a timeline, or just a sub-object outline, or a free-form graph view).

I can't remember what he called his system, but Steve Strassmann did some cool stuff on Mac Common Lisp or Dylan with "butterfly diagrams" that branched out in different directions, left for incoming links and right for outgoing links.

The closest thing I could google about Strassmann's butterfly diagrams was his infamous "Is There Toscanini's Ice Cream in Heaven?" flowchart:

- <http://www.wunderland.com/WTS/Ginohn/cetera/heaven/heaven.gif>
- <http://www.wunderland.com/WTS/Ginohn/cetera/heaven/index.html>

Marc H. Brown and Robert Sedgewick at Brown University developed a cool visual interface to Pascal called Balsa (named after a tree, of course), which supported multiple synchronized views of Pascal programs (lexical structure outline, Nassi-Shneiderman flowcharts, dynamic scope views, pascal syntax graphs, algorithm animation, etc). But it was pretty restrictive and ungainly about how you could input and edit a program (you could not do anything that wasn't syntactically correct, and I don't think it supported drag-and-drop), so you couldn't just type Pascal code into a text editor and watch the code views update in real time.

**Brad Myers: Taxonomies of Visual Programming and Program Visualization**  
<http://www.cs.cmu.edu/~bam/papers/vltax2.pdf>

**Marc H. Brown, Robert Sedgewick: A system for algorithm animation**  
<http://portal.acm.org/citation.cfm?id=808596&coll=portal&dl=ACM>

**Henry Lieberman: Tinker** — Programming by Demonstration System for Beginning Programmers, in *Watch What I Do: Programming by Demonstration*, Allen Cypher, ed., MIT Press, 1993.  
<http://web.media.mit.edu/~lieber/Lieberary/Tinker/Tinker.html>

One problem with editing programs as text while trying to maintain a visual representation, is that typing in and editing a program as text puts the program through many syntactically incorrect states, before you've closed all your parens and balanced all your blocks, and you have a horrible correspondence problem mapping between changes in the text to changes in the structure. So it's hard to have your cake and eat it too. Even Emacs Electric-C Mode can get pretty annoying when it tries to close your parens and reindent your program for you while you're typing, if you're not trained to expect it. Of course it's much easier to attempt with languages like Lisp and Python that have simple clean syntax, rather than languages like Perl and C++ with complex byzantine syntax.

— Don

**PS: Some weird videos:**

- **PseudoScientific Visualizer Demo** (21431618 bytes): <http://www.donhopkins.com/home/movies/PseudoScientific.mov>
- **HyperTIES Demo** (3562242 bytes): <http://www.donhopkins.com/home/movies/HyperTIESDemo.mov>
- **NeMACS Demo** (3511315 bytes): <http://www.donhopkins.com/home/movies/NeMACSDemo.mov>
- **HyperLook SimCity Demo** (49816346 bytes): <http://www.donhopkins.com/home/movies/HyperLookDemo.mov>
- More: <http://www.donhopkins.com/home/movies/>

## Related

- [SimCity Rules (Alan Kay thread)](../2007-11-16-simcity-rules-alan-kay/article.md)
