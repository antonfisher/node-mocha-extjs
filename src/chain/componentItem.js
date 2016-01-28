'use strict'

import {ChainItem} from './item.js'
import {waitForFn} from '../utils/utils.js'

export class ChainComponentItem extends ChainItem {

  constructor (...args) {
    super(...args)

    this.component = null
  }

  run (callback) {
    const titleOrSelector = this.callArgs[0]

    return waitForFn(
      (done) => {
        this.chain.driver.getComponent(this.type, titleOrSelector, (err, result) => {
          if (this.invert) {
            return done(err ? null : `Component ${this.type} "${titleOrSelector}" still presented.`)
          } else {
            return done(err, result)
          }
        })
      },
      (err, component) => {
        this.component = component
        return callback(err)
      }
    )
  }

}
