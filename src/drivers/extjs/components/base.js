'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'

export class ExtJsComponentBase {

  constructor ({selectors, extJsComponent, mochaUi}) {
    var self = this

    self.mochaUi = mochaUi
    self.selectors = selectors
    self.extJsComponent = extJsComponent

    self._htmlComponent = null
  }

  get htmlComponent () {
    var self = this

    if (!self._htmlComponent && self.extJsComponent) {
      let htmlElement = null

      if (self.extJsComponent.inputEl) {
        htmlElement = self.extJsComponent.inputEl.dom
      } else if (self.extJsComponent.el) {
        htmlElement = self.extJsComponent.el.dom
      }

      if (htmlElement) {
        self._htmlComponent = new HTMLComponentBase({
          mochaUi: self.mochaUi,
          htmlElement
        })
      }
    }

    return self._htmlComponent
  }

  get componentType () {
    return (this.constructor.name.replace(/.*Component/, '').toLowerCase())
  }

  click (callback) {
    var self = this

    self.htmlComponent.click((err) => {
      if (err) {
        return callback(`cannot click on component "${self.componentType}": ${err}`)
      } else {
        return callback(null)
      }
    })
  }

  fill (callback, value) {
    var self = this

    self.click((err) => {
      if (!err) {
        try {
          self.extJsComponent.setValue(value)
          err = false
        } catch (e) {
          err = 'failed to call setValue() method'
        }
      }

      if (err) {
        return callback(`cannot fill component "${self.componentType}": ${err}`)
      } else {
        return callback(null)
      }
    })
  }

  checkState ({stateFnName, expectedValue, callback}) {
    var self = this

    if (!self.extJsComponent[stateFnName]) {
      return callback(`ExtJs component does not have function "${stateFnName}".`)
    }

    var result = self.extJsComponent[stateFnName]()

    if (result === expectedValue) {
      return callback(null)
    } else {
      return callback(
        `state of "${self.componentType}" function "${stateFnName}" expected to be "${expectedValue}" `
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