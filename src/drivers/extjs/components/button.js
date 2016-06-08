'use strict'

import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentButton extends ExtJsComponentBase {

  get titleProperties () {
    return ['text', ...super.titleProperties]
  }

  generateSelectors (titleOrSelector) {
    return [
      `${this.componentType}[text~="${titleOrSelector}"]`,
      ...super.generateSelectors(titleOrSelector)
    ]
  }

}
