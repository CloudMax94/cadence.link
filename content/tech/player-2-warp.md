---
title: "Player 2 Warping"
menu:
  main:
    parent: "tech"
    weight: 100
---

When player 2 is far enough offscreen, they are teleported to player 1.
The game tries to place them on the same X,Y coordinate as player 1.
It uses the Z coordinate of the tile that player 1 is currently on, not including standable blocks/bridges.

After that it works the same way as regular spawn displacement, except for one key difference:
The Z coordinate that player 2 spawns on is the Z coordinate of their own stored respawn location.

This means that if player 2 is currently in the middle of a hover, they will still be hovering at the new X,Y coordinate.

There are many ways to trigger this:
- By having player 1 or 2 hookshot something offscreen past the screen boundaries.
- By having player 2 jump into water and drown, and while they're drowning, move player 1 so that their respawn location is past the screen boundaries.
- By starting co-op and then using respawn storage for player 2 before they've moved. This results in their respawn location not being properly set, and seemingly puts them somewhere northwest off-screen, past 0,0. (Z height will be 0 when warping)
- By having player 1 (or 2?) stand on a block and then use knockback to move the block off-screen with the player on it.
- And probably a whole bunch of other ways
