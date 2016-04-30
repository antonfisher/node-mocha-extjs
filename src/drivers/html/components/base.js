'use strict'

export class HTMLComponentBase {

  constructor ({htmlElement, driver}) {
    this.driver = driver
    this.htmlElement = htmlElement
  }

  click (callback) {
    const el = this.htmlElement

    // for PhantomJs:
    //  ./node_modules/mocha-phantomjs/node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js:116
    // add "page.sendEvent.apply(this, data.sendEvent)"
    //
    const rect = el.getBoundingClientRect()
    const x = Math.round(rect.left + rect.width / 2)
    const y = Math.round(rect.top + rect.height / 2)

    this.driver.mochaUi.cursor.moveTo(x + 1, y + 1, () => {
      let err

      this.driver.mochaUi.hide()

      // BUG hide cellEditor in PhantomJs
      // if (el.focus) {
      //   el.focus()
      // }

      if (el.scrollIntoView) {
        el.scrollIntoView()
      }

      if (window.callPhantom) {
        window.callPhantom({sendEvent: ['mousemove', x - 1, y - 1]})
        window.callPhantom({sendEvent: ['mousemove', x, y]})
        err = !window.callPhantom({sendEvent: ['click', x, y]})
      } else {
        try {
          window.document.elementFromPoint(x, y).click()
          err = false
        } catch (e) {
          err = `[${x},${y}] (${e})`
        }
      }

      this.driver.mochaUi.show()

      return callback(err ? `cannot click on "${el.id}" ${err}` : null)
    })
  }

}
