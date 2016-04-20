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

  screenshot () {
    if (window.callPhantom) {
      var filename = ('/tmp/' + (new Date()).getTime())
      console.log('Taking screenshot: ' + filename)
      window.callPhantom({'screenshot': filename})
    }
  }

}

// browserify
if (window) {
  window.MochaExtJs = MochaExtJs
}
