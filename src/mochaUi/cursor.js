'use strict'

export class Cursor {

  constructor () {
    this._size = 14
    this._timeout = 400
    this._initTransition = `all ${this._timeout}ms ease-in-out`
    this._position = {
      x: 0,
      y: 0
    }

    this._point = window.document.getElementById('mocha-extjs-testing-tool-pointer')

    if (!this._point) {
      this._point = document.createElement('div')

      this._point.id = 'mocha-extjs-testing-tool-pointer'
      this._point.style.top = `${this._position.y}px`
      this._point.style.left = `${this._position.x}px`
      this._point.style.width = `${this._size}px`
      this._point.style.zIndex = '90000'
      this._point.style.height = `${this._size}px`
      this._point.style.border = '2px solid #ffffff'
      this._point.style.opacity = '1'
      this._point.style.position = 'absolute'
      this._point.style.transition = this._initTransition
      this._point.style.borderRadius = `0 ${this._size / 2}px ${this._size / 2}px ${this._size / 2}px`
      this._point.style.backgroundColor = '#ee3300'

      window.document.body.appendChild(this._point)
    }
  }

  moveTo (x, y, callback) {
    if (window.callPhantom) {
      this._point.style.left = `${x}px`
      this._point.style.top = `${y}px`
      return callback(null)
    } else {
      const translate = `translate(${x}px, ${y}px)`
      this._point.style.transform = translate
      setTimeout(() => {
        this._point.style.transition = 'all 50ms ease-in-out'
        this._point.style.transform = `${translate} scale(0.5)`
        setTimeout(() => {
          this._point.style.transform = `${translate} scale(1)`
          setTimeout(() => {
            this._point.style.transition = this._initTransition
            return callback(null)
          }, 50)
        }, 50)
      }, this._timeout)
    }
  }

  hide () {
    this._point.style.display = 'none'
  }

  show () {
    this._point.style.display = 'block'
  }

}
