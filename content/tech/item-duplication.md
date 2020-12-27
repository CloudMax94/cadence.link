---
title: "Item Duplication"
menu:
  main:
    parent: "tech"
    weight: 100
---

## Throw Duplication

By hitting a thrown object before it breaks using an item or ability that can break it, it will break twice, generating two drops.

{{< tweet 1285282351765848064 >}}

### 1.1 & 1.0 differences

In version 1.1 and 1.0 you were able to perform the dupe by simply attacking the pot normally with your weapon.

{{< tweet 1150341610229469184 >}}

## Hookshot Item Duplication

**Exclusive to version 1.0.**

It is possible to start an overworld screen transition while the hookshot is returning an item to you.
Because of how the hookshot works, the item is moved to the tile you're walking onto on the next screen.
As a result, the item is collected during the screen transition, and any interaction made to the previous screen isn't saved.
This allows you to collect items that do not despawn infinitely.

When playing with beat you'll want to pause the game while the item starts traveling towards you and wait a beat.
This gives you control of the character again, allowing you to move towards the next screen before the item reaches you.
In fixed beat you can just buffer the movement after using the hookshot by pressing the direction right away.

{{< tweet 1158034121144168449 >}}

## Transition Item Duplication

**Exclusive to version 1.0.**

When an object or enemy is destroyed after starting an overworld screen transition, their drops spawn as part of the next screen.
It will also not save that the object/enemy was destroyed, so they'll re-appear the next time you visit the screen.
However, the item that spawned will also be removed after finishing a transition away from the new screen.
Because of this you have to collect the item that spawned during the return transition.

This can be done by making sure that the item spawns at the edge of the screen, next to the transition.
Then you can simply walk onto that tile on the return transition to collect the item before it despawns.

{{< tweet 1160576486702641154 >}}
