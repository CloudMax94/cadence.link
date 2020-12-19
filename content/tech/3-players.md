---
title: "3 Players"
menu:
  main:
    parent: "tech"
    weight: 100
---

**This page is a work in progress, bear with me!**

By luting away from Ganon through various means, you keep the characters that are added for the fight.

## Effects

### Persisting Screen Coordinates

The extra characters retain their screen coordinates when doing any kind of transition.
This allows you to traverse maps very quickly, and reach places which are otherwise unreachable.

### Disabled Lute

After luting away from Ganon, the lute remains disabled. You can however still warp around using the map screen.
By starting co-op (or exiting and re-entering co-op), player 2 will be able to use their lute as normal.

### Entrances

The extra characters can enter entrances, but doing so will softlock that character permanently after the transition.
They are likely stuck in the entrance transition state that locks them in place and makes them immune.

In 1.0 (and possibly also 1.1 and 1.2) extra characters would instead treat entrances as if they were stairs, walking up walls.

### Boss Music

...This is where we'd explain how things differ because the music/beat is in the boss encounter state...

### Timestop
**Exclusive to version 1.0.**

By starting a dialogue with an extra character, you will activate [time stop](/tech/time-stop/).

## Activation Methods

### Map Screen

**Exclusive to version 1.4.**

Files made **with** the Symphony of the Mask DLC use the overworld map screen instead of the dungeon map screen while in Ganon's room.
While the Lute is disabled during the boss encounter, you're still able to warp using the map screen.

### Pre-luting

Files made **without** the Symphony of the Mask DLC can make use of the dungeon entrance warp dialog box behaviour to warp away while or after triggering the boss.

### Pegasus Anklet

Have player 1 charge pegasus anklet towards the boss cutscene trigger.
While they are charging it, use lute with Player 2.
While the lute animation is still going, let go of pegasus anklet on player 1.
The pegasus anklet will get priority over the lute, triggering the boss.
After the intro cutscene, the lute dialog box will appear, allowing you to warp out of the boss room.

### Freeze

First have one player freeze the other.
Then push the player so that they start sliding towards the bos cutscene trigger.
When the player is 2 tiles away from the trigger, play the lute and choose to warp to the entrance.
The player will slide into the trigger as you're transitioning away from the room.
