---
title: "Wrong Warping"
menu:
  main:
    parent: "tech"
    weight: 100
---

**Exclusive to version 1.1.**

By doing a transition with player 2 while player 1 is dead and then unassigning player 2 during it to cause a game over, it's possible to Wrong Warp.
You have to choose "Continue" or "Quick Restart" before the transition completes.
You will then Wrong Warp based on the location you continued or restarted at.

## Wrong Warp Locations

- Continue with Game Over Shop to Wrong Warp from the Game Over Shop.
- Continue without Game Over Shop to Wrong Warp from your continue location. (Start area for your mode, last Sheikah Stone, or Dungeon Entrance)
- Permadeath Quick Restart to Wrong Warp from the start room of the mode you're playing.

## Entrance transition
(Caves/Buildings/Stairs/etc.)

Overworld will warp you to the coordinate of the entrance you used, on the screen of your continue location.
So if you're set to continue at the Hyrule Castle Balcony Sheikah Stone and used a cave entrance on coordinate 5,5, you'll be warped to 5,5 on the hyrule castle screen.

Game Over Shop will bring you to the current respawn location of the dungeon you're in.
If you are not currently in a dungeon you will be sent to what seems to be a procedural generation test area.
Each floor has 4 rooms with water and/or holes. There is one set of stairs in the dungeon taking you to a new floor. (infinitely)
There is nothing of interest on these floors, and the only way out is to S&Q or get a game over, which will send you to the Game Over shop or continue location.
You can get the "Lonely Digging" achievement by clearing all diggable tiles on a floor.

Link/Zelda selection room in Story Mode causes the game to crash.

In other areas will simply cause you to exit the area you're in.
In dungeons you'd exit the dungeon and appear at its entrance.
For zelda's room you get warped to the next room.
For Link's house you get warped out of the house.
For Octavo you get warped out of the hut.
In dungeon mode you're warped to overworld screen 0,0. It has Error's House, allowing you to get a Lute.

## Exit transition
(Black tiles in indoor areas)

Overworld will warp you to the coordinate of where the exit would normally place you, on the screen of your continue location.
So if you're set to continue at the Hyrule Castle Balcony Sheikah Stone and used an exit in a cave that would normally place you at 5,6 outside of the cave, you'll be warped to coordinate 5,6 on the hyrule castle screen.

All other locations give the same result as Entrance transitions.

## Lute Transition
Dungeons will simply warp you to the entrance, which is where you spawn/lute anyway.

Game Over Shop causes the game to crash.

Indoor areas causes the game to crash.
Tested with Octavo’s Starting Room using both Overworld & Dungeon luting.

Overworld causes the game to crash

TODO: Where do you get placed when you Lute from Cadence Zelda/Link selection?
This can be done in permadeath with Quick Reset in story mode.
Will likely crash, just like with other indoor areas.

## Overworld Screen Transition
All overworld screen transitions crash from what I've seen.

## Warp Pad Transition
(The one that goes between Dark World Lobby & Last Boss)

Game Over Shop causes the game to crash.

Without Game Over Shop it just completes the transition as normal.

In Permadeath this could be used to warp from start areas… but can’t bother testing that.

## Save and Quit
If you do a Wrong Warp and choose to Save and Quit before transition has time to finish, you’ll get different results depending on the transition, all of which involve softlocking or crashing.

Overworld Lute Transition will softlock the game the next time that you load/create a file.
Screen will just stay black while the title screen music continues to play.
Does not seem like this can be used to transfer any kind of data to a file, like current location, etc., even if executed very fast.
When you create a new file it will not save that the file was created.
Changing any options through the main menu will freeze the game.
This seems to freeze the title screen once the transition timer runs out if Tutorials are enabled?

Entrance transitions crash the game.

Exit transitions crash the game.

Dungeon Lute Transition freeze the title screen once the transition timer runs out.
There is enough time to just barely start loading a file. Maybe if done basically frame-perfectly one could do it fast enough to have it carry over to another file..?
The transition is probably way too short for that tho, given how long the file selection fade out is.

Warp Pad transition softlock the title screen once the transition timer runs out.
TODO - Make sure this wasn’t because tutorials were enabled..

What about other transitions, like collecting instrument after defeating a boss.
Or even cutscene after defeating ganon..? (probably not possible to remove P2 at this time. Try during credits maybe?)
