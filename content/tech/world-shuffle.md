---
title: "World Shuffling"
menu:
  main:
    parent: "tech"
    weight: 95510
---

**Exclusive to version 1.4.**

To World Shuffle you must create a [solo co-op file](/tech/solo-co-op) while meeting the following criteria:
- Single-Character Mode
- Player 2 is Skull Kid
- Player 1 isn't Octavo or Skull Kid

Doing this will start the file as expected.
However, on subsequent file loads the game will instead use Co-op Symphony of the Mask world generation.
This means that the world generation will differ between the initial and subsequent file loads, essentially shuffling the world once.

### Entity Interaction

You're able to interact with the world before the shuffle, and then have those interactions carry over.
This includes activating sheikah stones, killing enemies, collecting items, etc.
These things use overworld screen coordinate (NW at 0,0 to SE at 5,7) and entity IDs.
So killing an enemy or opening a chest before the shuffle might result in a tree being "dead" on that screen afterwards, if it happens to have the same entity ID.

### Sheikah Stones

If you activate a Sheikah Stone before the shuffle, you can only warp to that location after the shuffle if the same location still has a Sheikah Stone in it.
The Sheikah Stone itself will no longer appear to be activated, even though you have the warp, because the entity IDs of the two sheikah stones (very likely) won't be the same.

### Continue Location

When loading the file after the shuffle, the game wants to place you in the dungeon you're currently in, the sheikah stone you last visited, or Skull Kid's house if you never activated a sheikah stone.

If it's a dungeon or Skull Kid's house you'll simply be moved along with it when it is shuffled.
Upon exiting you'll be at the new location.

If the location is at a sheikah stone, you'll be placed on that same overworld screen after the shuffle.
If the screen no longer has a sheikah stone after the shuffle, you will be placed in the top left corner of the screen instead. (coordinate 0,0,0)
This can be used to [barrier skip](/sequence-breaks/barrier-skip/) by having the shuffle move Hyrule Castle to where your continue location is.
