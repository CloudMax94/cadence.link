---
title: "Barrier Skip"
menu:
  main:
    parent: "sequence-breaks"
    weight: 100
---

Allows you to bypass the Hyrule Castle Barrier, skipping the 4 dungeon instruments and Kakariko Crypt.

## Methods

### Wrong Warp (co-op)
**Exclusive to version 1.4 through 1.1.**

Requires that you have access to the Sheikah Stone on Zelda's Balcony.
Not available in permadeath as it requires getting a game over.

By entrance/exit transition [wrong warping](/tech/wrong-warp/) to Zelda's Balcony you're able to Wrong Warp into the Hyrule Castle Courtyard, as long as the entrance/exit coordinate lines up properly.
Note that the game over shop has to be disabled in settings, as otherwise you'll wrong warp to what seems to be a procedural generation test area.

{{< yt govP3NY_qmY >}}

### Spawn Displacement (co-op)

This works by combining [respawn storage](/tech/respawn-storage/) and [spawn displacement](/tech/spawn-displacement/).
We first set the respawn location of player 1 to the platform on the right.
Then we block off all spawn locations except the one on the other side of the barrier.

As an alternative to using hookshot, it's possible to freeze player 1 and move them into position.

{{< yt gkMqf0Vvshs >}} _This specific variation is for version 1.1 as it makes use of the broken fall logic._
_For other versions the setup has to be altered to get the player into position._

### Zelda + Impa (co-op)
**Exclusive to version 1.2.**

Requires that you have access to Zelda's Balcony and Impa.
The only way to fill both of these requirements is to start Single Character with Zelda as player 1 and Impa as player 2.

By triggering Impa's vanish ability you can get her to teleport diagonally behind the other player.
This allows you to teleport through the diagonal gap, since vanish ignores fence collision in version 1.2.

{{< yt DPZ9D7lEj4U >}}

### Bounce Cancel (solo)
**Exclusive to version 1.1 and 1.0.**

This method specifically requires that you have Down Thrust.
The game won't let you bounce on the bee without it, which is required for the [spawn displacement](/tech/spawn-displacement/).

You have to active [bounce cancel](/tech/bounce-cancel/) first.

{{< yt wMe7FN-WZL8 >}} _See video description for detailed information._
## Lobby version differences
In version 1.0 the Hyrule Castle lobby has Link and Zelda trap walls, requiring both characters to bring down the walls.
It is possible to bypass the Zelda trap with the use of hover boots and a diagonal knockback, but there is no known way to bypass the Link trap.
As a result, you must have Link unlocked to proceed in 1.0.
