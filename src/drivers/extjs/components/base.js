'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'

export class ExtJsComponentBase {

  constructor ({selectors, extJsComponent, mochaUi}) {
    this.mochaUi = mochaUi
    this.selectors = selectors
    this.extJsComponent = extJsComponent

    this._htmlComponent = null
  }

  get htmlComponent () {
    if (!this._htmlComponent && this.extJsComponent) {
      let htmlElement = null

      if (this.extJsComponent.inputEl) {
        htmlElement = this.extJsComponent.inputEl.dom
      } else if (this.extJsComponent.el) {
        htmlElement = this.extJsComponent.el.dom
      }

      if (htmlElement) {
        this._htmlComponent = new HTMLComponentBase({
          mochaUi: this.mochaUi,
          htmlElement
        })
      }
    }

    return this._htmlComponent
  }

  get componentType () {
    return (this.constructor.name.replace(/.*Component/, '').toLowerCase())
  }

  click (callback) {
    this.htmlComponent.click((err) => {
      if (err) {
        return callback(`cannot click on component "${this.componentType}": ${err}`)
      } else {
        return callback(null)
      }
    })
  }

  fill (callback, value) {
    this.click((err) => {
      if (!err) {
        try {
          this.extJsComponent.setValue(value)
          err = false
        } catch (e) {
          err = 'failed to call setValue() method'
        }
      }

      return callback(err ? `cannot fill component "${this.componentType}": ${err}` : null)
    })
  }

  checkState ({stateFnName, expectedValue, callback}) {
    if (!this.extJsComponent[stateFnName]) {
      return callback(`ExtJs component does not have function "${stateFnName}".`)
    }

    const result = this.extJsComponent[stateFnName]()

    if (result === expectedValue) {
      return callback(null)
    } else {
      return callback(
        `state of "${this.componentType}" function "${stateFnName}" expected to be "${expectedValue}" `
        + `instead of "${result}"`
      )
    }
  }

  isEnabled (callback) {
    return this.checkState({
      stateFnName: 'isDisabled',
      expectedValue: false,
      callback: callback
    })
  }

  isDisabled (callback) {
    return this.checkState({
      stateFnName: 'isDisabled',
      expectedValue: true,
      callback: callback
    })
  }

  isVisible (callback) {
    return this.checkState({
      stateFnName: 'isHidden',
      expectedValue: false,
      callback: callback
    })
  }

  isHidden (callback) {
    return this.checkState({
      stateFnName: 'isHidden',
      expectedValue: true,
      callback: callback
    })
  }

}