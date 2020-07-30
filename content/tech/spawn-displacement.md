---
title: "Spawn Displacement"
menu:
  main:
    parent: "tech"
    weight: 100
---

By blocking tiles it is possible to alter spawn locations.

When the game is spawning a player, it tries to put them at a specific X,Y,Z coordinate.
If something is already occupying that tile, or if the height does not match, there is logic for determining the new spawn location.

It checks tiles in the following order if the centerpoint is occupied:
1) right
2) down
3) left
4) up
5) down right
6) down left
7) up left
8) up right
9) twice right
10) twice down
11) twice left
12) twice up

A tile is ignored if
- it is occupied by something
-- Enemies also occupy the 4 tiles adjacent to them, as long as they are at same height
- it does not match in height
- it is blocked by a fence
-- For diagonals it checks the 4 sides that connect to the corner
- it is a bridge at the same height as water/lava
-- Lilypads are technically bridges

If it couldn't find a tile to use it checks all the tiles again, but this time without enemies blocking their 4 adjacent tiles.
If it still does not find a tile it defaults back to the centerpoint, placing you inside whatever entity is there, or on top of it if it is standable.

The most common way to activate spawn displacement is by drowning in water or lava.

It can also be done by falling into pits, altho pits put you back at the entrance, rather than your last position on land.
