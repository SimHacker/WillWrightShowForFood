# THERMO help, as the program shows it

Extracted from `THERMO.EXE` (sha256 in [`MANIFEST.yml`](MANIFEST.yml)); `THERMOM.EXE`, the
math-coprocessor build, carries the same text. THERMO keeps each help screen in
three versions, one per difficulty level; where a shorter version is a prefix of
a longer one only the longer is kept. Order is the order in the executable.

---

THERMO is a thermodynamic computation simulator for a series of stochastic energy-minimization search algorithms.  A search particle makes a random walk over a set of progressively more difficult 'problem terrains' -- i.e., simplified bird's eye views of map topographies.  For each type of topography, local and global minima are generated at random locations and with random sizes, so each run is on a new map.  THERMO automatically collects performance statistics for the evaluation of different search procedures (onscreen statistics tables can be screen dumped to the printer).  THERMO provides a user-friendly arena for demonstrating the fundamental concept of a 'quick but dirty', or probabilistic, algorithm, and the idea of speed-reliability tradeoffs.  Users can implement and refine parameters for three categories of search algorithms.

Terrain #1 - Global Minimum Only - illustrates the difference between breadth-first and depth-first search.  (Tree search is generalized for an approximation of the topology of the plane.)  Users can tune the search particle trajectory length -- i.e., length of the straight segments of the random walk -- for the most efficient search.

Terrain #2 - Global and Local Minima - demonstrates that Global Minimum Only algorithms will not necessarily work when there are also local minima traps.  'Temperature' -- here, search particle velocity -- must be tuned so that local minima capture is avoided, but global minimum capture can still occur.  Moral: Injecting some chaos or noise can improve search performance.

Terrain #3 - Terraced Global and Local Minima - illustrates that, when the global minimum has internal structure (a subminimum), a Global/Local Minima algorithm by itself will not necessarily work best.  On such a terrain, a 'temperature schedule' algorithm (also known as 'Simulated Annealing') is required.

None of the algorithms is guaranteed to succeed every time.  The Running Results Screen therefore includes both distance traversed and success rate, as well as a weighted average of the two.  To interrupt a search in progress, press any key.  An interrupted search is equivalent to an unsuccessful search and will appear as such on the Running Results Screen.

While a Running Results Screen is displayed, one of two prompts will appear.

If the number of runs completed is less than the specified number (cf. Run-time Options), then the following prompt will appear :

Press C to Continue, X to Abort, A for Auto Mode.

Pressing C here will cause THERMO to start another run.  Pressing X will terminate the runs and return to the last menu.  Pressing A will cause the remainder of the series of runs to occur without user intervention.

If the specified of runs has been completed then the following prompt will appear :

Press any key to return to last menu.

Thermo can be set at three levels of user difficulty.

The level of difficulty determines what is displayed on the  help screens, and which parameters are accessible from the run screens.

The logon password sets the level of difficulty:

```text
Password
easy        THERMO runs in easiest mode. 'Answers' or
            best settings are given on help screens, and
            only relevant parameters are accessible
            from run screens.
medium      THERMO runs in medium mode.  Only relevant
            parameters are accessible from run screens.
hard        THERMO runs in hardest mode.  All parameters
(default)   are displayed on all run screens.
```

If the MS-DOS GRAPHICS.COM utility has been installed (by typing the command GRAPHICS prior to running THERMO), the various screens may be dumped to a printer supported by GRAPHICS.COM via the PrtScr key.  Quality of printout depends on the printer.

For further information on simulated annealing, see S. Kirkpatrick, C. Gelatt, and M. Vecchi (1983), 'Optimization by Simulated Annealing,' SCIENCE 220, 671-680. Also relevant to search of abstract landscapes is J. Hopfield and D. Tank (1986), 'Computing with Neural Circuits: A Model,' SCIENCE 223, 625-633;  and D. Tank and J. Hopfield (1987), 'Collective Computation and Neuronlike Circuits,' SCIENTFIC AMERICAN 257, 104-114.  (On quick and dirty vs. correct and complete algorithms, see ch.4, C. Cherniak, MINIMAL RATIONALITY (1986: MIT Press); C. Cherniak, 'Undebuggability and Cognitive Science,' COMMUNICATIONS OF THE ACM (1988) 31:402-412.)

THERMO was developed under an IBM AEP grant by the University of Maryland COGSCI COURSEWARE Project.  It is written in Microsoft C, and requires full IBM compatibility with either an EGA or VGA graphics card and monitor.  (Performs best on 80286-based PCs and up with math coprocessors.)

'A program is never completed, only released.' Comments, suggestions, and bug reports gratefully received.  For bugs, please try to give specific examples of eliciting conditions.

The Global Minimum Only terrain demonstrates depth-first vs. breadth-first search strategies.

The trajectory distance specifies how often to change direction during the search.  A short trajectory distance results in a depth-first search of a local area, while a long trajectory corresponds to a wider, breadth-first search of the terrain.  The maximum trajectory distance is equal to the length of the diagonal in pixels and is video board dependent (698 for ega, 744 for vga).  Minimum trajectory distance is 5.

Note that even on this simple terrain, success is not guaranteed.  The run aborts after traversing 50,000 pixels if the goal has not been found.

The optimal trajectory length should lie somewhere between the extremes.  A trajectory length that is too short will result in repetitive searching of the same small area.  Unless the goal happens to lie within this small area, success can take a very long time. A trajectory length that is too large runs the risk of continually shooting past the goal.  A long trajectory length, however, generally is better than a short one.

The Global and Local Minima terrain demonstrates that Global Minimum Only algorithms do not necessarily work well when there are also local minima traps.

The trajectory distance specifies how often to change direction during the search.  A low value for the trajectory distance results in a depth-first local search while a high value corresponds to a wider breadth-first search.  The maximum trajectory distance is equal to the length of the diagonal in pixels and is video board dependent (698 for ega, 744 for vga).  Minimum trajectory distance is 5.

The particle velocity is the 'speed' (or temperature) at which the particle travels.  This speed must be high enough to avoid local capture but low enough for capture by the global minimum.  Particle velocity may take values between 1 and 10.

The best strategy is to retain optimal trajectory length determined for the Global Minimum Only terrain.  Optimal search particle velocity  is 7-8.  Velocities 1-6 result in local capture.  Velocities 9-10 are too 'hot' for either local or global capture.

[Note that actually the velocity is the step size or multiplier which determines how far the particle jumps for a given move.  Visually, however, this results in a faster-moving particle.]

The Terraced Global and Local Minima terrain demonstrates that, when the global minimum has internal structure (a subminimum), a Global/Local Minima algorithm by itself will not necessarily work best.  On such a terrain, a 'temperature schedule' algorithm (also known as 'Simulated Annealing') usually performs better. (A schedule has anywhere from 1 to 5 stages (default=3); the duration of each stage must be between 5 and 30 seconds (default=15).)

The trajectory distance specifies how often to change direction during the search.  A low value for the trajectory distance results in a depth-first local search while a high value corresponds to a wider-ranging breadth-first search.  The maximum trajectory distance is equal to the length of the diagonal in pixels and is video board dependent (698 for ega, 744 for vga).  Minimum trajectory distance is 5.

Particle velocities are the 'speeds' at which the particle travels.  This speed must be high enough to avoid local capture but low enough for capture by the global subminimum.  Particle velocities may take values between 1 and 10.

The best strategy is to retain optimal trajectory length from Global Minimum Only terrain.  Capture velocity for global subminimum is 1-6.  Best temperature schedule : 'warm' then 'cool'.  For example, Stage 1 = 8, Stage 2 = 8, Stage 3 = 6.  Note that if the Stage 3 velocity is too high for global submin capture, then failure is guaranteed.

The trajectory distance specifies how often to change direction during the search.  A low value for the trajectory distance results in a depth-first local search while a high value corresponds to a wider-ranging breadth-first search. The maximum trajectory distance is equal to the length of the diagonal in pixels and is video board dependent (698 for ega, 744 for vga).  Minimum trajectory distance is 5.

Temperature Schedule specifies a particular temperature or speed at successive stages.  A 'simulated annealing' algorithm includes such a temperature schedule. The number of stages must be between 1 and 5 (default=3); the duration of each stage must be between 5 and 30 seconds (default=15).

### Goal & Local Trap Parameters

Goal size is the radius of the target (total target for terraced global minimum) and may vary from 0 - 75 pixels but must always be at least ten times the size of the search particle.  A value of 0 indicates that the goal size will be chosen randomly.

Number of local traps specifies the number of traps used in the Global and Local Minima Terrain or the Terraced Global and Local Minima. The number may vary from 0 to 10.  A value of 0 indicates that the number will be chosen randomly from the range 3-6.

### Search Particle Parameters

Number of search particles may be between 1 and 6 (default=3).  The more searchers there are, the slower the apparent velocity (i.e., the longer it takes to run).

Search particle size is the radius of the search particle, and may vary from 1 to 6 (default=2).

Snail Trail: Particle writes a memory 'trail' of its path behind it.  The length of this history can range from 0 to 99.  A length of 0 will display the particle(s) entire history. A length of 1 will display only the latest position.  The longer the history, the slower the apparent velocity (i.e., the longer it takes to run).  If, however, the history is set to 0 (to display the entire history) there is no reduction in speed.

### Temperature Schedule Parameters

Number of Cycles specifies the number of cycles in the temperature schedule (between 1 and 5; default=3).

Number of Seconds/Cycle specifies the duration of the stages in the temperature schedule (between 5 and 30 seconds; default = 15).

### Display Parameters

Number of runs can be between 1 and 99.

Automatic mode eliminates the need to press a key to start the next run, and displays the Running Results Screen for approximately 2 seconds before automatically starting the next search.

Suppress display turns off the graphics display and automatically sends all results to an external file.  This is the high-speed mode for collecting performance data.  (There will be no speedup for temperature-schedule runs because they are time-driven.)

VGA/EGA specifies whether the graphics mode is VGA or EGA.

Rectangles are impermeable obstacles.

The number of rectangles can be set from the Run Time Options Menu:  Number of Local Traps.

Maze terrains are randomly generated under these constraints.
