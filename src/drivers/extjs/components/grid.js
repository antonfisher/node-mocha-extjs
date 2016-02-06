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

  editorSelect (callback, rowIndex = 0, colIndex = 0, valueIndex = 0) {
    this._getEditor(
      (err, fieldElement) => {
        if (err) {
          return callback(err)
        }

        this.driver.getComponent('combobox', `#${fieldElement.id}`, (err, fieldComponent) => {
          if (err) {
            return callback(new Error(
              `Failed to get editor combobox component of "${this.componentType}" `
              + `row: #${rowIndex}", col: #${colIndex}"`,
              err
            ))
          }

          fieldComponent.select((err) => {
            if (err) {
              return callback(new Error(
                `Failed to get editor combobox component of "${this.componentType}" `
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

  editorFill (callback, rowIndex = 0, colIndex = 0, value = '') {
    this._getEditor(
      (err, fieldElement) => {
        if (err) {
          return callback(err)
        }

        this.driver.getComponent('textfield', `#${fieldElement.id}`, (err, fieldComponent) => {
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

  editorClick (callback, rowIndex = 0, colIndex = 0) {
    this._getEditor(
      (err, fieldElement) => {
        if (err) {
          return callback(err)
        }

        this.driver.getComponent('checkbox', `#${fieldElement.id}`, (err, fieldComponent) => {
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

  _getEditor (callback, rowIndex, colIndex) {
    const cmp = this.extJsComponent
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

      return callback(null, fieldElement);
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
