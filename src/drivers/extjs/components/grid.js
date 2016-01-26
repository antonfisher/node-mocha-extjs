'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentGrid extends ExtJsComponentBase {

  select (callback, rowIndex) {
    var self = this
    var cmp = self.extJsComponent
    var htmlElement = null

    try {
      htmlElement = document
        .getElementById(cmp.el.id)
        .getElementsByClassName('x-grid-item')[rowIndex]
    } catch (e) {
      return callback(`Failed to get element of "${self.componentType}" row #${rowIndex}": ${err}`)
    }

    new HTMLComponentBase({htmlElement, cursor: self.cursor}).click((err) => {
      if (err) {
        return callback(`Failed to click on item row #${rowIndex} of "${self.componentType}" ": ${err}`)
      } else {
        return callback(null)
      }
    })
  }

  checkRowsCount (callback, countExpected) {
    var self = this
    var cmp = self.extJsComponent

    if (!cmp.getStore || !cmp.getStore()) {
      return callback(`No store binded to "${self.componentType}" (${self.selectors}).`)
    }

    var count = cmp.getStore().getCount()

    if (count === countExpected) {
      return callback(null)
    } else {
      return callback(
        `No store binded to "${self.componentType}" (selectors: ${self.selectors}):`
        + ` count of rows expected to be equal "${countExpected}" instead of "${count}".`
      )
    }
  }

}
