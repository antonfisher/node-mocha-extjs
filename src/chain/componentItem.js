'use strict'

import {ChainItem} from './item.js'
import {waitForFn} from '../utils/utils.js'

export class ChainComponentItem extends ChainItem {

  constructor (...args) {
    super(...args)

    this.component = null
  }

  run (callback) {
    const type = this.type
    const chain = this.chain
    const callArgs = this.callArgs

    return waitForFn(
      (done) => {
        this.chain.driver.getComponent(
          (err, result) => {
            if (this.invert) {
              return done(err ? null : `Component ${this.type} "${this.callArgs[0]}" still presented.`)
            } else {
              return done(err, result)
            }
          },
          {type, callArgs, chain}
        )
      },
      (err, component) => {
        this.component = component
        return callback(err)
      }
    )
  }

}
