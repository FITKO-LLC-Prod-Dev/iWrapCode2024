Deadline -- 5th November (perfections later)
1. Add random LED glows (interactivity) => Done (with extra stuff!)
1. Fix model issues => Done
1. Improve lighting => Done
1. Add shadows => Aborted (expensive for very little added benefit)
1. Add ground floor and background => Postponed

Deadline -- 12th November (GUI stuff is harder than I initially thought, need 2 more days!)
1. Add GUI support (reset, remaining time, end score, you failed\you succeeded messages, best statistics, etc...)
    1.[X]   Build custom events system to decouple GUI programming from three.js logic. This system defines events
            that will be dispatched whenever the user hits\misses a target
    2.[X]   Find a way to correctly position DOM GUI elements on top of threejs (website-layout dependant)
    3.[X]   Create HTML GUI elements and overlay them on the game canvas using Bootstrap
            Problem: I have no idea about how this game will be integrated into the website
            and I'm new to UI programming using Bootstrap.
1.[X]   Add debugging GUI to easily chose correct environment parameters
        NOTE: this was a substantial step! Now we can easily change game parameters
        and improve the overall look and feel of the game.
1.[X]   Improve points logic (when you don't hit a mark, -points!)
1.[X]   Add exponential difficulty (where reaction time decreases exponentially)
1.[ ]   Fix AudioContext warning (by adding start button)
2.[ ]   Add keyboard support (3x3 grid support) => Postponed
1.[X]   Add ground plane with baked shadows
1.[X]   Add transparent background
        NOTE: not possible apparently with bloom effect. Aborted.
1.[X]   Fix consecutive target spawn issue (don't randomly pick a target in the 
        same are as the previous target.
3.[X]   Add custom cursor effect (boxing gloves) (website related)
4.[X]   Add startup Logo to the model
1.[X]   Add smooth camera transitions
------- Not necessarily next week -------
6.[X]   Add background (more immersive)
7.[ ]   Add tutorial scene
1.[ ]   Add start game GUI
1.[ ]   Add restart game GUI
1.[X]   Add target timer
1.[ ]   Add camera shake when target is hit

1. [ ]  Add difficulty selector
1. [ ]  Add mute audio option
