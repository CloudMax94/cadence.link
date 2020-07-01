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

If a tile is already occupied by something, it is ignored.
If a tile does not match in height, it is ignored.
If a tile is blocked by a fence, it is ignored.

If it couldn't find a tile to use, it defaults back to the centerpoint, placing you inside whatever object is there.
Or if it's an object that you can stand on, on top of it.

The most common way to activate spawn displacement is by drowning in water or lava.

It can also be done by falling into pits, altho pits put you back at the entrance, rather than your last position on land.
