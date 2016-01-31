'use strict'

export class HTMLComponentBase {

  constructor ({htmlElement, driver}) {
    this.driver = driver
    this.htmlElement = htmlElement
  }

  click (callback) {
    const el = this.htmlElement
    let err

    // for PhantomJs:
    //  ./node_modules/mocha-phantomjs/node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js:116
    // add "page.sendEvent.apply(this, data.sendEvent)"
    //
    const rect = el.getBoundingClientRect()
    const x = (rect.left + rect.width / 2)
    const y = (rect.top + rect.height / 2)

    this.driver.mochaUi.cursor.moveTo(x + 1, y + 1, () => {
      this.driver.mochaUi.hide()

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

      this.driver.mochaUi.show()

      return callback(err ? `cannot click on "${el.id}" ${err}` : null)
    })
  }

}
