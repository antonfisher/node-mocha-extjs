'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentComboBox extends ExtJsComponentBase {

  get titleProperties () {
    return ['fieldLabel', ...super.titleProperties]
  }

  generateSelectors (titleOrSelector) {
    return [`${this.componentType}[fieldLabel~="${titleOrSelector}"]`, ...super.generateSelectors(titleOrSelector)]
  }

  select (callback, index) {
    const cmp = this.extJsComponent

    this.click((err) => {
      if (err) {
        return callback(`cannot select item #${index} in component "${this.componentType}": ${err}`)
      }

      // TODO add validation method
      if (!cmp || !cmp.picker || !cmp.picker.el || !cmp.picker.el.id) {
        return callback(`cannot find picker of component "${this.componentType}"`)
      }

      let htmlElement = null

      try {
        htmlElement = document
          .getElementById(cmp.picker.el.id)
          .getElementsByClassName('x-boundlist-item')[index]
      } catch (e) {
        return callback(`Failed to get element of "${this.componentType}" row #${index}": ${e}`)
      }

      new HTMLComponentBase({htmlElement, driver: this.driver}).click((err) => {
        return callback(err ? `Failed to click on item #${index} of "${this.componentType}" ": ${err}` : null)
      })
    })
  }

}
