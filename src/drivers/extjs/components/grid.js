'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'
import {ExtJsComponentComboBox} from './comboBox.js'

export class ExtJsComponentGrid extends ExtJsComponentBase {

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

  edit (callback, rowIndex = 0, colIndex = 0, valueIndex = 0) {
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

    //TODO update error messages
    new HTMLComponentBase({htmlElement, driver: this.driver}).click((err) => {
      if (err) {
        return callback(`Failed to click on item row #${rowIndex} of "${this.componentType}" ": ${err}`)
      }

      try {
        let editorElement = document
          .getElementById(cmp.el.id)
          .getElementsByClassName('x-editor')[0]
          .getElementsByClassName('x-field')[0]

        this.driver.getComponent('combobox', `#${editorElement.id}`, (err, editorComponent) => {
          if (err) {
            return callback(err ? `Failed: #${rowIndex} of "${this.componentType}" ": ${err}` : null)
          }

          editorComponent.select((err) => {
            return callback(err ? `Failed: #${rowIndex} of "${this.componentType}" ": ${err}` : null)
          }, valueIndex)
        })
      } catch (e) {
        return callback(`Failed to get editor element of "${this.componentType}" row #${rowIndex}": ${e}`)
      }
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
        `No store binded to "${this.componentType}" (selectors: ${this.selectors}):`
        + ` count of rows expected to be equal "${countExpected}" instead of "${count}".`
      )
    }
  }

}
