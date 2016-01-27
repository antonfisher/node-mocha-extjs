'use strict'

import 'babel-polyfill'

import {Chain} from './src/chain.js'
import {MochaUI} from './src/mochaUI.js'
import {ExtJsDriver} from './src/drivers/extjs/driver.js'

export class MochaExtJs {

  constructor ({driver: driver} = {driver: new ExtJsDriver({mochaUi: new MochaUI()})}) {
    return function () {
      return new Chain({
        driver: driver
      })
    }
  }

}

if (window) {
  window.MochaExtJs = MochaExtJs
}
