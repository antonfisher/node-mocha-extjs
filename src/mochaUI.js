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
    var self = this

    if (self.mochaElement) {
      self.mochaElement.style.display = 'block'
    }

    self.cursor.show()
  }

  hide () {
    var self = this

    if (self.mochaElement) {
      self.mochaElement.style.display = 'none'
    }

    self.cursor.hide()
  }

}
