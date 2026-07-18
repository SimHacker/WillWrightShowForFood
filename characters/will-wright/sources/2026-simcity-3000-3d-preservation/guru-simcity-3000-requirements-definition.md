---
title: "SimCity 3000 — Requirements Definition / ReqSpec (Guru)"
author: "Guru (Maxis; lead designer, scrapped 3D SimCity 3000)"
source_google_doc: "https://docs.google.com/document/d/1rnvzKdJp9tyEJwEGxsIjoHnT4Rn7Sn5vkrWYR8HvSqM"
preservation_hub: "./README.md"
annotated_excerpts: "./article.md"
note: "Historical design document for the abandoned ~1997 3D SimCity 3000 effort. Transcription from the circulating Google Doc; light Markdown structuring only — wording preserved."
---

# SimCity 3000 — Requirements Definition Document (Guru)

*Historical Maxis design document for the scrapped **3D** SimCity 3000 visual computing system (~1996–1997). Author known in studio lore as **Guru**. Circulating source: [Google Doc](https://docs.google.com/document/d/1rnvzKdJp9tyEJwEGxsIjoHnT4Rn7Sn5vkrWYR8HvSqM). Don’s annotated excerpts: [`article.md`](article.md). Preservation hub: [`README.md`](README.md).*

> Formatting note: headings and lists normalized for readability; Guru’s spelling, punctuation, and voice left intact.

## Contents (original Part 1 TOC)

- 1.  Introduction to The Requirements Definition Document.
- 2.  Mission Objectives
- 3.  Annotations to Mission Objectives
- 3.1  "True 3D Visual Interface"
- 3.2  "3D Outputs and 3D Inputs"
- 3.3   "Scaleable architecture for optimal performance"
- 3.4  "A visual paradigm hitherto unseen in any game"
- 4.  Facets of the Whole - System Components' Overview.
- 5.  An expanded Overview of the System Components.
- 5.1  The Visual World of the City
- 5.2   The Temporal Nature of the Visual World
- 5.3  Description of the Point(s) of View
- 5.4  Creating the Images(s)
- 5.5 The Dumping Process
- 6.  A Note on the Origin of Species

## 1. An Introduction to the Requirements Definition Document

### Gaming, Virtual Reality and Today

The Game SIMCITY 3000 is intended to be a new genera in gaming. Hence a very great deal of effort is being put into the design of the technology, aesthetics and game-play.

The concept of Virtual World Gaming is itself not new. It must nevertheless be admitted that there is a great chasm from the world of imagination as fueled by works such as the title Snow-Crash by Neal Stephenson, or the Film The Lawnmower Man, The Television show gaining more and more popularity - Reboot or for that matter Oliver Stone's wild and surreal world of  "Wild Palms" to the virtual games on the shelves today.

It is important hence to understand and state as a basic truth of this exercise that "It is possible to bridge the chasm of expectations and technology in the forthcoming year in a realistic and economical manner."
That is not to say that the technology that we are set to develop and/or put together will address a complete set of expectations.
It will however address the question of building potentially extensible bridges across the chasm, in such a way that the paths across keep strengthening as time passes by. It will also address the question of providing a visually rich and satisfying gaming paradigm.

### The Scope of this Requirements Definition Document

This requirements definition document does more than delineating the larger boundaries of the project in terms of must have. It also discusses the internal processes of the specific technologies at work, or the details of specific concepts at work. This is being done with  intent to illuminate the complexity of the whole system and provide general directions for thinking. Thus it is hoped that these efforts shall serve as indicators to the designs and specifications that shall evolve from this document.

In order to accommodate the reader of this document who may find some of the terms more technical than what is intended as the scope of this document - annotations and a detailed glossary of terms has been provided.

The requirements definitions document does definitely state without ambiguity the requirement and need for building extensible systems, portable systems and nevertheless maintaining high quality, scaleable performance and optimization. That's a tall order, admittedly, but then, this is an ambitious project !

## 2. Mission Statement

- SimCity 3000 ( SIMCITY3K ) is intended to be a city simulation game.
- SIMCITY3K will have a True 3D Visual Interface.
- The Visual Interface will provide for 3D rendered outputs as well as accept 3D User Inputs.
- The Visual Interface will have scaleable architecture that will not only be used by the system for optimal performance but will also provide user controls ( if the user so desires ) to tweak the visual outputs to what state the user finds desirable. In this it shall directly control and modify the grain of operations of both the image renderer and the world modeller.
- The Visual Interface will consist of Two distinct "modes".
1. Still Camera Mode or Photo Realistic Render Mode.
2. Camera Motion Mode or Real Time Render Mode. The Real Time Render mode shall define a visual paradigm hitherto unseen in any game or product.
- The 3D world shall be populated with distinct categories of objects.
1. Terrain
2. Buildings
3. Plug Ins Objects.
- Procedural Approaches would be used for the generation of terrain, skyscapes and buildings.
- The Visual Interface will provide complete control by means of accessors and protocol to any plug ins that might so desire to communicate / operate with the visual interface.
- The Modeller and Renderer shall both tie into the Visual Computing Kernel by means of a defined protocol in order to support the concept of extensibility ( multiple core components ) or replaceableness.

## 3. Annotations to the Mission Statement

### 3.1 True 3D Visual Interface

The entire world is represented in three dimensions of length, width and height ( or is measurable in terms of any triumvariate system )
Now therefore such a world shall be viewed  by means of a synthetic / virtual camera that shall have all adequate and appropriate viewing properties and shall be located within this representation of the three dimensional world
Now therefore the view of such a 3d virtual world through the eye of such a virtual camera shall follow rules of true perspective and representations and simulations of such other visual cues from reality
This virtual world shall also suffer a virtual lighting model in order to provide illumination and specular highlights based visual cues to the user.
The surfaces that are represented in this world shall be represented with a great degree of realistic detail.
The description above is intended to be the baseline specification for the term "True 3D Visual Interface" .

### 3.2 3D Outputs and 3D Inputs

It is the intent of this Visual Computing system to translate the visual reality of the user into a completely virtual 3D reality generated by the system. This is admittedly a technological challenge ( but not impossible ) within the constraints of mass market delivery systems for 1996-1997.

#### 3D Visual Outputs

However in order to maintain a rigid control on the development of this new technology only one virtual camera shall be implemented as phase one. This is being done with the following two reasons :
1. average delivery system performance limitations today.
2. average delivery system peripheral requirement for 3D outputs not feasible
( 3d viewing glasses a little too expensive at this point )
So only a 2D representation of the 3D scene in question at any given point of time shall be rendered / drawn / rasterised to the display game window(s).

It is to be noted however that true stereoscopic rendering capability shall be an in-built feature of the system that can be activated with relative ease.

The description above is intended to be the baseline specification for the term "3D Visual Outputs" .

#### 3D Inputs

The specific term that is implied here is 3D 'Navigational' Inputs

The other types of 3D inputs that are pertinent in the context of the game are discussed in detail later in this paper %%%

In order to maintain a one to one correspondence of intuitive free-flight navigation through three dimensions the user needs to control and/or experience ( on a minimalist basis  ) ;

1. six degrees of freedom  ( or direction ) ....
right - left - forward - backward - up - down

2. ... two basic characteristics of motion ...
straight ( linear ) - turn ( rotational )

3. ... two inertial states ...
still ( stasis ) and in uniform motion ( kinesis )

4. ... and finally two changes to these inertial states
acceleration ( speeding up ) and retardation ( slowing down )

I have intentionally maintained the specification of True 3D Navigation at a minimalist level however not compromising on complete intuitiveness by introducing artificial modality.
This specification of 3D input can be taken to a higher level by introduction of a target centroid and thus a direction vector. However it is sufficient for release 1 to implement the aforesaid degree of free flight navigation on a one to one basis by the use of 3D input devices such as 3D 'Mice' or Game Adapter devices etc. without a target centroid ("anchor") or the direction vector.

The 3D input system shall however be ready for extension to a higher level of development to include direction vectors and targeted centroids, path following etc.
at the next level of development.

In order to address  the all important fact that mass market requirements do not necessarily provide for 3D input devices in order to maintain a one to one correspondence, 2D pointing devices shall also be accommodated.

The mapping of three dimensional control to two dimensional pointing devices necessarily introduces a strong degree of modality however this shall be addressed to provide as ergonomic an interface as is physically possible based on the specific peripheral in question.

On a worst case basis navigation is still possible and shall be made to be an altogether pleasurable experience even should the user need to rely upon his keyboard.

On a more forward looking note the system shall be readily adaptable by means of the design abstraction to accept super powerful inputs such as power gloves etc., it is emphasized as a counterpoint to the worst case scenario !

The description above is intended to be the baseline specification for the term "3D Inputs"

### 3.3 Scaleable architecture for optimal performance

There are two aspects of the system that shall fine tune themselves on the performance-speed v/s quality vector.

1. The Model Detail
2. The Render Quality

The scaleable architecture is intended to denote that the system shall be capable of automatically detecting the resources and the computing power that is available to it and thereby decide what would be the optimal model detail ( in terms of sheer polygon, edge & vertex, weight )   required in order to provide both the best possible high quality imaging ( when still ) and fast real time imaging ( and when in motion ).
It shall also be capable of deciding how much imaging to provide at the render level in order to avoid visual artifacts ( ugly pictures ! in simple language ) and temporal aliasing ( clunky motion ! in simple language )

Now it is readily possible to conceive that the "optima" that the system deduces will still have leeway limits which shall be provided to the user ( thus maintaining the optimization within limits of reason ) in order to tweak model detail or render speed or both ( each obviously at the cost of the other (!!) because the system's computational index will always be a constant ! ) if he/she/it so desires.

This stated simply so, belies the inherent power of the system's scaleable architecture at both the level of code and data. The architecture of the modeller shall generate the model data on the fly, likewise the code that comprises of the functional renderer shall be assembled on the fly based on the required optimization and hence the optimization of the performance is done by actual reconstruction of lighter data sets and assemblage of faster code in real-time!

The description above is intended to be the baseline specification for the term "Scaleable architecture for optimal performance"

### 3.4 A visual paradigm hitherto unseen in any game

It is no new fact that visual paradigms are the trendsetters of the genera of games. Be it the isometric 3d of Zaxxon of nearly a decade ago, to the Virtual world 3d of Castle Wolfenstein, to the stunning photo-realism ( albeit still frames ) of  The seventh guest, to the outstanding inverse kinematics of Alone in the dark, to the absolutely fascinating textures world ( albeit a coarse 320 by 200 ) of Hexen - the common factor is clear - A new visual paradigm.

Now considering the genera which we are addressing, i.e. virtual worlds what are the options that we have ?
The "flat shading  mist-at-the-horizon" shading model that is being developed and used for Project Y cannot become a part of SIMCITY 3000.
The architecture of the renderer and the Model format for Project Y is highly restricted in design scope and form and hence by means of the very tight coupling that the modeller and renderer and the "operating system"
In doing so we would lock ourselves to a render technology that has almost exhausted its bag of tricks ( read performance optimizations ). Gouraud shading ( or modified Gouraud algorithms with specular highlights ) is an interesting alternative. Textured mapped - smooth shaded buildings is more interesting. Although in considering these alternatives we are progressing up on the scale of visual interest they do not shatter paradigms.

It is unfortunate but the prevalence of Computer Assisted Animation for Broadcast Video, and much more so now the abundance of Films with an abundance of "Graphics" has definitely created a steep performance cliff that digital processing/medium based real-time interactive applications such as SIMCITY 3000 are handicapped by and yet necessarily need to address.

There is no way we can consider a phong smooth shaded "heavy ( read as at least 2,50,000 polygons ) " model, with 2 dimensional texture mapping, and specular highlights be rendered real time to an average delivery system, to be practical this year or next.

Hence attempting to assault the cliff of expectations of the visual paradigm by means of the linear ladder fails.

That is why an alternate visual paradigm hitherto unseen in any game is essential - in order to maintain :

a) market excitement
b) performance
c) seamless growth into the newer versions and technologies

The description above is intended to be the baseline for the term "a visual paradigm hitherto unseen in any game "

## 4. Facets of the Whole — System Components Overview

In order to preserve encapsulation of function within the system, and to support a disciplined object methodology, the visual computing system shall be architecturally designed as being constituted of  the following discrete building blocks :

- World Generator

- Scriptor

- Scene Descriptor.

- Renderers (Polygonal World Renderer,  Parametric World Renderer etc.)

- Image Processor

- Output Device Controller

A brief summary of the functions of each in relation with the other in order, is provided, in order to highlight the pipeline methodology.

1. The world generator is the module that concerns itself with the generation of the 3d spatial world, for a given grain/instance in temporal space for a specific point(s) of view. It manages the overall world contents including  "virtual-real" objects such as terrain, buildings etc., and "virtual-virtual" objects such as horizon, skyscape, camera, lights etc.
Its sole objective is to create the world for viewing at the required grain of detail.

2. The Scriptor is the temporal space manager of the entire system. Its sole function is to maintain the temporal sense and thus the associated transformation channels and keys of
all the pertinent constituents of  the world.

3. The Scene Descriptor is the current point(s) of view transformations manager. Its sole function is to describe the spatial geometry of  the current point(s) of view as a semi-digested  (view-volume clipped, perspective transformed and back-face removed) scene description.

4.  The Renderers sole function is to convert the scene descriptions into images.

The Polygonal World Renderer is the camera view to image rasteriser of the Polyhedral components of the virtual world. Its sole function is to convert the world for a defined view(s) to image(s) at the required grain of detail.
The Parametric World Renderer is the camera view to image rasteriser of the Parametric components of the virtual world. Its sole function is to convert the Virtual component's (parametric definitions ) of the world, for a defined view(s) to image(s) at the required grain of detail.

5. The Image Processor will provide for all necessary image processing support. Its functions shall include ( but not necessarily limited to ) "alpha" composition of images, management of multiple images, overlays etc. etc. Its sole function is to process image(s) based upon the specific need and to provide display worthy frame buffer(s).

6. The Output Device Controller is the functional component that performs the task of actually transferring the display worthy images to the display device(s) in question. Its sole function is to oversee the task of 'dumping' image(s) to peripherals.

This six stage process uses a modus-operandi that :

takes an instant in temporal space, evaluates the events and thereby the resultant transformational state that ensues as a consequence of that grain of time,

applies the same ( is causative of the event ) to a canonical description of the virtual world constituents,

and thereby ( takes the effect of that grain of time in order to ) creates visually cognizant representations ( images ) of the components (Polyhedral and Parametric and otherwise) of the virtual world in that particular state,

rationalizes the images with adequate post processing into a singular description of that instance,

and transfers the same to a suitable viewing device.

Thus this block of the overall SIMCITY 3000 game system can function independently from the without and yet function modularly from the within. This characteristic of this functional block ( this functional block referred to at the gross level as the VISUAL COMPUTING SYSTEM ) is what makes it particularly amenable to a dynamic scaleable architecture.

## 5. An Expanded Overview of the System Components

### 5.1 The Visual World of the City

The Visual World comprises of many distinct component types.

a)  The Infinity components ( Horizon, Skyscape and such )
b)  The "Terrain" component ( Land Mass and such )
c)  The "Species of  Flora"  ( Trees, Shrubs, Metal-Bushes and such )
d)  The "Species of Fauna"  ( Humans, Birds, Borgs and such )
e)  The "Species of the City" ( Buildings, the Roads, the Sidewalks and such. )
f)  Other Plug-in Components with visual depiction and behavior (whatever they might be)

The description(s) of the world are read by the world creators which comprise of many modules for creating the world components of specified type. These modules could be file translators, gene decoders, component data extrapolators ( or de-compressors ) etc.
The World is thus generated at a canonical orientation ( or with an identity transformation matrix ). The classes of objects that comprise the world are necessarily heterogeneous  in representational form ( polyhedral / spline meshes / "3D" fractal maps / infinity shaders  etc. ) It is emphasized here that monolithic representation of  Virtual World of only "a" certain type is not only outdated, but naïve to say the least. It is extremely processor expensive to work in a homogenous  paradigm and yet attempt a high level of visual fidelity.
Thus the spatial dimension of the virtual world ( in the canonical orientation or un-transformed pristine orientation ) is created and represented. This is the first step of the process of  Viewing Visual worlds.

### 5.2 The Temporal Nature of the Visual World

The description(s) for behavior(s) of the objects of the world in are three fold in nature.
1. The descriptions for behavior for world objects that arise from the asynchronous actions and choices of the user, on a direct one to one correspondence basis.
2. The autonomous descriptions of behavior for world objects that is ascribed to them as a  causative behavior characteristic based on ancestry and genealogy of species.
3. The reactive descriptions of behavior for world objects (behavior characteristics based on ancestry and genealogy) that arise, as a consequence of their response, to the "existential state".
The "existential state" is a "temporal aggregate" of the cause - effects induced by the behaviors of  :
a)  the user over time in the virtual temporal space
b)  world objects' self-causative behavior over time in the virtual temporal space
c)  non-world objects' ( simulation plug-ins ) behavior over time in the virtual temporal space
with direct pertinence to their current "state" of being.

This Temporal Event Maintenance model described in very abbreviated manner provides a logical basis for the design of the "animator" whose sole purpose is the generation of the transformational keys and application of the same to pertinent object characteristic channels and behavioral transformation channels.

Thus the temporal dimension of the virtual world is applied to the spatial dimension in order to "animate" the same. This is the second step of the process of Viewing Events in Visual Worlds.

> NOTE : THE APPLICATION OF THE EVENTS OF THE TEMPORAL DIMENSION CAN CHANGE THE CONTENTS OF THE SPATIAL DIMENSION.

### 5.3 Description of the Point(s) of View

The View(s) that are pertinent to the point of time ( current time instant ) based on predefined and selected virtual camera(s) need to be culled out from the Virtual World so described. Thus as a consequence of the same multiple scene descriptions, of multiple types ( it is emphasized )  are generated each of which is pertinent to the type of shader that it describes the scene for.

Thus the viewing transformation reduces the description of the event transformed spatial world, to only the view-cone(s) that are pertinent. This data simultaneously suffers further transformation to accommodate for visual perspective application and consequent clipping of unwanted spatial data from the perspective corrected viewing cone. It is also at the same time the aspects of the spatial data that are not visible to the camera are eliminated ( hidden surface removal ). These three transformations are necessarily very expensive computationally and pre-digest the vast expanse of spatial and temporal space into a cohesive point(s)-of-view - into precise scene descriptions that can be now converted to images.

A traditional methodology for the "big three" transformations - view cone clipping, perspective transformation ( and perspective clipping ) and hidden surface removal fails miserably to produce high speed in the context of a system that is as extensive as SIMCITY3000 due to sheer volume of data and consequent limitations of the order of the algorithms used. This is the big trap. Most system designers resort to "cheap tricks " or otherwise referred to as "quick and dirty programming" more well described as "very tight modular coupling" in order to bolster system performance and thus lock themselves into a limited system that cannot describe scaleable behaviors with any degree of adequacy.

a)  The solution is in the design of intelligent technologies.
b)  The solution is in the modular encapsulation of tightly coupled functional modules (if it so happens that they are the only alternative ! god forbid ! ) - that they might be replaced with ease as and when newer resources or specifications come into play - as opposed to re-invention of the wheel.
c)  The solution is in novel database architecture to intelligently handle "pertinent" data that algorithms may not have to sift through unnecessary tomes of irrelevant data

The solution is thus in embedding good functionality within optimized limits. There is a whole think tank of concepts and ideas which shall be explored and implemented in order to move forward into extensible technology.

This is the third step of the process of Viewing Events in Visual Worlds from a first person point(s) of view, with True Visual Perspective.

### 5.4 Creating the Image(s)

The semi-digested spatial data is nothing more than just that. The lighting, surface attributes, color and such need to be brought into play for the scene description to start assuming the proportions of an image.

This is where the multiple scene descriptions are handled by the different renderers / rasterizers / shaders. The properties of pertinent Virtual World Non Visual Objects such as lights etc. are applied to the spatial data and based on the appropriate scene description type the rasteriser(s) shall generate image(s) in accordance with the resolution and detailed that is required/requested of them. Not only are the images generated but also the spatial coverage that the visual objects in the image represent. This information what can be termed matte logic permits the multiple images, which are in essence the discrete representations of  unified view(s), to cohere. The spin-offs of such modular treatment of scenes instead of monolithic type masses is more than obvious. To say the least a great degree of control can be exercised on the visual quality of the finally produced  image by individual control of the degree of rasterisation of the various scene(s) descriptions that constitute the final image. Thus this modus-operandi permits the generation of visual paradigms whose optimizations can be balanced with great finesse and accuracy based on available resources and need.

These are the fourth and fifth stages of the process of Viewing Events in Visual Worlds from a first person point(s) of view, with True Visual Perspective, rendered to accommodate surface, texture and lighting characteristics for a specified degree of detail.

### 5.5 The "Dumping" Process

The last stage - and necessarily an important stage is to transfer this image(s) to a suitable viewing device. In the case of a computer monitor the image is written to a display buffer in the hardware and in the case of a more sophisticated stereoscopic display the images representing the left and right eye points of view are transferred to the respective display buffers of the peripheral in consideration. Again the system shall be designed with modularity encapsulating the function of device transfer from the rest of the system in order to support extensibility to a wide variety of display devices

## 6. A Note on the Origin of Species

The species of the virtual world ( whatever might they be - buildings, trees or animals ) shall be encoded for spatial representation as chromosomes - consisting of a complex array of genes; and likewise the behavior of the species shall also be encoded for temporal operations as chromosomes of the species.
The species itself shall be represented in its completeness as a self descriptive cell. Extending this metaphor slightly for purposes of clarity the mitochondria of the species can represent its power structures so on and so forth.
If the city ( for whatever reason - say there is no power plug in active ) has no power then the mitochondria have no effect or alternatively if a building has no power then the cell representing the species of the building has no mitochondria. If the mitochondria is inactive then going by the rules that a cell functions there is no energy in the cell - say for transfer RNA to work, so the lifts ( if transfer RNA were metaphorically the lifts of the building ) would stop. Needless to add to complete this metaphor that the mitochondria shall bear complete visual descriptions on power structures ( wires - cables etc. ) as well as the functional descriptions on the internals of the cell. The base species ( spatial description and behavior ) itself shall be defined as the chromosomes and the nucleus of the cell. The plug ins shall be the various cellular components of the cell in this metaphor.

This - the species is the fundamental building block - The species of the virtual world that is passed onto the world creators at the commencement of the game and whenever a species needs to be actualized. The genes are extrapolated ( read grown ) into the full visual representation of the species details and all.

The mechanisms and methods that create these species ( or more accurately the intrapolated ( read - digested / compressed ) chromosomal representation of the species ) are briefly outlined below.

The origin of the species shall be designed using a top - down methodology - from groups of geometric primitives down a hierarchical  classification tree to finally become a species.
This system shall ( obviously it seems ) incorporate the Lamarckian classification system for purposes of delineation and inheritance of characteristics and nomenclature.

The species shall be designed and created - at the first instance as tri-dimensional polyhedral descriptions ( given the existing technology ) with specified construction rules. This shall facilitate the topological geometry and other visual characteristics of the species to be intrapolated (encoded / digested / compressed ) into chromosomes. This will also ( as a quick aside ) provide for the extrapolation of the said chromosomes to required and pertinent detail in the virtual world. This will also ( as more cutting edge technology is brought into design & construction ) permit for extrapolation of the chromosomes into types other than the types in which the species were created in the first instance.
The bottom line is that such a modus-operandi shall provide the benefit of considerable flexibility in the design and construction of the virtual world system.

The other facet of this part of the exercise of design and development of the species is the ability to create more species by crossbreeding and mutation of species. It is assumed the term species readily conveys the term - unique.

The controls for the exercise of mutations and crossbreeding shall at one end be completely deterministic. This is to facilitate the production groups who are involved in the task of populating the virtual world with species to be able to work with reasonable control of the product of mutations and crossbreeding. On the other end the controls shall be completely random based on good random number generation methods. It is thus hoped that the process of populating the world by generation of species shall be a process that can be automated to a great degree.

It is also important to note that the technology that is used for mutations and cross breeding will also be incorporated into the actual game itself at various levels to provide the user with the ability of creation of unique species ( an aside - this will provide a "trading base"  in the networked version of the game and also a world of rich visual detail) and also the ability to mutate the species. It is also readily conceivable that the mutation and crossbreeding phenomenon of species can be readily built into the game-play itself at some level and degree of automation. Thus it is conceivable that the mutation of  species is seen in visual terms as metamorphosis of 3D models.

---

# Requirements Specification (ReqSpec) — Parts 1 & 2

The Google Doc continues with papers on **VC ports** and **simulated-reality components**. Order below matches the circulating transcription (terrain/sky fragments precede the ports paper).

---

### Terrain

I choose the Pre-Voxel implementation of terrain as the Landscape design path. At its procedural simplest ( elevation/contour maps ) it can provide for reasonably interesting altitude based city terrain. Incorporating the polyhedral buildings at the image processing level with z-buffers is very feasible. Thus at the minimalist level it offers all three - detail, speed and z-buffer compliance. Its response to  light can be rendered in a straightforward manner and provides for much opportunity for dealing with large irregular masses of space which neither polyhedral nor parametric methods are comfortable in dealing with.

The base level terrain can be nothing more than a polyhedral mesh. However in order to be able to sculpt landscapes and detail efficiently is the object of considering terrain with some degree of analytical depth.

#### Essential Specification

The three practical ways terrain which are being considered are as follows :
a) as polyhedra
b) as parametric ( berzier / nurbs ) patches
c) as elevation maps
Polyhedral approach is essentially limited to a geometry transformation overhead which is not insignificant.

Render quality of the polyhedra is also based on the level of vertex normal extrapolation of the polyhedra to say the least and that is significant overhead.

Parametric texture mapped renderers whilst promising are definitely limited to the contouring of parametric surfaces. This is a very exciting possibility. The lack of support technology and tools is one of its main drawbacks. It must however be noted that in a parametric domain the generation of the surface and the shading can very well happen concurrently. Which is why it possible to delve into high complexity shaders in the parametric domain with relatively less hit on the performance. However the support technology is simply not adequate.
Elevation map extrapolation as texture mapped and shaded surfaces hold more promise on account of the inherent strengths of this method that balances complexity and speed in an admirable manner.

To be absolutely precise the method that generates the landscape that is being considered is the Elevation Map extrapolators or the EME. This is not a Voxel renderer but can very easily become the predecessor to the Voxel renderer if overreaches are considered.

Now therefore in order to be able to maintain a good perspective it is important at the highest point of the base spec chain and hence lowest in priority place is to have parametric map generators. From a simple random seed extrapolators ( fill image with random seeds and average the pixel values using different average methods ), to a randomized coherence rules based landscape constructor ( a coherence rule based landscape constructor is one that has a library of natural terrain ( a hill, a valley, a mound, sand, rocks - whatever ) and these are placed as members of a 2d matrix based on permissible coherence rules that also "blends" the tiles to visual acceptability.
I feel that a rule based, pseudo number seed based, fractal image generator is indeed the best way to go on account of the parametric magnification that can be adopted so easily.

First it is needed to generate a fractal image based on a pseudo random seed that sets the fractal image generator states ( hence reproducible randomness, hence purgeable memory usage) in order to generate an elevation map is parametrically based on required resolution.

Finally the texturing of the 3d elevation map ( as it were ) if consigned to be a dependant variable to some other randomness for dispersal states based on altitude, also becomes a superlatively efficient. Texturing instead of being an interpolated bit map manipulating chore becomes successive products of functions running geographic state variables ( an invariable or constant is the geography term or reference to a hypothetical geographical origin )

#### Ambitious Overreaches

The surface shader can also incorporate within it a bump map generation routine for its next version in order to generate greater visual complexity.

The system can also extrapolate the surface generated into a complete Voxel space. This throws up the possibilities of bulldozers actually bulldozing soil. And Mining community towns actually mining inside a silver mine !!!!

Voxel space animation methods can actually cause earthquakes. The display of a building or a city block being engulfed by splitting seams of the earth is not an impossible target with this method in the not too distant future. In order to provide a very quick example that the whole process is essentially a trivial matrix interpolation as far as the seed of the technology goes. The implementation of this seed into a product has its tall set setup and operational requirements on account of the need of tools to operate in this domain.

What makes Voxel technology particularly hard is not in the limitations or research of technology as much as it is the need to have adequate tools and automated methods for working with the Voxel space from the creative point of view. Hence the substrata of the support tools technology that needs to be created as a pre-requisite for working with Voxel methods is a point that deserves some serious thought
The moot point is do we need to invent tools and technology at all. Is that not a dramatic overreach ? Ids it not better to stick to middle of the market production and technology methods ? The answer is no !

First polyhedral methods are not a solution to everything in the sense of being apt or efficient. Secondly even in the aspects of the whole game wherever polyhedral structures are being used they are being wrapped with new interpretations and abstractions that's serve the purpose of the game well and definitely far removed from mainstream polyhedral technology usage.

---

### Sky

The sky system shall be treated as having two distinct components.

1.  The Horizon at infinity
2.  Clouds in 3D Space

#### The Horizon System

The horizon system has the primary task of preparing the lowest image layer of the VC port irrespective of the mode. Wherever the sky is seen it is the Horizon Engine that is putting up the bitmap representation of the view taking into account the present camera position and orientation wrt the canonical world.

It is possible to make a case for a simple screen scroller which presents a rectangualr bitmap wrapped about a hemisphere which addresses the need for detail and camera response. However this scheme of things has the following limitations.

1.  The resolution of the bitmap that has to be stored is non-trivial
2.  Texture mapping a sphere has a constant overhead
3.  Animation of characterstics of the horizon - for eg lighting, time of day, position of sun etc can be acheived only by rotoscopy and/or recomposition of the basic textures/textures-composite. That is potentially expensive process and particular if the textures in question happens to be a 24 bit.

The polygon and texture map process hence is a very conservative solution that can be made to perform reasonably well. However it is definitely not a fast process solution inherently and forcing it to a fast-response state will only be by introducing optimisations that will affect quality.

Hence it is necessary to think in terms of a different paradigm for putting up photo-realistic skyscapes in real time.
One fundamental deviation in approach that I recommend is to deviate from horizontal scanlines for the skyscape renderer. Whilst it is admitted that the overheads for addressing a matrix of pixels using angled scan-lines is marginally greater in addressing costs and there is a greater deal of pixel complexity that creeps in due to the behaviour that is introduced to avoid Moire artefacts ( which is an essential evil of the rotated vectors shader ) the greatest benefit is that very little further computational overhead is present. The "painting" of the sky-scape is done semi-procedurally by usage of look-up tables which means that reasonably detailed and rotation amenable skyscapes can be painted in real time with adequate CPU resources left over to execute the needs of all the other functional modules.

> **Abstract.** The User and the Visual Computing system shall interact with each other at the highest level the "port". The Two ports that are the only ones of concern to the Visual Computing system are the "ops" port and the "snapshot" port.

---

### The Ops Port

Assumption: There shall be only one Ops Port. In all likelihood it shall
not be a resizable one. This is being done with performance
requirements under consideration.

essential functionality
1. Navigation throughout the city from street level to maximum altitude
feedback for the same is blueprint view at street level transforms to
birds eye view at high altitudes.

2. Path Steadied and Orientation Governed camera permissive of
free flight or anchored hovering.

ambitious high flier
1. City construction and Modification permissive of the "there" and "that"
communication protocol. Once "that" has been identified to be able to
"do" "this" to "that" ( "that" being a spatial element of the simulation;
"do this" being a temporal script affecting the "that" in consideration;)
needless to add "do this" is implicitly governed by the current notion of
the "there" if it be so pertinent.

over-reaches
1. Full game ops controls for a fully immersive gaming experience.
viz. The complete user input interface to the game.

---

### The Snapshot Port (a.k.a. The Portrait of Reality)

Assumption : It is being explicitly assumed that these snapshot ports shall be
output devices only.

essential functionality
1. high fidelity rendered view of the orientation requested
2 causation of an event singularity for the common reference of the
simulator and the visual computing system ( this is logical for the event
singularity is the focus of attention of the user)
3 display of simulation automata in the view-port in real-time
4. snapshot port resets ops port locus on request ( most likely this
functionality will be moved to the ops port itself )

ambitious high flier
1. iterative incremental in fidelity of the rendered image
2. multiple viewports sharing a common event singularity
3. off-line storage-retrieval of viewports
4. dynamic negotiable window thread priority

over-reaches
1. multiple snapshots and multiple event singularities

The scope of the implementation of the said ports in freeform descriptive :
( all discussion consider on VC system requirements. Where repercussions are seen with other peer modules they are duly reflected upon )

A fundamental question needs to be addressed before the game viewport itself is mulled upon - should the game have a single viewport, or should the game have multiple viewports ?

The multiple modeless window viewports alternative has the inherent characteristic of greater attention immersion.
It demands more than what a single viewport mechanism would on account of the windows process priority based issues.
A single display system on the other hand has none of the said overheads.

Whilst the pros and cons of both the systems has been honestly stated so at a gross level, it is also important to acknowledge first the wonderful possibilities a good OS brings with it. Multiple port management is now and here with WIN95. It is a question of finding tight and essential usage.

Hence :

From the mode of a single window of some set resolution that has automated transitions for view modes based on user's control of the pointing device ( for e.g. left button snaps window to motion mode and right button snaps motion back to still frame with suitably aesthetic transformations ) I propose changes.

I propose that we choose a multiple display window paradigm.
It does breed its own Pandora's box of horrors.

Imagine a full screen god mode window 1 with the camera flying by and in the front of which is  a window 2 with  still camera rendering high quality and foremost still a motion window 3 with wireframe mode where the user is navigating the city with yet another child window 4 that takes a snapshot whenever the user fires the trigger and the user coasts along back in the wireframe mode whilst the snapshot becomes iteratively better. Four windows three modes is what  this hypothetical example describes. Needless to even state this is impossible performance for a delivery Pentium 75 within one year.
The counterpoint to be noted is that given the fact that it is not a feat to set up multiple processes with the latest breed of tools what we have and skills that we shall acquire. Having created such a leviathan which then the user can easily cast into scenarios such as described above what performance would then be realistically delivered by the product ? Terrifying thought. Cut the flexibility we say ! Let's govern the flexibility I say.

The only recourse left on the basis of such reasoning is to dynamically allocate window priorities based on CPU resources.

It is good for it serves the dual purpose of setting up a standardized API that not only permits multiple view window management but also permits for the same API to also decree the execution priority of the window in order to accommodate good performance ofd the display contexts as best as real time circumstances permit.

That is definitely a non trivial scope that is being addressed. At this point where we discuss the merits of cooperative request based dynamic task priority re-allocation intrinsic connectivity with the GUI module is obvious because there is a very strange peer to peer protocol that needs to be addressed.
The Graphics shell advises the GUI of the kind of viewport that it needs to directly or indirectly address (based on which viewport manager we desire to handle our requirement ) and then the GUI sets them up for the VC shell.
The VC shell then decides priorities based on its own evaluation, self-priority and messages that it receives from other peer modules and advises the system kernel indirectly through the GUI of the task priorities it deems of the said windows and thus dynamically there is  a balance of performance.

Such is the description of the viewports for the game.
And such are the reasons why it is necessary to consider a multiple port alternative.

The VC-3D-Shell upon start up shall provide for the user to start from a default window. Based on what mode the user is in God mode or street mode the view appears and gently floats around on a steadied camera mount. It is never still except in the snapshot mode.
It is intended that there be two different modules that shall render the city based on a cutoff altitude ( slightly higher than the tallest permissible building in the city )
The lower one ( Street level ) has high detail model descriptions and the higher altitude one shall use an macroscopic view of the city with low detail model descriptions
The camera will tend to point more and more vertically downward based on altitude till at a certain higher altitude it will be fixed downwards
The camera in the street level mode will be complete free and stabilized for normal viewing

When the user desires a high resolution window into a particular viewport a snapshot is taken which is a render window that iteratively over time processes the images to be a high fidelity render. The user is provided with the freedom to keep flying about at street level asynchronously. When the snap shot has reached its first iteration the user can choose to have it come to life and observe micro-simulations at work.
The user can also keep flying around in the motion window. The user can fly out upwards rapidly ( facing earth ) and at the crossover point the street level motion mode will switch to optimized city render mode.

The motion window cannot be replicated and will grab highest attention possible all the time. The snap shot window is a child of the motion window and once is iteratively processing the view will continue to do so until stopped or shutdown
The user can have multiple snapshot windows and that opens up possibilities of multiple simulations being seen

However it seems one motion window and two to four snapshot windows seems a reasonable target to go for.
The motion window is always stabilized and will "fly".

Thus with the scheme of  such multiple windows it would be possible to conceive of a very visually and cerebrally stimulating attention immersion layer. I think one motion and one snapshot window is a must. It is a baseline. A predetermined limit to snapshots would be the next easiest implementation. Dynamic evaluation of resources in order to set limit of no of snapshot windows permitted would be a very high ambitious implementation of this concept for every snapshot window created by the user creates an event singularity and hence agents, simulator and visual computing shell all have to deal with increasing loads.

The Visual Computing system shell will be cooperating with the GUI and thus the OS shell for this purpose in order to permit communications between the simulator and GUI to proceed with no necessary interference/attention of the VC system if so desired for other windows with the caveat that window execution priority can be re-negotiated in real-time dynamically.

This is the critical point in the usage of modeless windows. The gains are the intuitive space of modelessness but bring very heavy demands on process control. Hence instead of attempting to solve both problems of fine grain process control and windows prioritization it is sufficient to adhere to a negotiable necessary thread attention which keeps all tasks ticking at full predicted usage at some satisfactory median. Modelessness is messy. Mixing in Modal and semi-modal displays has no appreciable gains. But it is in mixing in modelessness with inherent window ( port ) i/o limits makes the task easier. That keeps all the context activate/deactivate switches possible within a deterministic limit.

This being the primary course of management with the heavy line indicating strong reliance on the system GUI for addressing port needs.
The hidden implication which is an added bonus is the fact that the ability to address the type of window upon creation which means that certain such modes would automatically fall through to hardware support on account of adherence to current HAL standard(s) of the OS.

It is hoped that by this point of the description of the user's point of view has addressed both motion feedback and high quality display snapshots succinctly. What needs to be defined is the other half of the interaction loop - how then does the user operate with the 3d reality ? Again I do not intend this question to be in its general sense. I think that if it is rephrased "what support does the GUI require of the VC shell in order for the user to operate within 3d space " it sounds more precise and limited.

In order to clarify this it is important to define what does the user need to do in 3d reality ? Definitely anchor point for camera. The user needs a mechanism by which a pointer beam can be shot into the world and it picks objects. This is how the need to refer to "that" can be satisfactorily accomplished. The need to be able to define there can be a point or an area. In order to keep the user interactions flowing it is suggested that area definitions are implicitly provided. The user can merely point "there": and place a building. The user can point to "that" building and delete it.

A single pencil beam shot back into the scene from the point of the mouse to identify possible candidates for picking.

It seems logical to include the property of building / altering the properties of the city in the motion camera module. Likewise the pick tool belongs to the motion camera module. Thus it seems logical that the motion window becomes the construction window as well. A snap window can provide high resolution renders as construction proceeds

This augments the property of the snap window to becoming more or less a display only window. Given that how does a user go back to a specific snapshot, possibly by something as simple as a double click on the snap window is a request for the motion window to "cut" to the orientation of the snap window.

Views that can be saved ( save of snap state ) and recalled is a feature that would assist navigation immensely.
The camera can be free or anchored and if anchored the anchor can be placed by the pick beam.

Thus it is hoped that this free form description has adequately dealt with the aspect of viewport modes, behaviors the underlying options in a single display port and multiple display ports system. The need for the window port priority management system's participation. The behavior of the motion window and the snapshot window. The repercussion of multiple snapshot windows.

I have not attempted to illuminate the specifics of the GUI apart from general requirements from the VC's end. I have also very briefly touched upon modeless behavior but that is again serviced by the GUI.

This is a good point of time to next consider the components of the Visual Reality that the user intends to be operating. It is also important to define what the requirement specification are for the operations that these visual objects can perform.

In doing that we will be defining the contents and behavior of the VC ports as well.

---

### Flora

#### Trees & Bushes

It is needless to state that the flora of the landscape be rich in visual detail to an acceptable degree that is approaches photo-realism in an indirect method by stylistic renderings.
Textured-Polygonal treatment is a probable but its grain of flexibility is limited to its optimizations in model representation and render speed.

If there is a bunch of twenty leaves textured onto a polygon as a clump then the grain of movement of the tree is twenty leaves. Let us state the tree needs twenty thousand leaves at street level in order to be visually satisfactory for its size and placement in the camera that would mean the need for a thousand leaf polygons is a significant hit on processor performance.

If however the leaves were to be stylistically represented by shaded pseudo-random seeded sprays of colored pixels or aggregates of pixels ( texels ) in 3d space that create the tree in the least common denominator for size & location directly onto the image buffer.
The benefits are primarily draw speed and secondarily "fuzzy/grimy/dirty" detail generated procedurally and dynamic z-buffer creation/merging. Not to mention the benefit of distance related detail optimisation.

Polyhedral models could just not cope with the dramatic increase in performance these 3d-pixel ( voxels / texels ) spray gun systems would have ( a tree generated 10 meters away "knows" it is 10 meters away. A tree 100 meters away likewise represents only its essential detail required for 100 meters )

There is the onus of being able to use this tree planter routine is in creating the seeds of the tree. The methods that control the spray gradients ( texels )  are the methods that create the look of the tree ( needless to state that 3d curve draw and textured fill routines would create the most spectacularly real  leaves of all but would be prohibitively expensive ) and the key to the success of this approach is in having an very agreeable and pleasing parametric foliage relying upon styles such as Van-Gogh or Claude Monet look alikes created by simple methods. The basic structure of the tree and the bounding box of the foliage clumps could be created as a representative model if so required.

#### Base Specification

Voxel 3d Trunk. The framework of the tree can be extrapolated from a wireframe skeleton.
"Brush Style" method based 3d parametric foliage generation directly as a viewport xformed z buffered image from bounding box spatial positioning

#### Ambitious Overreach

"Brush Stroke" moderated "Brush Style" method based 3d parametric foliage generation with z-buffer. Thus the path of the brush in 3d space is defined by the stroke, and the brush used will have a style that can alter its 3d paint properties. Thus the tree itself is represented as the skeleton and a script which is a list of brush strokes of styles that will render the tree.
Such trees whilst having great homogeneity and are significantly more interesting obviously take more time to render.

#### Summary

Hence it is most possible that the pragmatic way of doing the same as described hereinabove is to rely upon a 3d-fractal / 3d-quasi-fractal method to generate the spatial properties of the flora ( branches and leaves ). An intelligent Texel-fill or Voxel-spray routine would then shade the spatial characteristics into a z-buffered 3d view of the pertinent flora object in question.

The 3d-quasi-fractal method would use a basic 3d model to identify salient framework of the tree as opposed to the 3d fractal method which would generate the 3d framework completely procedurally by usage of irregular fractal logic.

---

### Automata

The subject of representation, rendering and animation of automata, is being researched by many teams of people currently.
1.  CoreTech
2.  Project X team
3.  Project Y team
4.  and of course informally and yet in a detailed manner by the SIMCITY 3000 team.

At this point of time there is not an adequate paradigm that addresses the needs of a visual satisfying automata based system. It is obvious that this system has its own components of modelling, animation, animation logic and AI, and rendering. The composability of the images so created into a pre-rendered 3d enviornment needs to be also addressed in terms of spatial coverage and edge antialiasing. Finally this system must be a reasonably fast and efficient system in order to be able to support a reasonably complex set of automata and yet provide adequate CPU resources for the other sub-systems to be able to execute satisfactorily.

Given these requirements this paper shall be re-published at a later point in the project as soon as the feasibility and modus-operandi have been researched and designed.

> **Abstract.** SIMCITY3000 is a city simulation game.

The viewport into the city is being treated with some moderate deal of complexity that is necessary and inherent in the transition of game from simcity2000 to simcity3000. From Isometric 3d projection we are entering a domain of Parallel projection at all levels. That is the quintessence of the step ahead that cannot be compromised upon however in order to implement the same it should not become a millstone around the neck of the component we are tying to represent in 3d reality. It must be obvious that non regular objects make the problem much more complex.
In order to implement the usage of true 3D  at all levels,  is a design challenge that needs to be stepped on with some caution and some grace. It is difficult. It is not impossible. Now is the time to do it.
However in order to sensibly address the notion of a visually rich three D environment the limitations of the paradigm are pretty much set from the start ( processing power coupled with algorithm efficiency ) Hence in our aspiration to strive for a higher footing, we are introducing very strong design and aesthetics into the game that we intend to and hope would be very entertaining. The visual computing system is not and cannot be a monolithic renderer. That is also an axiom.

Having taken these complex state variables into consideration the essence of the interface is this :

1. It shall comprise of modular shaders and modular spatial data readers each for the components of  reality individually
a) terrain
b) buildings
c) fauna / automata
d) flora
e) sky

2. It shall have different modes ( three stated so far 1. Birds eye view 2. Street Level Motion 3. Street level Snap shot ) The snap shot mode shall define its own port. The first two modes can share a port.

3. Each of these modes shall have its own set of performance optimizations / performance boundaries.

4. In order to provide for design iteration and technological changes the framework of the VC system shall be designed with modularity of component objects.

5. The system shall entertain the concepts of new  visual modes. There shall be a well defined protocol in order to "rejuvenate" modes from a library into the VC kernel. The methods and the objects become a part of the VC's display logic kernel routines as it were.

> NOTE 1: Neither of the replaceable component objects nor mode libraries are intended to in any way address the issues of plug in architecture. These are inherent design requirements to provide a well engineered system that can be ( and necessarily needs to be ) fined tuned in order to evolve through the cycle of technology to product instead of being a high maintenance limited entity.

> NOTE 2 : The subject of the Agents and Simulation Events have been relegated to the background for the moment. This present discussion has much soul searching to do in terms of object methodology and hence objects mutation subject to temporal scripts is a subject that is not dwelt in any depth in the course of the current effort. If I have been able to communicate that I am attempting to be centered about "What" the object methodology is going to be and then separately consider in depth how temporal scripts can be applied to the said object methodologies.

---

### Buildings

#### Essential specification

I choose the procedural polyhedral building path. The buildings shall be represented as build logic files on compact disc which shall be extrapolated to polyhedral models based on the camera view state. This method of being able to dynamically respond to camera view by optimization on the fly is amongst one of the more noteworthy benefits of this method. This is amongst the very exciting treatment of buildings as object with transformable characteristics as opposes to a mass of polygons and vertices. The latter feature is particularly important for simulation support.

The fact that the buildings are merely texture mapped smooth shaded planar polyhedral relationally ordered at best also provides for the scope of automation of building characteristics at all levels ( conceivably even collapse and decay ) . That not only provides the game with the benefit of the variation theme it also provides the artists with an elegant tool to be able to model buildings instead of pushing polygons and textures together. The procedural code that generates the buildings can become a very valuable automated tool for increasing the speed and the quality of the buildings so created.

Thus the overall game benefits by the endowment of aesthetically better crafted and hence synergistically superior ( feels good ) architectural components. Needless to state that collapse, decay, fire and such behavioral metamorphosis of the building object is possible with acceptable visual coherence if and only if the ordering of the polyhedra can lend itself flexibly to behavioral scripts that transform it.

The behavioral transformation over time has a standard pattern

> Now I'm a cylinder and Now I'm an egg
> Now I'm smooth & shiny and Now I'm not
> Now I am mottled and Now I'm not
> Now I feel mottled and Now I do not
> Now I'm here and Now I'm over there
> something or the other blah blah

Scripting system in its implemented best is a very tall order. It is the very basis for which other primary modules for e.g. the simulator can address the structure and behavior of buildings over temporal space. How then can deformation, change and metamorphosis ( all temporal entities ) be handled ?

Conceptually every spatial object can itself deem its possible states.
However it may not be a very efficient and practical way to go.

In order to be able to manifest characteristics an object must be endowed with a disposition to those characteristics. Thus a polygon appears visible to a shader. Now if the polygon were to be assigned a burnability coefficient then if a fire simulator would set fire to one corner of the polygon the interaction of the polygon's burnability with the state rendering of an instant would have the polygon in flames in an visually believable manner. A fine grain system such as this is not possible within the scope of present context. That point is also an axiom but it states what we shall not attempt for.

The operation of such a incremental command scripting executor system needs fine grain and coherence of grain, and thus ordered access of 3d data right upto the vertex level satisfies the spatial requirement adequately. Hence whatsoever the future methods the representation of the framework of the buildings ass polygons in itself is an adequate solution to the need.

Needless to mention the benefits of running through such ordered data speeds up the performance of geometric transforms significantly
The addition of the shading transformation ( as it were lights et. al. ) that hits the performance hard.
The shader needs to address every pixel that needs to be shaded at least once at best whilst creating the screen image.
Further is the constraint that the pixel must be assigned a value that is the product of an expression . Given that constraint is significant ( at least till the hardware accelerators get here ) we are given to map based software methods in order to achieve realism. The reliance on Z buffer based methods is essential for integration at all levels and is achieved readily by using polygon Z-buffer shaders.

The bare essential is usage of ordered polyhedra for buildings.
Ordering is going to be preserved irrespective of immediate usage.
The ordering shall be used to sort and classify the database based on camera distance to preserve database cache mechanics.

A direct requirement and an ambitious overreach is the scriptor.
It is intended to be an extension to the building logic files.

The building logic files are themselves never available directly to any system in particular outside the visual computing kernel core. However the vc kernel shall entertains a wide spectrum of incremental messaging which are operated off a priority based queue. The execution of the messaging introduces increments to the state of the building logic files from creation to destruction. I foresee the agents module thus operating the models and their scripts incrementally over time as on a gantt chart which is visual behavior messaged to queue to be displayed if seen. by the viewport. Now That is exactly how I envisage a model of Las Vegas with the lit Neon Signs can be built.:-)

Once the Simulator and the VC shell  agree that there is a building called Big Joe's Shark Tent and share a common reference to pertinent building characteristics ( yes I have neon lights, I have thirty bulbs all having high level scripts, here check out script descriptors , aaah OK ! you got it  ! the script is queued, bye ) then in order to pull out all the stops for the mayor's visit the simulator would message the vc shell to run specified ( or pre-specified ) lights animation scripts for the building The VC would do so for the pertinent viewport viewing characteristics.

Ambitious Overreaches :

The Buildings Generator as it were will also respond to modes by comprehending the need for speed ( in motion ) as opposed to detail ( in stillness ) by the information contained in the mode library. This opens up possibilities of faster systems actually requesting more polygons always the right number to keep render efficiency at an optimum.

This entire scenario of treatment of the buildings will also be the breeding ground for the greater technology  of representation of the visual and simulation identity of the building as genes. This process will open possibilities for cellular automata based animation in the future.

#### Summary

Polyhedral Texture Mapped Procedurally represented Buildings is the base target. It shall provide for a great deal of benefits and the most outstanding benefit is the flexibility with which the geometry can be operated by the simulator through the hospices of the visual computing shell. The added benefit being that the polyhedral buildings could merely become invisible frameworks for whatever new methods may be implemented.
