---
title: "Boulder Puzzles"
list: false
menu:
  main:
    parent: "puzzle"
    weight: 20
---

## Puzzle Solver

This tool finds a solution using as few bombs and moves as possible.
It will only look for solutions that take up to 10 moves and 2 bombs.
If the search is still ongoing after 1 second it will stop and show the best solution it could find, if any.

If it can't find a solution, or if the solution requires explosives, you can do a brute-force search.
This search will look for solutions that take up to 15 moves, and goes on for up to 10 seconds instead of just 1.
This allows you to search for longer solutions that use fewer explosives, or solve puzzles that simply were not possible in 10 moves.

{{< boulder-puzzle-solver >}}
