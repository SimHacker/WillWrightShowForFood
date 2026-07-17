# Bounce Stuff

*Source: [http://www.art.net/~hopkins/Don/lang/bounce/bounce.html](http://www.art.net/~hopkins/Don/lang/bounce/bounce.html)*  
*Republished in [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood) from Don Hopkins's art.net SimCity archive.*

---


Bounce is a real time visual data flow programming language, designed to create interactive graphical simulations, and to filter and control midi, serial, ethernet, and other devices.   
  
Bounce is a product in development by Levity Systems, based on VPL's Body Electric virtual reality programming environment, and Macromedia's Director animation projector.   
  
Chuck Blanchard wrote the original Body Electric. [Jaron Lanier](http://www.well.com/Community/Jaron.Lanier) has used it to create [Virtual Reality](http://www.well.com/Community/Jaron.Lanier/vr.html) performance art, implementing interfaces for [Virtual Instruments](http://www.well.com/Community/Jaron.Lanier/instruments.html) entirely in Body Electric.   
  
David Levitt made Bounce by integrating Body Electric with Director, and [Don Hopkins](http://www.catalog.com/hopkins) is working on the graphics and user interface.   
  
"Space Seed" is a neat demonstration of a graphical character behavior simulation written in Bounce. Most of the graphics were created by Big Twin, and the dataflow networks were created by Don Hopkins, David Levitt, and Big Twin.   
  
Bounce was on tour with the [Electric Carnival at Lollapalooza](http://www.art.net/~hopkins/Don/simcity/don/electric-carnival.html), in the Midi Zoo!  
  
[SpaceSeedErgotLicks.gif : Ergot licks the ball!](http://www.art.net/~hopkins/Don/simcity/SpaceSeedErgotLicks.gif)   
  
![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedErgot.gif)   
  
The green Ergot character walks around the scene, chasing after the ball. You can pick up the ball with the mouse, and hold it above him, and he sticks out his tongue, licks it up, and swallows it down!   
[SpaceSeedCircuits.gif : The program behind the bouncing ball.](http://www.art.net/~hopkins/Don/simcity/SpaceSeedCircuits.gif)   
  
This shows several nested data flow diagrams, that implement the bouncing ball behavior. The upper left window makes the ball bounce along one dimension. It has four inputs and two outputs, and is represented in the lower left window by a nested folder.   
  
Inputs: ![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedBounceInputs.gif) Outputs: ![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedBounceOutputs.gif) Folder: ![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedBounceDimension.gif).   
  
There are three copies of that module for each dimension on the lower left window, which is a higher level module that simulates the ball's three dimensional velocity.   
  
The right top window is the module that performs a vanishing point projection of a three dimensional point, by scaling a graphical sprite.   
  
This circuit: ![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedVanishing.gif) contains this sprite module: ![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedSprite.gif)   
  
The TV set "Sprite" icon renders a director cast member onto the screen, given a cast ID, a channel number, a position, and a scale.   
  
This nested folder: ![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedPerspectiveFolder.gif) contains this circuit: ![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedFakePerspective.gif)   
  
The "FakePerspective" module, opened in the middle right window, calculates the two dimensional scale and position to feed into the sprite, given a three dimensional point. It converts the numbers between integers and floating point, and takes several weighted averages, one of which is opened up in the bottom right window.   
  
![](http://www.art.net/~hopkins/Don/simcity/SpaceSeedAverage.gif)   
  
Neat, huh?   
  

