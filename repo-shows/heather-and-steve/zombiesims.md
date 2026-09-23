# 🧟‍♂️ ZombieSims: The Complete Object-Driven Systems Manual
*Documented directly from creators Heather Castillo (SimFreaks) and Steve Alvey (SimSlice)*

Developed over a year during the **2020 COVID lockdowns**, *ZombieSims* is a 100% purely object-driven expansion pack for **The Sims**. It does not modify the base game engine; instead, all behaviors, events, and sub-menus run entirely through standalone object programming and sophisticated custom SimAntics scripting.

---

## 📻 Master Controller: The Ham Radio

The Ham Radio functions as the physical gateway, core toggle, and narrative anchor for the entire apocalypse framework. 

### Core Trigger Logic
*   **The Switch On / Switch Off States:** Turning the radio on triggers a custom splash screen, siren sounds, and active event loops. Turning it off deactivates the apocalypse and restores normal gameplay.
*   **The Lectern Exception:** Turning off the radio will resume normal gameplay *except* if a School Lectern is placed on the lot. The Lectern operates on its own system and will continue to permanently cancel the school bus independently.
*   **The Neighborhood Pandemic:** Green "Smart Roaches" are handled as global neighbors. They can randomly appear to visit *any* property across the neighborhood, regardless of whether that specific household physically owns a Ham Radio.

---

## 🎛️ Primary Pie Menu Directory

### 1. HELP & TIPS
Launches an interactive, 23-page in-game instruction booklet utilizing blue popup windows that players can arrow through using "Previous" and "Next" buttons. 
*   *The 40-Second Timeout:* Due to native engine physics, each window features an automatic 40-second timeout script that auto-closes the popup; players must utilize the `<<` or `>>` interface arrows to manually reset the window timer.

### 2. STATS... (Nested Sub-Menu)
Tracks an active Sim's metrics at a 100x multiplier to show highly precise, close-up progress on essential survival stats. The dialog windows update dynamically based on whichever character is selected when opening the wheel.

*   **Intro Splash ("Welcome To The End!?"):** The initial orientation warning screen. Reminds players that reports are sporadic and that keeping the ham radio turned on ensures they receive incoming event alerts, communications, and emergency assistance.
*   **Overview ("[Character Name]'s Overview"):** Outlines how building relevant interests and skills aids survival. Warns players that content is deeply interrelated and unlocking a score here can reveal hidden features elsewhere. Prints a precise 100x readout tracking:
    *   *Skills:* Body, Charisma, Creativity, and Logic.
    *   *Interests:* Exercise, Music, Outdoors, Politics, Technology, and Violence.
*   **Community:** Opens a dynamic overview managing lot relationship values, visitor routing tracking, and communal safety metrics when interacting with neighboring factions.
*   **Civic ("[Character Name]'s Civic Awareness"):** Displays current Politics Interest. Coded with a passive mechanical benefit: higher scores maximize Fun and Social motive returns when listening to news alerts, while drastically reducing the time a Sim is forced to listen to unfortunate broadcast alerts.
*   **Technology ("[Character Name]'s Technology Stats"):** Tracks Technology Interest. Coded so that listening to background radio chatter keeps the active Sim current, boosting their Technology interest while simultaneously recovering Fun and Social metrics.
*   **Training ("It's Not Wabbit Season..."):** A specialized action button designed to loudly expose the compound's position to relieve neighboring community burdens. Clicking multiple times stacks the incoming pathfinding loop to manually summon zombies for tactical combat training:
    *   *Light:* 1–3 zombies.
    *   *Heavy:* 4–6 zombies.
    *   *Apocalyptic:* 8–12 zombies.
*   **Survival ("[Character Name]'s Survival Stats"):** Compares the active Sim's current Body and Logic skills directly against targeted zombies. Higher scores grant the Sim a major tactical advantage in active battle animations. Also tracks the lot's city sanitation rebate, which awards a flat **§50 cash payout** for every corpse safely burned.
*   **Armory ("[Character Name]'s Strapped Stats"):** Displays Body skill combined with Exercise, Outdoors, and Violence interests. Increasing the baseline Body skill instantly opens up higher-tier weapon classes within the main Armory vault. Coded so that cycling through equipment pages gives mild Interest point gains, unlocking later benefits in other areas.

### 3. ARMORY... (Nested Sub-Menu)
Allows a player to manually select a weapon of choice for a Sim to carry around for aesthetic or distraction purposes. During defensive or attacking animations, the object AI automatically dispenses weapons according to a Sim's Body and Logic skills.

*   **Page 1 (The Basic Tier):** Features foundational and comedic implements including the Marshmallow on a Stick, Golf Club, Pool Queue, Fishing Rod, Broom, Rake, Shovel, Double Mops (two-handed), and Knife & Dart (two-handed).
*   **The "TAB" Page Swap:** Selecting `TAB` on the interface acts as a physical page-flipper, shifting the pie menu to display the advanced high-tier weapon vault.
*   **Page 2 (The Heavy Vault):** Displays advanced, lethal armaments including the Sledge Hammer, Long Sword, Scythe, Firearm, and Blaster.
*   **Super-Charge Me!:** A specialized interaction button located at the base of Page 2, designed to instantly electroshock the active sims and raise their fun points.
*   **Global Household Overrides:** 
    *   *Arm All:* Instantly dispenses appropriate weapons to every Sim currently on the lot, immediately shifting the entire compound into active defense mode.
    *   *Disarm / Disarm All:* The definitive method for clearing weapons. "Disarm All" strips the entire lot's weapon status simultaneously, returning all Sims to standard household routines.

### 4. CALL CQ... (Nested Sub-Menu)
Operates alongside the standard base-game telephone system rather than replacing it. While regular household phones function normally, Call CQ allows Sims to access a fully thematic apocalyptic broadcasting experience with enhanced motive-building options:
*   **Talk:** Functions similarly to calling a neighborhood Sim on a standard line, allowing Sims to safely build relationships and recover Social points from opposite coasts.
*   **Party Line:** Enables a Sim to converse with multiple survivors simultaneously, generating localized thought bubbles to rapidly raise the Social metric. This interaction triggers dynamic, scripted popups, such as a transmission from Sabrina of the *SimCity Militia* attempting to commandeer your property for combat training (offering interactive choices: "Yes Right Away" or "No And I'm Armed").

### 5. TRAINING... (Nested Sub-Menu)
Allows players to actively bypass random timers and artificially force a localized horde migration onto the lot for tactical preparation or combat leveling.
*   **Sub-Menu Options:** *Light Hunting* (summons 1–3 zombies), *Heavy Hunting* (summons 4–6 zombies), or *Apocalyptic Hunting* (summons 8–12 zombies).

### 6. EMERGENCY... (Nested Sub-Menu)
Bypasses the standard utility telephone network to dispatch specialized, high-stakes defense and crisis NPCs to the lot:
*   **Police:** Dispatches Michelle's motorcycle gang of zombie hunters. Operates repeatedly up to a hard pathing limit of **4 active hunters** per lot.
*   **Fire Dept.:** Summons Fighter Freddy's survivor crew to actively suppress house fires and combat breaching zombies.
*   **Medical:** Calls Apothecary Todd's medical staff in scrubs. They run around the lot armed with weapons to intercept threats, though their panic AI causes them to frantically run up to random Sims.
*   **Military:** At a cost of **§50**, Commander Ryder makes a manual air drop to deliver an extra copy of *The End Times Journal*. This interaction assists players looking to finish their historical journal collections to piece together the apocalypse backstory.

### 7. SERVICES... (Nested Sub-Menu)
Connects the compound to an array of automated, post-apocalyptic substitute volunteer NPCs "minding the store":
*   **Pizza:** Dispatches an infected delivery driver with a free, opened box of tainted pizza. Due to external hazard routing, deliverers rarely survive long out in the open yard.
*   **Maid:** Summons a Ghost Pirate Butler who stays on the property to handle household tasks from 7:00 AM until vanishing at midnight daily.
*   **Gardener:** Dispatches *Apocalypse Zac*, who handles lot vegetation, uses the fridge, and communicates over your radio array. Interacting with Zac unlocks lore clues and allows players to purchase materials to construct a custom mutagenic flower that deploys a 72-hour swarming Superbug shield to completely fend off zombies.
*   **Repairman:** Summons Big Jarod to fix broken appliances. He is coded with a distinct, noticeably taller skeletal structure than standard Sims.
*   **Accept Refugees:** Triggers a community rescue sweep. A large group of random neighbors and children flood the lot, staying for the duration of a standard base-game party. Coded with a minor threat modifier: there is a small chance zombies will actively track the refugees onto your lot.
*   **Entertainment / Fun 4 Kidz:** Dispatches specialized base-game entertainers who possess highly volatile pathing AI and are "probably" caught and bitten by the horde before reaching the front door.
*   **Scavenger:** Dispatches a speedy superhero NPC who lands directly at the lot's mailbox and utilizes super-speed scripting to instantly sweep the entire lot clean of blood, fluids, and combat gore.

*   **Questmaster:** Staffed by a unique volunteer NPC styled as a **Medusa character** (featuring green snake-hair, a decorative shield, and custom text interactions). She provides a progressive chain of active survival challenges using custom expansion objects. 
*   **The Ultimate Reward (The Ancient Sarcophagus):** Completing her entire questline yields special tokens. Gathering all tokens permanently unlocks a glowing, golden **Ancient Sarcophagus** object. When a Sim kneels to interact with the artifact, it activates a high-tier protective script (visualized with purple magical sparkles) that summons three ghost-like, ethereal NPCs to meditate around the property. When fully charged, the Sarcophagus grants the player a definitive tactical override command to instantly incinerate and clear every active zombie on the lot simultaneously.

---

## 🌪️ Environmental Cycle & Dynamic Disasters
Every 6 hours, the Ham Radio's internal clock ticks to trigger a completely random neighborhood occurrence or environmental hazard override:

*   **Meteor Showers:** Pelts the property with space debris, dropping rare, highly interactive alien objects onto the terrain:
    *   *The Alien Probe:* Sims can investigate it to harvest **Logic skill points**, though they risk direct alien abduction. Sims with maximum skill levels can use the probe to broadcast a cosmic distress signal that causes aliens to tractor-beam all zombies off the lot simultaneously.
    *   *The Alien Scout:* An autonomous rover that rolls across the property. Clicking the rover scans all active Sims, printing a readout of who possesses the highest Body, highest Logic, and who the "wildest" Sim is. Attempting to investigate the scout without adequate Logic skills will cause the object to instantly detonate.
    *   *Meteorites:* A collaborative group object that Sims can actively harvest. Investigating a meteorite drops rare space crystals onto the ground to power the Zombie Feeder appliance. Gazing into these crystals causes a high-stakes metric gamble, dynamically increasing or decreasing a Sim's Logic points based on hidden personality values.
*   **Random Disasters:** Triggers an *Earthquake*, *Flooding*, or a *Mysterious Gas* drop, all of which instantly fracture your lot's plumbing matrix and leave behind major hazmat spills.
*   **Jimmy's Music Festival:** Broadcasts high-advertisement audio loops playing downhome dancing jigs, forcing all nearby neighborhood Sims to immediately gather around the radio console and dance.
*   **NPC Invasions:** Pushes waves of unique characters into the lot's visitor queue:
    *   *The Travelers:* Spawns characters like **Lt. Casey the Virologist** (who chats constantly on her mobile phone to leak lore clues) or **Glow** (an unstable traveler who functions as a live, walking Hazmat spiller, leaving a trail of toxic environmental waste wherever they move across the lot).
    *   *The Test Subjects:* A trio of strange characters who continuously talk to themselves. Coded with unique autonomous routing where a subject will actively walk back and forth to change places with the invisible entity they are conversing with.
    *   *The Runners:* Spawns armed, panicked versions of Steve, Dylan, Heather, and Himari who run across the property screaming in terror before fleeing off-lot.

---

## 📯 Additional Object Systems & Interactions
*   **Zombie Gnome Solidification:** When dealing with the aggressive, nocturnal Zombie Gnomes, players can actively cast a custom **Solidify** spell on them. Once solidified into a statue state, a Sim can physically kick the gnome to permanently destroy the threat.
