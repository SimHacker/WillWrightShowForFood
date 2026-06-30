# A Proposal to Develop Third Party Content Authoring Tools for The Sims

*Submitted by Don Hopkins · Thu, 2004-02-05 21:39*
*Tags: Game Design Player Created Content Tools*

*Extracted from Don Hopkins archival prompts (2026-06-29). Republished in [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood).*

---

This is a propsal I wrote to Maxis after The Sims was released in March 2000, outlining some of my ideas for third party content authoring tools that I could develop. This led to The Sims Transmogrifier, but it touches on several other interesting tools and projects that Maxis never got around to.

A Proposal to Develop Third Party Content Authoring Tools for The Sims
by Don Hopkins, March 2000

Problem Definition:

There is a strong demand many from third parties who want to develop their own custom content for The Sims, including characters and objects.
Proposed Solution:

Update, clean up and document the content creation tools, so third parties can make their own characters and objects for The Sims.
Port the tools to the latest version of 3D Studio Max.
Make the tools self contained so they can be run stand-alone, by removing all dependencies on the Maxis environment and expensive software packages: Character Studio (Biped, Physique), Access, SourceSafe, MKS Toolkit (Korn Shell).
Document the content creation tools with an overview, examples, tutorials, and a reference manual. Write down the folklore that has been passed by word of mouth. Read over the code and document how it actually behaves.
Provide consulting, training and content creation services to third parties who want custom content authored for The Sims, but don't want or know how to do it themselves.
Develop a Sims Content Authoring SDK, so it's possible for third parties to create specialized content creation tools, like FaceLift.
Goals:

Third Party Character Creation and Customization:
Characters include virtual people who the user can play with, as well as autonomous non-player characters with programmed behaviors. Characters consist of bodies, heads and hands of 3D polygonal meshes with texture mapped bitmap skins.
Characters are created at Maxis by highly skilled artists using expensive tools like 3D Studio Max, Character Studio, the CMX exporter, and Photoshop.
Simplify the content creation tools and make them run stand-alone, so third party artists and designers can create their own characters and objects.
Maxis' expert 2D character artists currently use Photoshop to paint body textures in layers, then flatten and dither them into 256 color bitmap files.
"Flesh out" the process of applying layered clothing to naked bodies and dithering to 8 bits, so anyone can dress up their characters in all kinds of clothes.
Maxis' expert 3D modeling artists create textured low-poly rigid meshes (like heads, hands and accessories) attached to individual bones, and the CMX exporter creates rigid suits.
Make the CMX exporter easy for third parties to use, so many proficient 3D artists will be able to make their own textured heads, accessories, selected character pointers, and carried objects.
Maxis' expert 3D character modeling artists attach textured low-poly deformable meshes (like bodies) to skeletons using Character Studio Physique and Biped, and the CMX exporter reads out the weighted vertex/bone bindings and creates deformable suits for the game.
Character Studio is an expensive plug-in that enables a skilled artist to bind deformable meshes to skeletons, but there are other ways to do that with 3D Studio Max and other 3D tools.
Enhance the CMX exporter to support Max's new way of attaching deformable meshes to skeletons, so third party 3D artists can create bodies.
Maxis designers and programmers use the Edith tool to configure the behavior of characters and objects.
Clean up and document Edith, so third party designers and programmers can program and modify their own characters and objects.
Third Party Object Creation and Customization:
Objects consist of pre-rendered z-buffered sprites, packaged together with character animations, sound effects and programmed behavior.
Objects are created in-house at Maxis, by highly skilled 3D modeling artists, using lots of polygons and detailed texture maps in 3D Studio Max. The sprite exporter breaks the objects up into tiles and renders them in different scales and rotations, then writes out z-buffered sprites.
Clean up and document the sprite exporter, so third party artists can use it with 3D Studio Max to make their own objects.
The sprite exporter is very specific to 3D Studio Max, especially when breaking apart multi-tile objects.
Maxis' expert 3D character animation artists create skeletons and animations of characters interacting with objects. They use Character Studio Biped, although the exporter supports other types of skeletons, like the bones built into Max or even hierarchies of normal objects.
Clean up and document the CMX exporter, so third party character animators can use it with 3D Studio Max with or without Character Studio to make their own character animations.
Enable Third Party Content Creation Tool Development:
Develop and document an SDK (Software Development Kit) that gives third parties the information they need to make their own content creation tools for The Sims.
Enable and encourage the development of tools like FaceLift and Blueprint by third parties.
A "BodyLift" tool that enables anyone to mutate, breed and tweak deformable body meshes, like FaceLift lets anyone do with rigid head meshes.
A skin tool that enables anyone to layer clothes and accessories on different bodies, skin colors, sexes, ages, etc. Allow artists to create 32 bit alpha masked layers of clothing that can be applied to any body.
An animation tool that enables anyone to create their own dance sequences, walk loops and idle animations, by mixing, cross fading and mutating between many pre-existing dramatic poses, dance moves, walks and idle loops.
Specialized object creation tools that enable anyone create their own customized objects from templates, like a PictureFramer that would create a framed picture from any bitmap, or a JukeboxFactory that would create a jukebox full of your favorite mp3 files.
