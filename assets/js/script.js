(function () {
  function debounce (func, wait, immediate) {
    var timeout
    return () => {
      var later = () => {
        timeout = null
        if (!immediate) func.apply(this, arguments)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        func.apply(this, arguments)
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

  const DEPTH_LIMIT = 10
  const SOLUTION_DEBOUNCE_MS = 100
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
          ...this.solution[this.solutionStep].state,
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
        this.clearSolution() // We clear solution since an object is being dragged
        return
      }

      let goalIndex = this.getGoalOnTile(x, y)
      if (goalIndex >= 0) {
        this.dragging = ['goal', goalIndex]
        this.clearSolution() // We clear solution since an object is being dragged
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
          ...this.solution[this.solutionStep].state,
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
      this.prevButton.style.visibility = this.solutionStep > 0 ? 'visible' : 'hidden'
      this.nextButton.style.visibility = this.solutionStep < this.solution.length - 1 ? 'visible' : 'hidden'

      let nextStep = this.solution[this.solutionStep + 1]
      if (nextStep) {
        this.indicator.style.visibility = 'visible'
        let [x, y] = this.solution[this.solutionStep].state[nextStep.boulder]
        this.indicator.style.setProperty('--x', x)
        this.indicator.style.setProperty('--y', y)
        this.indicator.dataset.move = nextStep.move
      } else {
        this.indicator.style.visibility = 'hidden'
      }
    }

    clearSolution () {
      if (this.solution.length && this.solutionStep > 0) {
        this.boulders = [
          // When solution is cleared, we transfer the current solution state & add the toolbar boulders
          ...this.solution[this.solutionStep].state,
          ...this.boulders.filter(([bx, by]) => by === -1)
        ]
      }
      this.solution = []
      this.solutionStep = 0
      this.renderSolutionNavigation()
    }

    updatePuzzle () {
      this.renderPuzzle()
      this.findSolution()
    }

    // TODO: If boulders on top of half-block aren't pushed by boulders rolling into them,
    // the blocking/hit boulder checks should be AFTER the wall checks!
    pushBoulder (layout, boulders, index, delta) {
      const newState = [...boulders]

      let checkIndex = index
      while (true) {
        const boulder = newState[checkIndex]
        const x = boulder[0] - delta[0]
        const y = boulder[1] - delta[1]

        // Check if there's a boulder bind the boulder.
        // If there is, we gotta check if that one can be pushed to cause a chain reaction.
        const blockingBoulder = boulders.findIndex(([bX,bY]) => bX === x && bY === y)
        if (blockingBoulder >= 0) {
          checkIndex = blockingBoulder
          continue
        }

        // Check if there's a wall behind the boulder.
        // If there is, we can't push the boulder.
        if ([0, 1].indexOf(layout[y][x]) === -1) {
          return newState // Something is blocking the boulder from behind, so we can't push it
        }

        // Nothing is blocking, so we end the loop
        break
      }

      while (true) {
        const boulder = newState[index]
        const x = boulder[0] + delta[0]
        const y = boulder[1] + delta[1]
        const hitBoulder = boulders.findIndex(([bX,bY]) => bX === x && bY === y)
        if (hitBoulder >= 0) {
          index = hitBoulder // We're hitting a boulder, start rolling that one instead
          continue
        }
        if (layout[y][x] !== 0) {
          break // We're hitting something, so we gotta stop
        }
        newState[index] = [x, y]
      }
      return newState
    }

    getPossibleMoves (layout, boulders) {
      const possibleMoves = []
      for (let i = 0; i < boulders.length; i++) {
        const boulder = boulders[i]
        const checks = [
          ['left', -1, 0],
          ['right', 1, 0],
          ['up', 0, -1],
          ['down', 0, 1]
        ]
        for (const [move, dx, dy] of checks) {
          possibleMoves.push({
            boulder: i,
            move,
            state: this.pushBoulder(layout, boulders, i, [dx, dy])
          })
        }
      }
      return possibleMoves
    }

    _findSolution (layout, goal, state, depth = 0) {
      const boulders = state.state
      let solved = true
      for (let [x, y] of goal) {
        if (!boulders.find(b => b[0] === x && b[1] === y)) {
          solved = false
          break
        }
      }
      if (solved) {
        return [state]
      }
      if (depth >= this._depthLimit) {
        return
      }
      const sortedBoulders = [...boulders].sort((a, b) => a[0] == b[0] ? a[1] - b[1] : a[0] - b[0]).toString()
      if (sortedBoulders in this._testedPositions) {
        if (depth >= this._testedPositions[sortedBoulders]) {
          return // Already tried position at a lower or equal depth
        }
      }
      this._testedPositions[sortedBoulders] = depth

      const possibleMoves = this.getPossibleMoves(layout, boulders)
      let solution = null
      for (let possibleMove of possibleMoves) {
        const resp = this._findSolution(layout, goal, possibleMove, depth + 1)
        if (resp) {
          const newSolution = [state, ...resp]
          if (!solution || newSolution.length < solution.length) {
            solution = newSolution // first or lower depth than previous solution
            this._depthLimit = solution.length + 1
          }
        }
      }
      return solution
    }

    findSolution () {
      this._testedPositions = {}
      this._depthLimit =  DEPTH_LIMIT
      let goals = this.goals.filter(([gx, gy]) => gy !== -1)
      let state = this.boulders.filter(([bx, by]) => by !== -1)
      const solution = this._findSolution(this.layout, goals, {
        move: 'start',
        state
      })
      this.solution = solution && solution.length > 1 ? solution : []
      this.solutionStep = 0
      this.renderSolutionNavigation()
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
