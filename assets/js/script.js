(function () {
  function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll' // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
    document.body.appendChild(outer)

    // Creating inner element and placing it in the container
    const inner = document.createElement('div')
    outer.appendChild(inner)

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer)

    return scrollbarWidth
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

  document.addEventListener('DOMContentLoaded', function () {
    // Calculate & set --scrollbar-width for style purposes
    document.body.style.setProperty('--scrollbar-width', getScrollbarWidth() + 'px')

    // Find and initialize all POIs
    var pois = document.querySelectorAll('.poi')
    for (var poi of pois) {
      initializePOI(poi)
    }
  })
})()
