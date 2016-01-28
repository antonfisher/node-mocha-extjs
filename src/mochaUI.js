'use strict'

import {Cursor} from './mochaUi/cursor.js'

export class MochaUI {

  constructor () {
    this.cursor = new Cursor()
  }

  get mochaElement () {
    return window.document.getElementById('mocha')
  }

  show () {
    if (this.mochaElement) {
      this.mochaElement.style.display = 'block'
    }

    this.cursor.show()
  }

  hide () {
    if (this.mochaElement) {
      this.mochaElement.style.display = 'none'
    }

    this.cursor.hide()
  }

}
