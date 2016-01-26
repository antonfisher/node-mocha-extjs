'use strict'

export class MochaUI {
  static get mochaElement () {
    return window.document.getElementById('mocha')
  }

  static get pointerElement () {
    return window.document.getElementById('mocha-extjs-testing-tool-pointer')
  }

  static show () {
    if (this.mochaElement) {
      this.mochaElement.style.display = 'block'
    }
    if (this.pointerElement) {
      this.pointerElement.style.display = 'block'
    }
  }

  static hide () {
    if (this.mochaElement) {
      this.mochaElement.style.display = 'none'
    }
    if (this.pointerElement) {
      this.pointerElement.style.display = 'none'
    }
  }

}
