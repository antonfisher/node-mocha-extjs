'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentCellEditor extends ExtJsComponentBase {

  getComponent (callback, {callArgs}) {
    const rowIndex = callArgs[0]
    const colIndex = callArgs[1]
    const cmp = this.chain.lastComponent.extJsComponent
    let htmlElement = null

    try {
      htmlElement = document
        .getElementById(cmp.el.id)
        .getElementsByClassName('x-grid-item')[rowIndex]
        .getElementsByClassName('x-grid-cell')[colIndex]
    } catch (e) {
      return callback(new Error(
        `Failed to find cell element of "${this.componentType}" row:#${rowIndex}, col:#${colIndex}`,
        e
      ))
    }

    new HTMLComponentBase({htmlElement, driver: this.driver}).click((err) => {
      if (err) {
        return callback(new Error(
          `Failed to click on cell element of "${this.componentType}" row: #${rowIndex}, col: #${colIndex}: ${err}`
        ))
      }

      let fieldElement = null
      try {
        const editorElements = document.getElementById(cmp.el.id).getElementsByClassName('x-editor')

        // "editorElements.item(i)" doesn't work in PhantonJS
        for (let i = 0; i < editorElements.length; i++) {
          const editorElement = editorElements[i]
          if (this.driver.isVisibleElement(editorElement)) {
            fieldElement = editorElement.getElementsByClassName('x-field')[0]
            break
          }
        }

        if (!fieldElement) {
          throw new Error('no "x-field" element found')
        }
      } catch (e) {
        return callback(new Error(
          `Failed to get editor element of "${this.componentType}" row:#${rowIndex}, col:#${colIndex}: ${e}`
        ))
      }

      this.selectors = `#${fieldElement.id}`
      this.extJsComponent = Ext.ComponentQuery.query(this.selectors)[0]

      if (!this.selectors) {
        return callback(new Error(
          `Failed to get editor component of "${this.componentType}" row:#${rowIndex}, col:#${colIndex}`
        ))
      }

      return callback(null, this)
    })
  }

  select (callback, index = 0) {
    this.driver.getComponent(
      (err, fieldComponent) => {
        if (err) {
          return callback(new Error(`Failed to get editor combobox component of "${this.componentType}"`, err))
        }

        fieldComponent.select((err) => {
          if (err) {
            return callback(new Error(`Failed to select editor combobox of "${this.componentType}"`, err))
          }

          return callback(null)
        }, index)
      },
      {
        type: 'comboBox',
        callArgs: [`#${this.extJsComponent.id}`],
        chain: this.chain
      }
    )
  }

  fill (callback, value = '') {
    this.driver.getComponent(
      (err, fieldComponent) => {
        if (err) {
          return callback(new Error(`Failed to fill editor textfield component of "${this.componentType}"`, err))
        }

        fieldComponent.fill((err) => {
          if (err) {
            return callback(new Error(`Failed to fill editor textfield component of "${this.componentType}"`, err))
          }

          return callback(null)
        }, value)
      },
      {
        type: 'textField',
        callArgs: [`#${this.extJsComponent.id}`],
        chain: this.chain
      }
    )
  }

  click (callback) {
    this.driver.getComponent(
      (err, fieldComponent) => {
        if (err) {
          return callback(new Error(`Failed to click editor checkbox component of "${this.componentType}"`, err))
        }

        fieldComponent.click((err) => {
          if (err) {
            return callback(new Error(`Failed to click editor checkbox component of "${this.componentType}"`, err))
          }

          return callback(null)
        })
      },
      {
        type: 'checkBox',
        callArgs: [`#${this.extJsComponent.id}`],
        chain: this.chain
      }
    )
  }

}
