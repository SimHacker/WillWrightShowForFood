# Comments on design documents

Don Hopkins, notes written while reviewing *The Sims* design documents and related brain-dumping sessions. Attached to email of 22 February 2012 ([`email-2012-02-22-sims-design-notes.md`](email-2012-02-22-sims-design-notes.md)).

## Undo/Redo

Undo may not be appropriate for a game like ours,
unless it turns back time and all other effects as well.
The player could use regular undo to cheat, 
by creating an object, enjoying its effects for a while,
then undoing the object creation but not the effects. 

There seems to be a fundamental difference between
undo/redo of architectural editing, and undo/redo
of player commands (like clicking the "eat" menu item
on the food). Do we want to support undo/redo of both
types of interactions? Should they use the same 
mechanism? Should the user think of them the same?
Somehow undo/redo seems more appropriate for text
editors than the "real world", where you have to
live with the effects of what you've done, or travel
in time.

It's a lot less trivial to undo the effects of eating,
than of building a wall. Maybe we should not frame it
in terms of undo/redo, but of previewing and erasing
to undo the effects of architectural tools (showing 
the effects before commiting, and providing an eraser
tool instead of an undo command), and checkpointing 
and restoring to roll back the effects of object 
interactions (so to undo the effect of an interaction, 
you go back in time before it happened, but then you 
have to run the simulation forward from there). 

If we could support rolling the simulation back in time,
then undo/redo would be a global time stepping command.
There would be no branching in the undo chain, so you 
could only undo commands in the opposite order they
were performed, and only redo them in the order they 
were performed. 

The undo/redo mechanism might form a basis for an event
scheduling mechanism. But then we might not want people 
to think of it as undo/redo. You don't need to schedule
architecture tools, but you do need to schedule object
interactions. 

We also have to deal with the issue of incrementally
rolling back architectural modifications made while
time is paused. We could keep track of an additional 
real time value while the game is paused, and use it
as a second time dimension for sorting the editing 
events.

## Previewing of architecture tools

We need to support multi click interactions.
The user should never be required to hold the mouse down and drag. 
The game should be playable by "point, click, move, click" style
interaction. "Press drag release" interactions can be shortcuts
and accelerators (like pie menus).

## Previewing of object creation and Placement Rating

While you're placing a bed, it could be partially transparent
to show that it's a preview that hasn't been committed. 
This would make it easier to see the "XXX" marks that 
tell you that it can't be placed. We could design a better
feedback mechanism that somehow tells the user *why* an 
object can't be placed somewhere. The "X" or some other 
embellishment could be drawn on the tile that's blocking 
the placement, for example. 

The person who wants to use the bed, or a Feng Shui expert,
could follow the tentative bed preview around, gesturing here
and there to suggest a placement, and looking pleased or 
unhappy depending on how good a placement you've choosen.
It could be based on the accessability of the object's slots,
as well as the numeric result of a tree that each object
could define, that looks around and rates its placement. 

Here's a way to cheat the subjective aspect of Feng Shui: 
anybody could give feedback on the placement of an object,
since the object is deciding how happy it is where it's
placed, and the person just feeds that back by gesturing. 
But the feng shui expert, even though they might give the
same suggestions as anyone, actually "bless" the object
so that it's more effective. The bed could have a "comfort"
attribute, and more comfortable beds would be more expensive.
But if your neighbor was a feng shui expert, you could feed
him and he would bless your bed for free, by telling you 
where to put it then increasing its comfort. 

Big Brother could have a tree that rated its placement,
that prefers that its "bad" side be against the wall. 
Bookcases would like to be next to each other. 
A desk could like to be near something that produces
light, like a lamp or a window. 
The stove could like to be next to something that has
a work surface you can place things on, like a counter 
or table. 

The couch could return a bad rating if your back would
be to the door when you sat in it. Modular tables that
plug together could return a better rating, the more
identical tables they were adjacent to. 

Characters could use placement rating functions to
automatically figure out where to put things. The 
movers who were bringing in all your stuff from the
van would place the first table piece randomly, the next 
adjacent to it, the next to make an L shape, and the 
fourth would fill in the 2x2 square. 

We could have "room classes" like bedroom, kitchen, bathroom, 
living room, laundry room, garage, that objects were tagged 
with to tell where they belong, so they are happier in rooms 
with compatible objects. The rooms themselves would not have 
to be tagged, but the type of a room could be infered by the
objects in it. 

## Project Jefferson — Technical Design Review

### Poses

We might need upper and lower body sub-poses,
to describe eating while sitting, carrying while walking, etc.
There could be a default upper body carrying animation, 
that objects might override, so they have control over
which slot you pick them up by, and how you hold them.

A vacuum cleaner could make you hold it by the handle, 
and push it back and forth so it moves over the ground. 

A flag could make you grab its pole with both hands,
and carry it out in front of you so it could wave 
patriotically. 

A bowling ball could have a slot beneath its surface,
so it looked like your fingers were stuck in the holes, 
and you could carry it with your arm hanging down. 

Upper body poses would be registered and matched with
lower body poses, so there would be one "place on table"
animation for sitting in front of the table, and 
another for standing in front of it. 

We need a way to animate the locations of the slots.
This could be under the control of the trees,
as well as contained in the sprite data. 
We might usually want most slots animations to come from
the sprite animation frames, but the occasional object may 
want to have its own special slot that it has complete 
control over from the tree, like a trampoline.

### Chairs

The chair sit routine needs to set you up in the slot
with the right pose, and return to the top level,
instead of keeping you busy (but interruptable). 

When some other object wants you to come over to it
(and you're not already there, like sitting in front
of a table), the router will animate you out of the
chair's slot, and then walk you there. The table needs 
to be able to figure out that the person sitting in 
a chair in front of it is facing it, and gotoslot
will succeed without doing anything, but if the chair
is turned the wrong direction, it should fail.

When you're in the slot of a chair, gotoslot should be
able to figure out that you're on a certain tile facing 
a certain direction, which may be different from the 
tile you needed to be on and direction you needed to be 
facing to get into the chair. 

### Route Following

#### Spline

#### Side Stepping

This paragraph is confusing, and seems to be making implicit
references to some code. Please define terms before using them.
Which "old return values" (Which function is returning? Which 
function is calling? What's the name of the value?) Who requests 
the side step? Which two side steps? Which two displacements 
between what? What's a "displacement table"? What's "S2"?
Please show the illustration first, with all the terms labeled, 
and define the terms before using them. 

#### Animator

#### Stopping

We need to match the end of the walk cycle up with the 
beginning of the stop walking animation, which might require
some moon walking, or interrupting the walk cycle in the
middle and morphing the pose into the beginning of the
closest stop walking animation. We could have two or
four stop walking animations, one for left foot forward, 
one for right foot forward, one for both feet down and 
left moving, and one for both feet down and right moving.
Map the four quarters of the walk cycle to the four most
compatible stop walking animations, and morph between them.

## Other notes

### Tree Interpreter

There a problem with the temps getting trashed when 
somebody else pushes an action onto an objects's stack.
This only exists when the tree you're running "yields"
by executing an interruptable (or blocking) primitive,
or calls a subroutine that does. The primitives that 
block should be clearly documented, and there should
be an explicit list of them in the documentation. 

## Dynamic Feel of the Game

The game feels something like a pinball machine with 
several balls in play, but the pinballs are people, 
and the flippers and bumpers are objects and architecture.

The people are more interesting than pinballs, because 
they're self-motivated with rich state and behavior, 
and they deeply interact with their envorinment. 
Their motivations serve the role of a constantly changing
gravity field, pulling them from goal to goal. 

You can sit back and watch while they walk around 
and react with each other and the environment, 
or you can pop up menus to influence the game and
drive people around the house.

They continue to obey their own laws of physics,
like route planning and motivation servicing, 
but you can flip and tilt them into satisfying 
your own goals and achieving a higher score. 

Another layer of the game is like the Pinball 
Construction Set: you can build your own house and 
place objects in it, and let the people loose in
it and see what happens. It's like The Incredible 
Machine, in that you construct a world and then let 
events run their course, but different in that you 
can construct and interact with the world while
the simulation is running. 

It's like a reaction-diffusion system, in that objects
of different types combine to form other objects, which
people carry around the house to take part in other 
interactions. Some objects like furniture are fixtures
that stay around and facilitate reactions between other
objects, like catalysts. Other objects support interactions
that produce and consume transient objects, that form
an economy of supply and demand. The by-products of 
these reactions effect the peoples motives, which feeds
back into the system to effect which reactions take place.

There are many interlocking positive and negative feedback 
loops, that can reinforce each other, cancel each other out, 
reach steady states of equalibrium, and exhibit rich 
unpredictable chaotic behavior.

## Slogan Stew

SimFamily.
SimCom, a simulation comedy.
Home making. 
Family life. 
Character development.
<product_name> puts the Home into Home Page.
Get a life. Take two, they're small.
Go ahead, make my day.
One day at a time.
Home improvement.
Home boys from outer space.
Dysfunctional family circus.
People, places, and things. 
Make a house into a home.
In the house.
The persuit of happyness.
Interpersonal interaction.
Personal action.
We put the "Score" into "High Score". (x-rated)

## Personality quirks

How to program the into individual characters?

More or less sensative to temperature.
Preferring warm or cold temperature.
Going to bed early or late.
Fiendish obsession with food.
Hardly ever takes a bath or obsession with hygine.
Prefers baths to showers.
Bathes after waking up or before going to bed.

How can you provide for different peoples preferences
and increase efficiency through paralellism?

Provide a bathroom with a shower, an a bathroom 
with a bath, so archie and edith can each bathe at the same time. 

Model the perils of putting on the dishwasher and laundry, 
then taking a shower and running out of hot water. 

## Wood workshop

Long term projects that you work on day after day,
with a high value reward like a piece of furniture,
or something you can sell for cash.
Something you do a little bit of every day after work,
that eventually rewards you for investing the time.
The challenge is to make the rest of your life efficient
enough that you have enough time to invest. 
Investing time instead of money makes for valuable rewards.
Do-it-yourself projects. Crafts. Home made gifts.
Build a birdhouse, and put it in a tree, so it attracts 
birds, who provides entertainment and song and food for
the cat). 

## Interpersonal relationships

Edith gets mad when Archie flirts with other women.

Archie invites the guys over to play cards.
How could Edith react? Find her own thing to do,
or try to interact with the group?

One way of playing is to only control the family members,
but not the visitors.
Another way is for your family to visit somebody else's 
house, and only control the visitors. 

## Training

Breaking bad habits, like smoking or getting in fights.
When something triggers the bad behavior, the character
would play a warning animation, like fidgeting or shaking
fists. You would have to watch for and recognize various
behavioral precursors, and react to them by distracting
the character in appropriate ways that they would not
otherwise do autonimously, like using the exercise bike 
instead of smoking, or putting on music instead of 
punching somebody. They could then gain an affinity 
with the object that distracted them from the negative
behavior, and you could eventually train them to avoid 
the bad behaviors autonimously. 

The motive satisfaction search could take into account 
the affinity matrix of the object with respect to the
person, to weigh the action advertisements. So when you
start with a new object, you have to use the menus to
get the person to use it, but the more you tell them
to use it, and if they use it successfully, the more 
of an affinity they will have towards it, and the more 
likely it is that it will distract them from other 
behaviors. 

The action test tree could check the relationship matrix
to see if they have an affinity to the object, as well as
checking their motives and other environmental factors,
and then amplify or attenuate the advertisement appropriatly.
The relationship matrix could also be used to store conditioning
parameters related to the relationship, such as how hungry you
were when you ate something, or your emotional state when you
wanted to play a particular kind of music. 

You can try to solve several problems at once, like getting 
Edith to stop smoking, and getting Archie to stop smacking her
when he gets mad.

You buy a new radio, and it has a menu of stations that play
different kinds of music. KNRG plays high energy techno music,
KZZZ plays low energy drowsy music, KYUM restraunt radio makes 
you hungry, KRGU talk radio makes you mad, KHAH joke radio
is very entertaining, and KGOD religious radio relieves your
stress. The new radio starts out with an empty relationship 
matrix. Archie might like to tune in HRGU because it satisfies 
his social motive, but as an unfortunate (and unadvertised)
side effect, it makes him angry, so he's more likely to 
abuse Edith. 

If you can train Archie to tune in KHAH, he'll be in a 
much better mood, and won't get so mad at Edith. The KHAH 
action tree would increase his happyness. If he was 
mad to begin with, then it was successful, so it 
also reinforces the interaction by increasing the 
KHAH happyness advertisement's adjustment for Archie, 
stored in the radio's relationship matrix. Next time 
the KHAH check tree runs, it will look up Archie's 
"KHAH happyness adjustment" value in the relationship 
matrix (defaulting to 0 if not defined), and add 
it to the happyness advertisement. Then if Archie selects 
the action, the adjustment would be increased (to a maximum
ceiling) to reinforce the behavior until it's a habit. 

The action tree could also remember the last time 
Archie listened to the station, and the check tree
could take that into account as a condition to increasing
the advertisement, so that he would be more interested
in listening to it as time went by. This would inhibit
the repeated obsessive use of actions to satisfy motives. 

For the inevidable times when archie gets really mad,
you could get him a punching clown, that he could sock
instead of Edith. (One of those really silly looking 
ones, with some hilarious sound effects and animation, and
some silly actions like punch, slap, spin, hug, talk, etc.)

You could get an exercise bike for Edith. But she might
not have enough energy to want to use it. So you could 
train her to tune in KNRG and listen to high energy techno
music, which boosts her energy and gets her in the mood
to use the exercise bike. The test tree for the exercise
bike could advertise stress relief, with the adjustment 
that it's more attractive if you're high on energy. 

The cigarettes would also advertise stress relief, but 
you would want to increase Edith's energy until the 
exercise bike was more attractive than the cigaretts. 
Of course the cigaretts, in the grand tradition of tobacco 
companies, would only *advertise* stress relief, but they 
would actually increase stress and decrease health! 

Some advertisements could be unwholesome red herrings,
that you would have to divert people away from by
training them with better, truly satisfying habits. 

So the way to do well in the game is not just to buy objects 
for people, but to actually train them to use them skillfully
and autonimously.

An object can be used in several different ways, good and bad.
People could initially use them in less than ideal ways, 
because they seemed more attractive, but misuse could have
bad side effects, but effect the relationship matrix so 
they eventually learned to use them better.

A guitar could be not be very entertaining in the hands of 
an amature (especially for other people in the room), 
even though the advertisement for picking it up and playing
it promised a certain level of entertainment. But the more
you practice, the better you get, and the more entertaining
it is. At certain levels of expertise you could cross 
qualitative thresholds where the interaction had other 
deeper effects on you and the people around you, like
decreasing stress and increasing environmental factors. 

All these things about peoples interactions with objects
can be also be applied to peoples interactions with
other people, including other family members, visitors,
relatives, neighbors, and pets. 

### How can you train people in a general way?

I did a junior high school science fair project about 
training a simulated mouse to cross a goal line, written 
in Pascal, inspired by a Creative Computing article. 

The mouse started out in the middle of a field, 
with a goal line along the left edge of the screen.
The mouse could move up, down, left, or right.
It had a big table of possible movement directions,
initialized to random directions with equal probability. 

Each slot of the table could contain up, down, left,
or right. The mouse moved by choosing a slot of the
table at random, and moving in the direction stored 
in that slot. Then you had a chance to give it positive
or negative feedback by pressing a button within a 
short timeout. If you pressed the negative reinforcement
button, then the value in the slot the mouse had chosen 
was replaced by a random direction, weighing the table
away from the previous direction. If you pressed the 
positive reinforcement button, then the value of a random
slot of the table is replaced by the direction of the
previously chosen slot, weighing the table toward the
previous direction. By playing this game, I found that
positive reinforcement was more effective than negative
reinforcement, because it tended to "learn" good behavior 
in response to positive reinforcement, and "forget" whatever 
it had learned in response to negative reinforcement. 
There were more wrong behaviors to negatively reinforce
than right behaviors to positively reinforce, so lots
of negative reinforcements would tend to undo the results
of fewer positive reinforcements. 

## From "The NPC and You" (Gerry Wilson)

http://aragorn.uio.no/nanvaent/creator_info/npc_and_you.html

> Reactions are perhaps the more important thing an NPC has 
> going for it. Begin by assuming that every NPC will be 
> kissed, killed, taken, kicked, made love to, eaten, and 
> used as an ashtray. Players love to abuse the NPCs in 
> horrible little ways. Be prepared, beta teting is not for
> the weak of heart. The sad fact is that you will be expected
> to somehow magically divine every single action that a 
> player can inflict on an NPC. You won't be able to of course,
> but try nonetheless. It saves time. NPCs must either fullfill
> a goal, or provide atmosphere. No, I take that back, they
> must always provide atmosphere, whatever their purpose. 
> Most NPCs tend to personify stereotypes of some sort.
> This is acceptable, if somewhat predictable. In addition,
> NPCs nearly always have a straightforward motive urging them
> along. This I tend to disagree with. People are complex, and
> NPCs are people. In using a stereotype, I prefer to use it to
> mislead the player. I don't do this a lot, bit I do it in
> certain strategic places. It's a good dramatic device, used 
> sparingly. 
>
> Other good reactions to plan for include gift-giving and 
> questioning. Try to have the NPC maintain its illusion of
> sentience as much as possible by letting it know about
> relevant topics, as well as personal ones. In my games, 
> I try to discourage wanton NPC murder. That's up to you,
> of course. In any event, just try to have the NPC react
> believably as often as possible. 

## Role-Playing in MU*s (Jamieson Norrish)

jamie@kauri.vuw.ac.nz — http://aragorn.uio.no/nanvaent/creator_info/design.html

Excerpts Don quoted:

- One major positive method of encourging characters to interact with each other is to limit the size of the world.
- Realism → "believability" and "internal consistency"; suspension of disbelief for immersion.
- The ultimate goal is for everyone involved to have fun.
- Some "Dynamic MUSHes" use TinyPlots — burdensome out-of-character procedure; better if players always roleplay in character.
- No resets — players' changes should leave lasting impressions on the world.
- Skill advancement through practice and instruction.

## Mystery game scenarios

Like "Clue" or "Columbo", "Murder She Wrote", or mystery dinner theaters.

A crime takes place, and Columbo shows up and tries to get to the bottom of it. You control Columbo, making him walk around the house, investigating objects, looking around for clues, and interrogating people.

Could it be done non-verbally, with emotive icons and body gestures, in terms of objects and interaction menus?

For replay value, many ways the puzzle could work out (Clue-style: Dr. Pepper, candlestick, kitchen, etc.).

Turn it around: control the family covering up a crime while Columbo investigates.

See EA titles Don referenced: *Sherlock Holmes: The Case of the Rose Tattoo*; *Psychic Detective*.

## Lessons from Microsoft Bob

We should invite Stanford Professor Clifford Nass come in and tell us what he thinks of the game. I saw him talk at Ted Selker's IBM Almaden Research "New Paridigms" workshop a couple of years ago, and he was great. 

## EA Packaging and Print Focus Group

Resist telling the whole story on the front of the package. Avoid busy illustrations and hard-to-read typefaces. At least 3 large screenshots. Features box with concise bullets. Captions effective for key info. Large arresting visuals related to the game, not too "high concept". Kids want facts, not hyperbole.

## Object descriptions and theme

Objects should have written descriptions for catalog browse and in-house inspection — short name, one-liner, paragraph; optionally URL of a web page (pre-cached locally).

**Coherence and Theme:** orthogonal sets of related objects (e.g. "hippy objects": lava lamps, black light posters, love beads). Browse by type, then follow theme links.
