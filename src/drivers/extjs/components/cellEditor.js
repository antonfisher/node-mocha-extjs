'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentCellEditor extends ExtJsComponentBase {

  getComponent (callback, {callArgs, lastComponent}) {
    const rowIndex = callArgs[0]
    const colIndex = callArgs[1]
    const cmp = lastComponent.extJsComponent
    let htmlElement = null

    try {
      htmlElement = document
        .getElementById(cmp.el.id)
        .getElementsByClassName('x-grid-item')[rowIndex]
        .getElementsByClassName('x-grid-cell')[colIndex]
    } catch (e) {
      return callback(new Error(
        `Failed to find cell element of "${this.componentType}" row:#${rowIndex}", col:#${colIndex}"`,
        e
      ))
    }

    new HTMLComponentBase({htmlElement, driver: this.driver}).click((err) => {
      if (err) {
        return callback(new Error(
          `Failed to click on cell element of "${this.componentType}" row: #${rowIndex}", col: #${colIndex}": ${err}`
        ))
      }

      let fieldElement = null
      try {
        for (let editorElement of document.getElementById(cmp.el.id).getElementsByClassName('x-editor')) {
          if (this.driver.isVisibleElement(editorElement)) {
            fieldElement = editorElement.getElementsByClassName('x-field')[0]
            break
          }
        }

        if (!fieldElement) {
          throw new Error(`no "x-field" element found`)
        }
      } catch (e) {
        return callback(new Error(
          `Failed to get editor element of "${this.componentType}" row:#${rowIndex}", col:#${colIndex}": ${e}`
        ))
      }

      //this.selectors = selectors
      //this.extJsComponent = extJsComponent
      //
      //return callback(null, this)
      return callback(null, fieldElement);
    })
  }

  select (callback, rowIndex = 0, colIndex = 0, valueIndex = 0) {
    this._getCellEditor(
      (err, fieldElement) => {
        if (err) {
          return callback(err)
        }

        this.driver.getComponent('comboBox', `#${fieldElement.id}`, (err, fieldComponent) => {
          if (err) {
            return callback(new Error(
              `Failed to get editor comboBox component of "${this.componentType}" `
              + `row: #${rowIndex}", col: #${colIndex}"`,
              err
            ))
          }

          fieldComponent.select((err) => {
            if (err) {
              return callback(new Error(
                `Failed to get editor comboBox component of "${this.componentType}" `
                + `row: #${rowIndex}", col: #${colIndex}"`,
                err
              ))
            }

            return callback(null)
          }, valueIndex)
        })
      },
      rowIndex,
      colIndex
    )
  }

  fill (callback, rowIndex = 0, colIndex = 0, value = '') {
    this._getCellEditor(
      (err, fieldElement) => {
        if (err) {
          return callback(err)
        }

        this.driver.getComponent('textField', `#${fieldElement.id}`, (err, fieldComponent) => {
          if (err) {
            return callback(new Error(
              `Failed to get editor component for "${this.componentType}" `
              + `row: #${rowIndex}", col: #${colIndex}"`,
              err
            ))
          }

          fieldComponent.fill((err) => {
            if (err) {
              return callback(new Error(
                `Failed to get editor component for "${this.componentType}" `
                + `row: #${rowIndex}", col: #${colIndex}"`,
                err
              ))
            }

            return callback(null)
          }, value)
        })
      },
      rowIndex,
      colIndex
    )
  }

  click (callback, rowIndex = 0, colIndex = 0) {
    this._getCellEditor(
      (err, fieldElement) => {
        if (err) {
          return callback(err)
        }

        this.driver.getComponent('checkBox', `#${fieldElement.id}`, (err, fieldComponent) => {
          if (err) {
            return callback(new Error(
              `Failed to get editor component for "${this.componentType}" `
              + `row: #${rowIndex}", col: #${colIndex}"`,
              err
            ))
          }

          fieldComponent.click((err) => {
            if (err) {
              return callback(new Error(
                `Failed to get editor component for "${this.componentType}" `
                + `row: #${rowIndex}", col: #${colIndex}"`,
                err
              ))
            }

            return callback(null)
          })
        })
      },
      rowIndex,
      colIndex
    )
  }

}
