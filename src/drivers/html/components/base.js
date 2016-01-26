'use strict'

//TODO remove this dependency
import {MochaUI} from '../../../utils/mochaUI.js'

export class HTMLComponentBase {

  constructor ({htmlElement, cursor}) {
    var self = this

    self.cursor = cursor
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

    self.cursor.moveTo(x + 1, y + 1, () => {
      MochaUI.hide()

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

      MochaUI.show()

      return callback(err ? `cannot click on "${el.id}" ${err}` : null)
    })
  }

}
