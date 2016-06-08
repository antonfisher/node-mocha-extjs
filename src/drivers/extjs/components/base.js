'use strict'

import {HTMLComponentBase} from '../../html/components/base.js'

export class ExtJsComponentBase {

  constructor ({driver, chain}) {
    this.chain = chain
    this.driver = driver
    this.selectors = []

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
          driver: this.driver,
          htmlElement
        })
      }
    }

    return this._htmlComponent
  }

  get componentType () {
    return (this.constructor.name.replace(/.*Component/, '').toLowerCase())
  }

  get titleProperties () {
    return ['tooltip', 'xtype']
  }

  generateSelectors (titleOrSelector) {
    return [
      `${this.componentType}[tooltip~="${titleOrSelector}"]`,
      `${this.componentType}[reference="${titleOrSelector}"]`,
      `${this.componentType}[xtype="${titleOrSelector}"]`
    ]
  }

  getComponent (callback, {callArgs}) {
    let selectors = []
    let extJsComponent = null
    const titleOrSelector = callArgs[0]

    if (titleOrSelector[0] === '#') {
      selectors = [titleOrSelector]
    } else {
      selectors = this.generateSelectors(titleOrSelector)
    }

    selectors.every((item) => {
      extJsComponent = this.getVisibleComponents(item)[0]
      return !extJsComponent
    })

    if (!extJsComponent) {
      (Ext.ComponentQuery.query(this.componentType) || []).every((item) => {
        this.titleProperties.every((prop) => {
          let title = item[prop]
          const fnName = `get${prop[0].toUpperCase()}${prop.slice(1)}`
          if (fnName && item[fnName] && typeof item[fnName] === 'function') {
            title = item[fnName]()
          }
          if ((new RegExp(titleOrSelector, 'g')).test(title)) {
            extJsComponent = item
          }
          return !extJsComponent
        })
        return !extJsComponent
      })
    }

    if (!extJsComponent) {
      return callback(new Error(`Selector "${selectors.join(', ')}" not found.`))
    } else if (!extJsComponent.el || !extJsComponent.el.dom) {
      return callback(new Error(`No existing HTML element for selector "${selectors.join(', ')}".`))
    }

    // TODO to method
    const rect = extJsComponent.el.dom.getBoundingClientRect()
    if (rect.left + rect.width < 0 || rect.top + rect.height < 0) {
      return callback(new Error(
        `No visible HTML element for selector "${selectors.join(', ')}", ` +
        `offset: ${rect.left},${rect.top}, size: ${rect.width},${rect.height}.`
      ))
    }

    this.selectors = selectors
    this.extJsComponent = extJsComponent

    return callback(null, this)
  }

  // BUG does not work properly
  getVisibleComponents (selector) {
    try {
      return Ext.ComponentQuery.query(selector).filter((item) => {
        if (!item.el || !item.el.dom) {
          return false
        }

        const r = item.el.dom.getBoundingClientRect()
        const x = (r.left + r.width / 2)
        const y = (r.top + r.height / 2)

        if (!window.document.elementsFromPoint) {
          return true
        }

        // this.mochaUi.hide()
        this.driver.mochaUi.hide()
        const visible = (window.document.elementsFromPoint(x, y) || []).filter((dom) => {
          return (dom === item.el.dom)
        })
        // this.mochaUi.show()
        this.driver.mochaUi.show()

        return (visible.length > 0)
      })
    } catch (e) {
      throw new Error(`${e}. Selector: ${selector}`)
    }
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

      return callback(err ? new Error(`cannot fill component "${this.componentType}": ${err}`) : null)
    })
  }

  checkState ({stateFnName, expectedValue, callback}) {
    if (!this.extJsComponent[stateFnName]) {
      return callback(new Error(`ExtJs component does not have function "${stateFnName}".`))
    }

    const result = this.extJsComponent[stateFnName]()

    if (result === expectedValue) {
      return callback(null)
    } else {
      return callback(new Error(
        `state of "${this.componentType}" function "${stateFnName}" expected to be "${expectedValue}" ` +
        `instead of "${result}"`
      ))
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
