(function () {
  function debounce (func, wait, immediate) {
    var timeout
    return (...args) => {
      var later = () => {
        timeout = null
        if (!immediate) func.apply(this, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        func.apply(this, args)
      }
    }
  }

  function initializePOI (poi) {
    var startPos
    var clickPos
    var img = poi.querySelector('img')
    var scroller = poi.querySelector('.poi-scroll')
    window.addEventListener('mousemove', function (e) {
      if (clickPos) {
        if (e.which === 1) {
          scroller.scrollLeft = startPos[0] + (clickPos[0] - e.pageX)
          scroller.scrollTop = startPos[1] + (clickPos[1] - e.pageY)
        } else {
          clickPos = false
        }
      }
    })
    img.addEventListener('mousedown', function (e) {
      startPos = [scroller.scrollLeft, scroller.scrollTop]
      clickPos = [e.pageX, e.pageY]
    })
    window.addEventListener('mouseup', function () {
      clickPos = false
    })
  }

  class BoulderPuzzleSolverEngine {
    constructor () {
      this.boulders = []
      this.goals = []
      this.layout = [
        [1,1,1],
        [1,0,1],
        [1,1,1]
      ]
    }

    prepare (layout, boulders, goals) {
      this.layout = layout
      this.boulders = boulders.filter(([bx, by]) => by !== -1)
      this.goals = goals.filter(([gx, gy]) => gy !== -1)
    }

    run (timeLimit, depthLimit, explosiveLimit) {
      this._testedPositions = {}
      this._depthLimit = depthLimit
      this._explosiveLimit = explosiveLimit
      this._forceStop = Date.now() + timeLimit * 1000 // We force stop the search at this point
      const solution = this._findSolution({
        explosives: 0,
        move: 'start',
        boulders: this.boulders
      })
      return solution ? solution : []
    }

    pushBoulder (boulders, index, delta) {
      const layout = this.layout

      const cX = boulders[index][0] - delta[0]
      const cY = boulders[index][1] - delta[1]
      if (layout[cY][cX] === 2) {
        return // Fence is blocking the boulder from behind, so we can't push it
      }
      if (boulders.findIndex(([bX,bY]) => bX === cX && bY === cY) >= 0) {
        return // A boulder is blocking the boulder from behind, so we can't push it
      }

      // And then we push the boulder!
      const newState = [...boulders]
      let didMove = false
      while (true) {
        const boulder = newState[index]
        const x = boulder[0] + delta[0]
        const y = boulder[1] + delta[1]
        const hitBoulder = newState.findIndex(([bX,bY]) => bX === x && bY === y)
        if (hitBoulder !== -1) {
          index = hitBoulder // We're hitting a boulder, start rolling that one instead
          continue
        }
        if (layout[y][x] !== 0) {
          break // We're hitting something, so we gotta stop
        }
        newState[index] = [x, y]
        didMove = true
      }
      if (!didMove) {
        return
      }
      return newState
    }

    bombBoulders (boulders, [x,y]) {
      const layout = this.layout

      if (layout[y][x] === 2) {
        return // Fence is blocking the tile, so we can't place a bomb there
      }
      if (boulders.findIndex(([bX,bY]) => bX === x && bY === y) >= 0) {
        return // A boulder is on this tile, solver does not account for placing bombs on boulders!
      }

      // Get all boulders in a 3x3 grid around the explosive
      const bombedBoulders = boulders.filter(([bX,bY]) => (
        bX >= x - 1 && bX <= x + 1 &&
        bY >= y - 1 && bY <= y + 1 &&
        !(bX === x && bY === y)
      ))
      const newState = [...boulders]
      let didMove = false
      for (const bombedBoulder of bombedBoulders) {
        let index = boulders.indexOf(bombedBoulder)
        const delta = [bombedBoulder[0] - x, bombedBoulder[1] - y]
        while (true) {
          const boulder = newState[index]
          const nX = boulder[0] + delta[0]
          const nY = boulder[1] + delta[1]
          const hitBoulder = newState.findIndex(([bX,bY]) => bX === nX && bY === nY)
          if (hitBoulder >= 0) {
            index = hitBoulder // We're hitting a boulder, start rolling that one instead
            continue
          }
          if (
            layout[nY][nX] !== 0 ||
            layout[nY][boulder[0]] === 2 ||
            layout[boulder[1]][nX] === 2
          ) {
            break // We're hitting something, so we gotta stop
          }
          newState[index] = [nX, nY]
          didMove = true
        }
      }
      if (!didMove) {
        return
      }
      return newState
    }

    getPossibleMoves (state) {
      const boulders = state.boulders
      const explosives = state.explosives

      const possibleMoves = []
      const checkedBombLocations = []
      const allowBombs = explosives < this._explosiveLimit
      for (let index = 0; index < boulders.length; index++) {
        const boulder = boulders[index]
        const checks = [
          ['left', -1, 0],
          ['right', 1, 0],
          ['up', 0, -1],
          ['down', 0, 1]
        ]
        for (const [move, dx, dy] of checks) {
          const newBoulders = this.pushBoulder(boulders, index, [dx, dy])
          if (newBoulders) {
            possibleMoves.push({
              pos: boulder,
              move,
              explosives,
              boulders: newBoulders
            })
          }
        }
        if (allowBombs) {
          const bombChecks = [
            ['upleft', -1, -1],
            ['upright', 1, -1],
            ['downleft', -1, 1],
            ['downright', 1, 1]
          ]
          for (const [move, dx, dy] of bombChecks) {
            const pos = [boulder[0] + dx, boulder[1] + dy]
            const hash = pos[0] + ',' + pos[1]
            if (checkedBombLocations.indexOf(hash) >= 0) {
              continue // we've already tried bombing at this coordinate
            }
            checkedBombLocations.push(hash)
            const newBoulders = this.bombBoulders(boulders, pos)
            if (newBoulders) {
              possibleMoves.push({
                pos,
                move: 'bomb',
                explosives: explosives + 1,
                boulders: newBoulders
              })
            }
          }
        }
      }
      return possibleMoves
    }

    _findSolution (state, depth = 0) {
      const boulders = state.boulders

      // Generate a hash for the boulder configuration, which does not care about boulder order
      // Since boulders only can be within a 8x8 grid, we make use of that to get a bit representation of the boulders
      let hash = 0
      for (let b of boulders) {
        hash += Math.pow(2, b[0] - 1 + (b[1] - 1) * 8)
      }
      // Alternate hashing that is also pretty fast:
      // let hash = ''
      // for (let b of boulders.map(b => b[0] + ',' + b[1]).sort()) {
      //   hash += b + ','
      // }

      if (hash in this._testedPositions) {
        let tested = this._testedPositions[hash]
        if (
          // if already reached this point using fewer explosives
          tested.explosives < state.explosives ||
          // or already reached this point with the same numer of explosives in an equal amount of or fewer steps
          (tested.explosives === state.explosives && tested.depth <= depth)
        ) {
          return
        }
      }
      this._testedPositions[hash] = {depth, explosives: state.explosives}

      let solved = true
      for (const [x, y] of this.goals) {
        if (!boulders.find(b => b[0] === x && b[1] === y)) {
          solved = false
          break
        }
      }
      if (solved) {
        return [state]
      }
      if (Date.now() >= this._forceStop) {
        return // We force stop the search, too much time has passed
      }
      if (depth >= this._depthLimit) {
        return
      }

      const possibleMoves = this.getPossibleMoves(state)
      let solution = null
      for (const possibleMove of possibleMoves) {
        const resp = this._findSolution(
          possibleMove,
          depth + 1
        )
        if (resp) {
          const newSolution = [state, ...resp]
          let explosivesUsed = newSolution[newSolution.length - 1].explosives
          if (
            // if this is the first solution
            !solution ||
            // or this solution uses fewer explosives
            explosivesUsed < solution[solution.length - 1].explosives ||
            // or this solution uses the same number of explosives, but fewer steps
            (explosivesUsed === solution[solution.length - 1].explosives && newSolution.length < solution.length)
          ) {
            solution = newSolution
            this._explosiveLimit = explosivesUsed // stop looking for solutions that use more bombs than we did for this one
            if (this._explosiveLimit === 0) {
              // If 0 bombs are used we can safely lower depth limit without losing any improved solutions
              let solutionDepth = depth + solution.length - 2
              this._depthLimit = solutionDepth
              if (solution.length === 2) {
                // The solution that was found at the next depth, so there can't be a more efficient move
                break
              }
            }
          }
        }
      }
      return solution
    }
  }

  const SOLUTION_DEBOUNCE_MS = 200
  class BoulderPuzzleSolver {
    constructor (container) {
      this.layout = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ]
      this.goals = [[4,-1], [5,-1]]
      this.boulders = [[0,-1], [1,-1], [2,-1], [3,-1]]

      this.engine = new BoulderPuzzleSolverEngine()
      this.solutionStep = 0
      this.solution = []

      this.findSolution = debounce(this.findSolution.bind(this), SOLUTION_DEBOUNCE_MS)

      this.gridContainer = container.querySelector('.boulder-solver-grid')
      this.gridContainer.addEventListener('mousedown', this.onMouseDown.bind(this))
      this.gridContainer.addEventListener('mousemove', this.onMouseMove.bind(this))
      this.gridContainer.addEventListener('contextmenu', (event) => event.preventDefault())
      window.addEventListener('mouseup', this.onMouseUp.bind(this))

      this.toolbarContainer = container.querySelector('.boulder-solver-toolbar-area')
      this.toolbarContainer.addEventListener('mousedown', this.onMouseDown.bind(this))
      this.toolbarContainer.addEventListener('mousemove', this.onMouseMove.bind(this))

      this.indicator = container.querySelector('.boulder-solver-indicator')
      this.bruteButton = container.querySelector('.boulder-solver-brute')
      this.prevButton = container.querySelector('.boulder-solver-prev')
      this.nextButton = container.querySelector('.boulder-solver-next')
      this.prevButton.addEventListener('click', (event) => {
        this.solutionStep--
        this.renderSolutionNavigation()
        this.renderPuzzle()
      })
      this.nextButton.addEventListener('click', (event) => {
        this.solutionStep++
        this.renderSolutionNavigation()
        this.renderPuzzle()
      })
      this.bruteButton.addEventListener('click', (event) => {
        // When brute-forcing a solution, we return to first step and clear out solution while waiting for new one
        this.bruteButton.innerHTML = 'Searching...'
        this.clearSolution(true)
        this.findSolution(10, 15) // up to 10 seconds & 15 moves
      })
      this.bruteButton.defaultText = this.bruteButton.innerHTML

      this.drawElements = []
      this.barElements = []
      for (let y = 0; y < 10; y++) {
        this.drawElements.push([])
        for (let x = 0; x < 10; x++) {
          let ele = document.createElement('div')
          ele.classList.add('boulder-solver-tile')
          ele.style.setProperty('--x', x)
          ele.style.setProperty('--y', y)
          this.gridContainer.appendChild(ele)
          this.drawElements[y][x] = ele
        }
        let ele = document.createElement('div')
        ele.classList.add('boulder-solver-tile')
        ele.style.setProperty('--x', y)
        this.toolbarContainer.appendChild(ele)
        this.barElements[y] = ele
      }
      this.dragging = false

      this.renderPuzzle()
    }

    getMouseTile (event) {
      let y = -1
      if (event.target === this.gridContainer) {
        y = Math.min(9, Math.max(0, Math.floor(event.offsetY / 32)))
      }
      let x = Math.min(9, Math.max(0, Math.floor(event.offsetX / 32)))
      return [x, y]
    }

    getBoulderOnTile (x, y) {
      let state = this.boulders
      if (this.solution.length && this.solutionStep > 0) {
        state = [
          // When viewing solution, we use its current state & add in toolbar boulders so that they're seen
          ...this.solution[this.solutionStep].boulders,
          ...this.boulders.filter(([bx, by]) => by === -1)
        ]
      }
      return state.findIndex(([bx,by]) => bx === x && by === y)
    }

    getGoalOnTile (x, y) {
      return this.goals.findIndex(([gx,gy]) => gx === x && gy === y)
    }

    onMouseDown (event) {
      event.preventDefault()
      let [x, y] = this.getMouseTile(event)

      let boulderIndex = this.getBoulderOnTile(x, y)
      if (boulderIndex >= 0) {
        this.dragging = ['boulder', boulderIndex]
        if (this.solutionStep > 0) {
          // Since we start dragging an object while viewing a solution step, we clear the solution & find a new solution
          this.clearSolution()
          this.findSolution()
        }
        return
      }

      let goalIndex = this.getGoalOnTile(x, y)
      if (goalIndex >= 0) {
        this.dragging = ['goal', goalIndex]
        if (this.solutionStep > 0) {
          // Since we start dragging an object while viewing a solution step, we clear the solution & find a new solution
          this.clearSolution()
          this.findSolution()
        }
        return
      }

      if (y === -1) {
        return // The rest of the logic does not apply to the toolbar
      }

      if (x === 0 || y === 0 || x === 9 || y === 9) {
        // If you start drawing from the outer edge, always use slab & prevent changing the layout on the edge
        if (event.button === 0) {
          this.dragging = ['tile', 1]
        } else if (event.button === 2) {
          this.dragging = ['tile', 0]
        }
      } else {
        if (event.button === 0) {
          let newType = this.layout[y][x] === 1 ? 2 : 1
          this.layout[y][x] = newType
          this.dragging = ['tile', newType]
        } else if (event.button === 2) {
          this.layout[y][x] = 0
          this.dragging = ['tile', 0]
        } else {
          return
        }
        this.clearSolution() // We clear solution since the layout is changed
        this.updatePuzzle()
      }
    }

    onMouseUp (event) {
      if (!(event.buttons & 3)) {
        this.dragging = false
      }
    }

    onMouseMove (event) {
      let [x, y] = this.getMouseTile(event)
      if (!(event.buttons & 3)) {
        this.dragging = false
      }
      if (this.dragging) {
        const layout = this.layout
        const [type, index] = this.dragging
        if (y !== -1 && (x === 0 || y === 0 || x === 9 || y === 9)) {
          return // Can't do anything with the border tiles
        }
        if (type === 'boulder') {
          if (y !== -1) {
            if ([2].indexOf(layout[y][x]) >= 0) {
              return // Can't drag boulder onto fences
            }
          } else if (this.getGoalOnTile(x, y) >= 0) {
            return // Can't drag boulder onto goals on toolbar
          }
          if (this.getBoulderOnTile(x, y) >= 0) {
            return // Can't drag boudler onto another boulder
          }
          const [oldX, oldY] = this.boulders[index]
          if (oldX !== x || oldY !== y) {
            this.clearSolution() // We clear solution since an object is being dragged
            this.boulders[index][0] = x
            this.boulders[index][1] = y
            this.updatePuzzle()
          }
        } else if (type === 'goal') {
          if (y !== -1) {
            if ([1, 2].indexOf(layout[y][x]) >= 0) {
              return // Can't drag goal onto fences or blocks
            }
          } else if (this.getBoulderOnTile(x, y) >= 0) {
            return // Can't drag goal on boulders on toolbar
          }
          if (this.getGoalOnTile(x, y) >= 0) {
            return // Can't drag goal onto another goal
          }
          const [oldX, oldY] = this.goals[index]
          if (oldX !== x || oldY !== y) {
            this.clearSolution() // We clear solution since an object is being dragged
            this.goals[index][0] = x
            this.goals[index][1] = y
            this.updatePuzzle()
          }
        } else if (type === 'tile') {
          if (y === -1) {
            return // toolbar does not have tiles..!
          }
          if (index === 1 || index === 2) {
            if (this.getGoalOnTile(x, y) >= 0) {
              return // Can't draw sla or fence on a tile that has a goal on it
            }
          }
          if (index === 2 && this.getBoulderOnTile(x, y) >= 0) {
            return // Can't draw fence on a tile that has a boulder or goal on it
          }
          this.layout[y][x] = index
          this.clearSolution() // We clear solution since the layout is changed
          this.updatePuzzle()
        }
      }
    }

    renderTile (layout, x, y) {
      let ele
      if (y === -1) {
        ele = this.barElements[x]
      } else {
        ele = this.drawElements[y][x]
      }
      if (y !== -1) {
        ele.dataset.tile = layout[y][x]
      }
      if (this.goals.find(([gx,gy]) => gx === x && gy === y)) {
        ele.dataset.hasGoal = true
      } else {
        delete ele.dataset.hasGoal
      }
      let state = this.boulders
      if (this.solution.length && this.solutionStep > 0) {
        state = [
          // When viewing solution, we use its current state & add in toolbar boulders so that they're seen
          ...this.solution[this.solutionStep].boulders,
          ...this.boulders.filter(([bx, by]) => by === -1)
        ]
      }
      if (state.find(([gx,gy]) => gx === x && gy === y)) {
        ele.dataset.hasBoulder = true
      } else {
        delete ele.dataset.hasBoulder
      }
    }

    renderPuzzle () {
      const layout = this.layout
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          this.renderTile(layout, x, y)
        }
        this.renderTile(layout, x, -1)
      }
    }

    renderSolutionNavigation () {
      this.prevButton.disabled = this.solutionStep === 0
      this.nextButton.disabled = this.solutionStep >= this.solution.length - 1

      const nextStep = this.solution[this.solutionStep + 1]
      if (nextStep) {
        this.indicator.style.visibility = 'visible'
        const [x, y] = nextStep.pos
        this.indicator.style.setProperty('--x', x)
        this.indicator.style.setProperty('--y', y)
        this.indicator.dataset.move = nextStep.move
      } else {
        this.indicator.style.visibility = 'hidden'
      }
    }

    clearSolution (resetToFirstStep = false) {
      if (!resetToFirstStep) {
        if (this.solution.length && this.solutionStep > 0) {
          this.boulders = [
            // When solution is cleared, we transfer the current solution state & add the toolbar boulders
            ...this.solution[this.solutionStep].boulders,
            ...this.boulders.filter(([bx, by]) => by === -1)
          ]
        }
      }
      this.solution = []
      this.solutionStep = 0
      this.bruteButton.disabled = true
      this.renderSolutionNavigation()
      if (resetToFirstStep) {
          this.renderPuzzle()
      }
    }

    updatePuzzle () {
      this.renderPuzzle()
      this.findSolution()
    }

    findSolution (timeLimit = 1, depthLimit = 10, explosiveLimit = 2) {
      this.engine.prepare(this.layout, this.boulders, this.goals)
      let solution = this.engine.run(timeLimit, depthLimit, explosiveLimit)

      this.solution = solution
      this.solutionStep = 0
      this.renderSolutionNavigation()
      // Disable button if it wasn't default time limit, or the solution didn't use any bombs
      this.bruteButton.disabled = timeLimit !== 1 || (this.solution.length && solution[solution.length - 1].explosives === 0)
      this.bruteButton.innerHTML = this.bruteButton.defaultText
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // For keyboard accessibility, we allow focusable <label>s to toggle
    // the checkbox/radio they point to with space
    var toggleTypes = ['checkbox', 'radio']
    document.addEventListener('keypress', function (event) {
      if (event.code !== 'Space') {
        return
      }
      var activeElement = document.activeElement
      if (activeElement.tagName.toLowerCase() !== 'label') {
        return
      }
      if (activeElement.htmlFor.length) {
        // If for attribute is specified, we make sure it's an input, and
        // that it is one of the supported types.
        var input = document.getElementById(activeElement.htmlFor)
        if (input && input.type && toggleTypes.indexOf(input.type.toLowerCase()) !== -1) {
          input.click()
        }
      } else {
        // If for attribute isn't specified, we instead usde the first
        // element we find within the label, if there is one.
        var inputWithin = activeElement.querySelector(toggleTypes.join(','))
        if (inputWithin) {
          inputWithin.click()
        }
      }
    })

    // Find and initialize all POIs
    var pois = document.querySelectorAll('.poi')
    for (var poi of pois) {
      initializePOI(poi)
    }

    // Find and initialize all boulder puzzle solvers
    var solvers = document.querySelectorAll('.boulder-solver')
    for (var solver of solvers) {
      new BoulderPuzzleSolver(solver)
    }
  })
})()
