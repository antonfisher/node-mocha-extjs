'use strict'

import {waitForFn} from '../../utils/utils.js'

import {ExtJsComponentTab} from './components/tab.js'
import {ExtJsComponentGrid} from './components/grid.js'
import {ExtJsComponentDataView} from './components/dataview.js'
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
      'tab', 'grid', 'radio', 'button', 'window', 'checkBox', 'comboBox', 'textField', 'numberField',
      'cellEditor', 'dataview'
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

  getComponent (callback, {type, callArgs, chain}) {
    let componentObject = null
    const properties = {
      driver: this,
      chain: chain
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
    } else if (type === 'checkBox') {
      componentObject = new ExtJsComponentCheckBox(properties)
    } else if (type === 'comboBox') {
      componentObject = new ExtJsComponentComboBox(properties)
    } else if (type === 'textField') {
      componentObject = new ExtJsComponentTextField(properties)
    } else if (type === 'cellEditor') {
      componentObject = new ExtJsComponentCellEditor(properties)
    } else if (type === 'numberField') {
      componentObject = new ExtJsComponentNumberField(properties)
    } else if (type === 'dataview') {
      componentObject = new ExtJsComponentDataView(properties)
    }

    if (!componentObject) {
      return callback(new Error(`Type "${type}" is not supported by driver`))
    }

    return componentObject.getComponent(callback, {callArgs})
  }

  isVisibleElement (element) {
    const style = window.getComputedStyle(element)
    return (
      Boolean(style) &&
      (typeof style.opacity === 'undefined' || style.opacity !== 0) &&
      (typeof style.display === 'undefined' || style.display !== 'none') &&
      (typeof style.visibility === 'undefined' || style.visibility !== 'hidden')
    )
  }

  waitLoadMask (callback) {
    return waitForFn(
      (done) => {
        const maskDisplayed = Ext.ComponentManager.getAll()
            .filter((item) => {
              return (item.xtype === 'loadmask' && item.isHidden() === false)
            }).length > 0

        if (maskDisplayed) {
          done('Load mask is still presented.')
        } else {
          // LoadMask need sone time to be hidden
          setTimeout(() => {
            done(null)
          }, 500)
        }
      },
      callback,
      {
        delay: 500 // wait load mask display delay
      }
    )
  }

  waitText (callback, text) {
    // TODO check parent
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
