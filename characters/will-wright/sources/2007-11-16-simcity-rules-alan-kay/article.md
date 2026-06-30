# SimCity Rules

*Submitted by Don Hopkins · Fri, 2007-11-16 05:40*
*Tags: OLPC · Python · SimCity*

*Email thread with Alan Kay (OLPC / Sugar era).*

---

**From: Alan Kay**  
Subject: Just curious …

Has anyone tried to articulate the SimCity rules (e.g. in English sentences)?

**From: Don Hopkins**

I'm interested in writing some English documentation about how it works. But it would make sense to write a high level overview, more like a tour than a reference manual, and describe the behaviors and interactions of the different kinds of tiles and agents and layers and global computations. There is certainly a lot of ad-hockery involved!

Some muckety-muck architecture magazine was interviewing Will Wright about SimCity, and they asked him a question something like "which ontological urban paridigm most influenced your design of the simulator, the Exo-Hamiltonian Pattern Language Movement, or the Intra-Urban Deconstructionist Sub-Culture Hypothesis?" He replied, "I just kind of optimized for game play."

There are also a lot of smarts in the SimCity editing tools, which maintain the integrity of the tile patterns on the map. Like the way roads and railroads combine into intersections when they cross, turn into bridges over water, and tiles are combined into bigger 3x3, 4x4 and 5x5 zones, and stuff like that. Those behaviors are similar to cellular automata rules, but less structured and regular. Kind of like what you could do in KidSim.

KidSim / Cocoa / StageCraft Creator let kids define visual cellular automata rules by example, based on tile patterns and rules. Show it a pattern that you want to match by selecting an instance of that pattern in the world, then abstract it with wildcards if necessary, then demonstrate the result you want it to change the cell to in the next generation.

One of the plug-in interfaces that SimCity should support is plug-in editing tools.

Another interface is plug-in agents like the monster, tornado, helicopter, etc.

And for user interface and ease of use purposes, I'd like to combine the notion of an agent and an editing tool, instead of using a traditional "cursor" metaphore.

The agent could be controlled by the touchpad or the gamepad, and it would have a cursor-like footprint showing the area of the map it would effect.

That would make it much easier for small kids to use simple tools, and make it possible to use SimCity in book mode with the gamepad.

The multi player mode would enable a bunch of kids to pick up different tools and perform complementary functions together.

Once you have a rich library of interesting tools, there could even be a meta-game like Magic the Gathering or Pokeman cards that let kids trade and use tools and special effects (disasters, miracles, magic spells, special buildings, bribes, cheats, etc).

You could navigate the tool around the map in various ways appropriate to the tool's function.

So you could drive a bulldozer around, or drive a road building machine around, or drive a residential zone stamp-pad that had a programmed gap between houses for lower density housing, or was smart about finding a place to plop down the house, based on a set of constraints and search algorithms.

Then you could take a generic house plopping tool, and go inside of it like a Robot Odyssey robot, and rewire its behavior to make it smarter about finding a location to plop the house (or dumber), or moving around until it found a good place.

It could call on other tools like the bulldozer tool to smash stuff underneath if it wanted to (this behavior is already built into the zoning tool to a limited extent, called "auto bulldoze mode", which automatically bulldozes "soft" tiles like grass and dirt whenever you try to build something.

It could even measure properties of the map like the pollution, traffic, population density, etc, and base its navigation and decisions on any function of any parameter imaginable.

An interesting exercise would be to program a bulldozer to stop a fire from spreading, by bulldozing around the edge of the fire to create a fire block.

As we open up SimCity, we can put in user defined layers for the tools to use as storage and control, and let the user edit the numeric values in those layers, or specify rules to define their value. Like a mask layer that computes if a zone is on fire, or adjacent to a zone that's on fire, for the bulldozer to follow.

Of course that would be for advanced kids, but it would be great for making games like KidSim could do, but with the full power of Python underneath and easily accessible!

— Don

**PS:** Here's a summary of one of Will Wright's talk to Terry Winnograd's user interface class. It covers a lot of interesting stuff, but unfortunately I *still* haven't typed in the stuff about SimCity yet. :( The funny part is the description of "Dollhouse", which I wrote less than a year before going to Maxis and working on it!

## Related

- [Winograd UI talk (2004 essay)](../2004-01-12-winograd-ui-simulation-games/article.md)
- [Winograd UI talk (Medium, illustrated)](../1996-04-26-winograd-interfacing-to-microworlds/medium-article.md)
- [Micropolis / OLPC Micropolis fork](../../../don-hopkins/README.md)
