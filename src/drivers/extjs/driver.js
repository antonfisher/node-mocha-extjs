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
import {ExtJsComponentCellEditor} from './components/cellEditor.js'
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
      'tab', 'grid', 'radio', 'button', 'window', 'checkbox', 'combobox', 'textfield', 'numberfield',
      'cellEditor'
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
    let componentObject = null
    const properties = {
      driver: this
    };

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
    } else if (type === 'cellEditor') {
      componentObject = new ExtJsComponentCellEditor(properties)
    } else if (type === 'numberfield') {
      componentObject = new ExtJsComponentNumberField(properties)
    }

    if (!componentObject) {
      return callback(new Error(`Type "${type}" is not supported by driver`))
    }

    return componentObject.getComponent(type, titleOrSelector, callback);
  }

  isVisibleElement (element) {
    const style = window.getComputedStyle(element)
    return (style.opacity !== 0 && style.display !== 'none' && style.visibility !== 'hidden')
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
