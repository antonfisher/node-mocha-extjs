'use strict'

import 'babel-polyfill'

import {Chain} from './src/chain.js'
import {MochaUI} from './src/mochaUI.js'
import {ExtJsDriver} from './src/drivers/extjs/driver.js'

export class MochaExtJs {

  constructor ({driver} = {driver: new ExtJsDriver({mochaUi: new MochaUI()})}) {
    return function () {
      return new Chain({driver})
    }
  }

  static screenshot (path = '/tmp/') {
    if (window.callPhantom) {
      const filename = (path + (new Date()).getTime())
      console.log('Taking screenshot: ' + filename)
      window.callPhantom({'screenshot': filename})
    }
  }

}

// browserify
if (window) {
  window.MochaExtJs = MochaExtJs
}
