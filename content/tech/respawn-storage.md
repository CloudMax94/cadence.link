---
title: "Respawn Storage"
menu:
  main:
    parent: "tech"
    weight: 100
---

The game keeps track of where to respawn you when you drown.
This is done by storing the X,Y,Z coordinates of where you last stood over land. (excluding ice)
This stored location is then used to respawn you.

However, there are ways to move around on land without actually updating this position.
This makes it possible to carefully place respawn location before drowning, and then combining it with Spawn Displacement.

The respawn location does not update when doing the following:
- Hookshotting
- Moving while frozen
- Feathering onto an enemy & landing afterwards
- Moving onto a trap. (altho if it's a bounce trap, and it pushes you onto a valid tile, it will update)
- Getting pushed by Yves unburrow so that you land on a tile that does not update respawn location. (like ice or water)
- When a standable entity below you is removed; The Z coordinate is kept
- Teleporting with Impas decoy ability

Z coordinate is rounded down. So if you stand on a 0.5 or 0.75 block, it will try to respawn at .0.
If you hover over a tile, it will store Z as the height of the tile, plus eventual standable entities. It will not reflect the hover height.
