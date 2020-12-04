(function () {
  var scrollbarWidth = null
  function getScrollbarWidth (recalculate = false) {
    if ((scrollbarWidth != null) && !recalculate) {
      return scrollbarWidth
    }
    var outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.width = '100px'
    document.body.appendChild(outer)
    var widthNoScroll = outer.offsetWidth
    // force scrollbars
    outer.style.overflow = 'scroll'
    // add inner div
    var inner = document.createElement('div')
    inner.style.width = '100%'
    outer.appendChild(inner)
    var widthWithScroll = inner.offsetWidth
    // remove divs
    outer.parentNode.removeChild(outer)
    scrollbarWidth = widthNoScroll - widthWithScroll
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
