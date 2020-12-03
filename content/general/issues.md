---
title: "Known Issues"
menu:
  main:
    parent: "general"
    weight: 20
---

A list of issues that are good to be aware of as they might result in softlocks, crashes or unexpected behaviour.
_Issues prior to version 1.1.1 are not listed._

## Version 1.4

Note that some of these might've been fixed in 1.4.0, but we haven't been able to confirm it.

### Unreliable Leaderboards

There is a glitch which allows one to submit co-op runs as if they single player, as long as you're able to Quick Restart.
So you could for example start a run as Yves + Zelda, then trick the game into thinking it's a single player Yves run. Meanwhile you're playing as Zelda the entire time.

### Ganon & Explosives on ice blocks

Blowing up an ice block and dealing fatal damage to it at the same time (ice block having 3 hearts or less, or having shrine of death active) makes it so that the character you break out is hit by the explosion.
A very important thing to keep in mind is that this means that blowing up an ice block with Shrine of Death active will instantly kill you, since it will deal infinite damage to the character you break out.

Never blow up one of the ice blocks with Shrine of Death active.
Make sure that the ice block has more than 3 hearts left if you're low on health to prevent the explosion from killing you. Especially important to keep in mind when playing as Yves or Aria.

### Fire Keese & Glass Flail Crash

I'm pretty sure this still crashes the game in some situations? Does not always happen, not sure about specifics.
Does it apply to other keese as well?

## Version 1.1

### Ganon & Shrine of Peace Softlock

Activating Shrine of Peace in Future Hyrule Castle will currently break the ice block logic in the Ganon fight, preventing you from finishing the fight as intended.
This is caused by the Shrine of Peace incorrectly downgrading the hitbox entity into a skulltula cocoon.
If this glitch is in effect when you start the fight you'll see spiderweb graphics by the characters feet inside the ice blocks.

To fix this you will have to deactivate the shrine. This can be done by saving and quitting, luting, or dying.

### Infinite Bounce Trap Crash

If two bounce traps are facing each other, attempting to step onto one crashes the game instantly as it moves you back and forth infinitely, trying to figure out where to place you.
