'use strict'

export class HTMLComponentBase {

  constructor ({htmlElement, mochaUi}) {
    var self = this

    self.mochaUi = mochaUi
    self.htmlElement = htmlElement
  }

  click (callback) {
    var self = this
    var el = self.htmlElement
    var err

    // for PhantomJs:
    //  ./node_modules/mocha-phantomjs/node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js:116
    // add "page.sendEvent.apply(this, data.sendEvent)"
    //
    var rect = el.getBoundingClientRect()
    var x = (rect.left + rect.width / 2)
    var y = (rect.top + rect.height / 2)

    self.mochaUi.cursor.moveTo(x + 1, y + 1, () => {
      self.mochaUi.hide()

      if (el.focus) {
        el.focus()
      }

      if (el.scrollIntoView) {
        el.scrollIntoView()
      }

      if (window.callPhantom) {
        err = !window.callPhantom({
          sendEvent: ['click', x, y]
        })
      } else {
        try {
          window.document.elementFromPoint(x, y).click()
          err = false
        } catch (e) {
          err = `[${x},${y}] (${e})`
        }
      }

      self.mochaUi.show()

      return callback(err ? `cannot click on "${el.id}" ${err}` : null)
    })
  }

}
