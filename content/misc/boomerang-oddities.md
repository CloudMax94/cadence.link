---
title: "Boomerang Oddities"
menu:
  main:
    parent: "misc"
    weight: 100
---

The boomerang will only interact with entities at 0 height when returning.

**TODO**
In co-op if player 2 uses din's fire or another thing that pushes player 1 instantly, it has odd effects.
If player 1 uses boomerang and gets pushed this way, the boomerang will appear two tiles in front of the players new location, but it will appear at the height of the players position _before_ getting pushed.
This does not seem to apply to any other item.

Boomerang spawns inside of the player, and then moves two step forward. It does _not_ spawn in front of the player and move one step forward.
This can be seen in co-op by having player two stand next to player 1 and use deku leaf on player 1 at the same time as they use the boomerang.
No matter which direction they throw the boomerang, the result will always be the same.
Player two gets pushed by the leaf, boomerang spawns where player was, boomerang gets pushed by leaf, boomerang his player 1, player 1 moves an additional tile, and boomerang stays in place where player 1 stood initially.
