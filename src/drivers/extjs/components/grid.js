'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentGrid extends ExtJsComponentBase {

  get titleProperties () {
    return ['title', ...super.titleProperties]
  }

  generateSelectors (titleOrSelector) {
    return [`${this.componentType}[text~="${titleOrSelector}"]`, ...super.generateSelectors(titleOrSelector)]
  }

  select (callback, rowIndex = 0, colIndex = 0) {
    const cmp = this.extJsComponent
    let htmlElement = null

    try {
      htmlElement = document
        .getElementById(cmp.el.id)
        .getElementsByClassName('x-grid-item')[rowIndex]
        .getElementsByClassName('x-grid-cell')[colIndex]
    } catch (e) {
      return callback(`Failed to get element of "${this.componentType}" row #${rowIndex}": ${e}`)
    }

    new HTMLComponentBase({htmlElement, driver: this.driver}).click((err) => {
      return callback(err ? `Failed to click on item row #${rowIndex} of "${this.componentType}" ": ${err}` : null)
    })
  }

  checkRowsCount (callback, countExpected) {
    const cmp = this.extJsComponent

    if (!cmp.getStore || !cmp.getStore()) {
      return callback(`No store binded to "${this.componentType}" (${this.selectors}).`)
    }

    const count = cmp.getStore().getCount()

    if (count === countExpected) {
      return callback(null)
    } else {
      return callback(
        `No store binded to "${this.componentType}" (selectors: ${this.selectors}):` +
        ` count of rows expected to be equal "${countExpected}" instead of "${count}".`
      )
    }
  }

}
