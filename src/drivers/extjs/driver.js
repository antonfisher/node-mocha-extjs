'use strict'

import {waitForFn} from '../../utils/utils.js'

import {ExtJsComponentTab} from './components/tab.js'
import {ExtJsComponentGrid} from './components/grid.js'
import {ExtJsComponentRadio} from './components/radio.js'
import {ExtJsComponentButton} from './components/button.js'
import {ExtJsComponentWindow} from './components/window.js'
import {ExtJsComponentCheckBox} from './components/checkBox.js'
import {ExtJsComponentComboBox} from './components/comboBox.js'
import {ExtJsComponentTextField} from './components/textField.js'
import {ExtJsComponentNumberField} from './components/numberField.js'

export class ExtJsDriver {

  constructor ({mochaUi}) {
    if (!mochaUi) {
      throw new Error(`Class ${this.constructor.name} created with undefined property "mochaUi".`)
    }

    this.mochaUi = mochaUi
  }

  get supportedComponents () {
    return [
      'tab', 'grid', 'radio', 'button', 'window', 'checkbox', 'combobox', 'textfield', 'numberfield'
    ]
  }

  get supportedComponentActions () {
    return [
      'click', 'fill', 'select', 'isEnabled', 'isDisabled', 'isHidden', 'isVisible', 'checkRowsCount', 'edit'
    ]
  }

  get supportedActions () {
    return [
      'waitText', 'waitLoadMask'
    ]
  }

  getComponent (type, titleOrSelector, callback) {
    let selector = null
    let selectors = []
    let extJsComponent = null

    //FIX ME
    //if (!type) {
    //  selector = titleOrSelector
    //  extJsComponent = this.getVisibleComponents(selector)[0]
    //}

    if (!extJsComponent && type) {
      let titleProperties = []

      if (titleOrSelector[0] === '#') {
        selectors = [titleOrSelector]
      } else {
        selectors = [
          `${type}[tooltip~="${titleOrSelector}"]`,
          `${type}[reference="${titleOrSelector}"]`,
          `${type}[xtype="${titleOrSelector}"]`
        ]
      }

      if (type === 'button') {
        titleProperties = ['text', 'tooltip', 'xtype']
        selectors.unshift(`${type}[text~="${titleOrSelector}"]`)
      } else if (type === 'tab' || type === 'window' || type === 'grid') {
        titleProperties = ['title', 'tooltip', 'xtype']
        selectors.unshift(`${type}[title~="${titleOrSelector}"]`)
      } else if (type === 'textfield' || type === 'numberfield' || type === 'combobox') {
        titleProperties = ['fieldLabel', 'tooltip', 'xtype']
        selectors.unshift(`${type}[fieldLabel~="${titleOrSelector}"]`)
      } else if (type === 'checkbox' || type === 'radio') {
        titleProperties = ['fieldLabel', 'boxLabel', 'tooltip', 'xtype']
        selectors.unshift(`${type}[fieldLabel~="${titleOrSelector}"]`)
        selectors.unshift(`${type}[boxLabel~="${titleOrSelector}"]`)
      } else {
        return callback(`Type "${type}" not supported.`)
      }

      selectors.every((item) => {
        extJsComponent = this.getVisibleComponents(item)[0]
        return !extJsComponent
      })

      if (!extJsComponent) {
        (Ext.ComponentQuery.query(type) || []).every((item) => {
          titleProperties.every((prop) => {
            let title = item[prop]
            const fnName = `get${prop[0].toUpperCase()}${prop.slice(1)}`
            if (fnName && item[fnName] && typeof item[fnName] === 'function') {
              title = item[fnName].call(item)
            }
            if ((new RegExp(titleOrSelector, 'g')).test(title)) {
              extJsComponent = item
            }
            return !extJsComponent
          })
          return !extJsComponent
        })
      }
    }

    if (!extJsComponent) {
      return callback(`Selector "${selector || selectors.join(', ')}" not found.`)
    } else if (!extJsComponent.el || !extJsComponent.el.dom) {
      return callback(`No existing HTML element for selector "${selector || selectors.join(', ')}".`)
    }

    //TODO to method
    const rect = extJsComponent.el.dom.getBoundingClientRect()
    if (rect.left + rect.width < 0 || rect.top + rect.height < 0) {
      return callback(
        `No visible HTML element for selector "${selector}", `
        + `offset: ${rect.left},${rect.top}, size: ${rect.width},${rect.height}.`
      )
    }

    let componentObject = null
    const properties = {
      driver: this,
      selectors: (selector || selectors.join(', ')),
      extJsComponent
    }

    if (type === 'tab') {
      componentObject = new ExtJsComponentTab(properties)
    } else if (type === 'grid') {
      componentObject = new ExtJsComponentGrid(properties)
    } else if (type === 'radio') {
      componentObject = new ExtJsComponentRadio(properties)
    } else if (type === 'button') {
      componentObject = new ExtJsComponentButton(properties)
    } else if (type === 'window') {
      componentObject = new ExtJsComponentWindow(properties)
    } else if (type === 'checkbox') {
      componentObject = new ExtJsComponentCheckBox(properties)
    } else if (type === 'combobox') {
      componentObject = new ExtJsComponentComboBox(properties)
    } else if (type === 'textfield') {
      componentObject = new ExtJsComponentTextField(properties)
    } else if (type === 'numberfield') {
      componentObject = new ExtJsComponentNumberField(properties)
    }

    if (componentObject) {
      return callback(null, componentObject)
    } else {
      throw new Error(`Component "${type}" is not supported by driver "${this.constructor.name}".`)
    }
  }

  //BUG does not work properly
  getVisibleComponents (selector) {
    try {
      return Ext.ComponentQuery.query(selector).filter((item) => {
        if (!item.el || !item.el.dom) {
          return false
        }

        const r = item.el.dom.getBoundingClientRect()
        const x = (r.left + r.width / 2)
        const y = (r.top + r.height / 2)

        this.mochaUi.hide()
        const visible = (window.document.elementsFromPoint(x, y) || []).filter((dom) => {
          return (dom === item.el.dom)
        })
        this.mochaUi.show()

        return (visible.length > 0)
      })
    } catch (e) {
      throw `${e}. Selector: ${selector}`;
    }
  }

  waitLoadMask (callback) {
    return waitForFn(
      (done) => {
        const maskDisplayed = Ext.ComponentManager.getAll()
            .filter((item)=> {
              return (item.xtype === 'loadmask' && item.isHidden() === false)
            }).length > 0

        if (maskDisplayed) {
          done('Load mask still presents.')
        } else {
          setTimeout(() => {
            done(null)
          }, 300)
        }
      },
      callback,
      {
        delay: 500 // wait load mask display delay
      }
    )
  }

  waitText (callback, text) {
    //TODO check parent
    return waitForFn(
      (done) => {
        let textPresented = false

        if (text instanceof RegExp) {
          textPresented = text.test(window.document.body.innerText)
        } else if (window.find) {
          textPresented = window.find(text, true, true, true) // arg aWholeWord - Unimplemented
        } else {
          textPresented = (new RegExp(text, 'g')).test(window.document.body.innerText)
        }

        done(textPresented ? null : `Text pattern "${text}" not found on page.`)
      },
      callback
    )
  }

}
