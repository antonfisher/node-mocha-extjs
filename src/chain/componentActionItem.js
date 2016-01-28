'use strict'

import {ChainItem} from './item.js'
import {waitForFn} from '../utils/utils.js'

export class ChainComponentActionItem extends ChainItem {

  run (callback) {
    const lastComponent = this.chain.lastComponent

    if (!lastComponent) {
      return callback(`No "${this.type}" action target.`)
    }

    const action = lastComponent[this.type]

    if (!action) {
      return callback(
        `Component "${lastComponent.constructor.name.replace(/.*Component/, '').toLowerCase()}" ` +
        `does not support action "${this.type}".`
      )
    }

    return waitForFn(
      (done) => {
        lastComponent[this.type](done, ...this.callArgs)
      },
      callback
    )
  }

}
