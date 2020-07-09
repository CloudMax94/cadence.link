---
title: "Time Stop"
menu:
  main:
    parent: "tech"
    weight: 98030
---

**Exclusive to version 1.0.**

Activated by having player 2 start a dialog at the same time as player 1 interacts with a Sheikah Stone and remove player 2.

The game will be left in a state where time has stopped, just liked when a dialog is being shown.
Enemies will not move at all, and the rest of the game won't progress to the next beat until you move, both with and without fixed-beat.
This means that regular play functions like fixed-beat, with the exception of you not being allowed to play faster than the beat of the game, as that would result in missed beats.

Co-op with beat has the added effect of not progressing to the next beat until _both_ players perform an action within a single beat.
This allows you to do as much as you want within a single beat, like hovering an unlimited number of steps, or placing any number of bombs thanks to [same beat ammo](/tech/same-beat-ammo/).

To exit out of time stop you need to start a dialog or reboot the game, as time stop persists through save files.

Item collection dialogs & tutorials will softlock the game as the dialog won't trigger, resulting in you being stuck in the cutscene.
The game will however auto-save shortly after collecting the item, and IGT is paused during the cutscene, so you can safely collect the item and reset the game.

Time Stop does not affect boss battles. They also don't cancel time stop. After the boss fight time stop will still be active.
