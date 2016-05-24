'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentDataView extends ExtJsComponentBase {
  select (callback, index) {
    const cmp = this.extJsComponent
    let htmlElement = null

    try {
      htmlElement = document
        .getElementById(cmp.el.id)
        .getElementsByClassName(cmp.itemCls)[index]
    } catch (e) {
      return callback(`Failed to get element of "${this.componentType}" index #${index}": ${e}`)
    }

    new HTMLComponentBase({htmlElement, driver: this.driver}).click((err) => {
      return callback(err ? `Failed to click on item index #${index} of "${this.componentType}" ": ${err}` : null)
    })
  }
}

