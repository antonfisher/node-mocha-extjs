'use strict'

import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentTab extends ExtJsComponentBase {

  get titleProperties () {
    return ['title', ...super.titleProperties]
  }

  generateSelectors (titleOrSelector) {
    return [
      `${this.componentType}[title~="${titleOrSelector}"]`,
      ...super.generateSelectors(titleOrSelector)
    ]
  }

}
