'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentComboBox extends ExtJsComponentBase {

  select (callback, index) {
    const cmp = this.extJsComponent

    this.click((err) => {
      if (err) {
        return callback(`cannot select item #${index} in component "${this.componentType}": ${err}`)
      }

      //TODO add validation method
      if (!cmp || !cmp.picker || !cmp.picker.el || !cmp.picker.el.id) {
        return callback(`cannot find picker of component "${this.componentType}": ${err}`)
      }

      let htmlElement = null

      try {
        htmlElement = document
          .getElementById(cmp.picker.el.id)
          .getElementsByClassName('x-boundlist-item')[index]
      } catch (e) {
        return callback(`Failed to get element of "${this.componentType}" row #${index}": ${err}`)
      }

      new HTMLComponentBase({htmlElement, mochaUi: this.mochaUi}).click((err) => {
        return callback(err ? `Failed to click on item #${index} of "${this.componentType}" ": ${err}` : null)
      })
    })
  }

}
