---
title: "Hookshot Displacement"
menu:
  main:
    parent: "tech"
    weight: 100
---

There are some very specific scenarios which allow you to move between the use & activation of your hookshot without cancelling it.
This includes teleporting (through [Player 2 Warping](/tech/player-2-warp), teleport traps), deku leaf, yves unburrow, and being frozen and pushing the ice block.
(See 1.0 differences down below for more info)

This allows you to alter your X,Y,Z coordinates before the hookshot starts pulling you in.
The game adds up the X and Y delta of the player and destination (tile in front of target) coordinates to determine travel distance.

So let's say that you're standing right in front of a target and hookshot it. The X and Y delta will both be 0, so you do not move.
If you however move left/right so you're diagonally in front of the target, the delta of one axis will be 1, pulling you forward 1 tile, putting you on the left/right of the target.
If you were to move so that you're diagonally behind the target, then the delta of one axis would be 2, while the other is 1, pulling you 3 tiles forward.

## Hookshot clipping

Hookshot clipping is really just a specific Hookshot Displacement interaction.
All objects (with the exceptions of ones you can stand on) do not actually have a height defined. They extend up infinitely.
So to allow you to hookshot over objects, they made it so that as long as you’re at least 1 height above an object the moment that the hookshot is activated, and your hookshot path has a tile available for you to stand on behind the object.

So if you’ve displaced your hookshot enough for the destination to go over/through a boss door for example, you will just be sent straight through it.

This can also be done on the overworld to clip through objects along the edge of the screen.
In this situation it will always treat it as if there is an available tile behind the object, but since the hookshot can’t send you past the edge of the screen, it will just place you inside the object, which then allows you to transition by simply walking.

## 1.0 differences

In 1.0 the game does not cancel the hookshot when you take any kind of knockback while hookshotting.
It also does not get cancelled if an object you’re standing on is pushed.
This means that you can offset your position be great amounts by standing on objects and chaining several different knockbacks onto them at once.


## Hookshot Pivoting

Changes the direction in which you fly after hookshotting.
By pivoting and hookshoting at the same time, you'll pivot before the hookshot starts pulling you in, sending you in the new facing direction, instead of towards the target.

This is primarily used to redirect the player towards a boss door, sending them straight through.
This works because entities do not have an actual height defined, except for those that are standable.
Instead the entities are infinitely high, and projectiles (hookshot included) are allowed through when one or more height above.

You can hookshot pivot by... **TODO: make a page/section for the 1.1 co-op pivot..**

In version 1.0.0 and 1.0.1 you can use [co-op pivot](/tech/co-op-pivot/) to easily pivot in any direction, even diagonals.
