'use strict'

import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentCheckBox extends ExtJsComponentBase {

  get titleProperties () {
    return ['fieldLabel', 'boxLabel', ...super.titleProperties]
  }

  generateSelectors (titleOrSelector) {
    return [
      `${this.componentType}[boxLabel~="${titleOrSelector}"]`,
      `${this.componentType}[fieldLabel~="${titleOrSelector}"]`,
      ...super.generateSelectors(titleOrSelector)
    ]
  }

}
