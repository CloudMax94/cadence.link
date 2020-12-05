(function () {
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
  })
})()
