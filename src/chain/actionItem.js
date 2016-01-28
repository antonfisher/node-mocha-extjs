'use strict'

import {ChainItem} from './item.js'
import {waitForFn} from '../utils/utils.js'

export class ChainActionItem extends ChainItem {

  run (callback) {
    return waitForFn(
      (done) => {
        this.chain.driver[this.type](done, ...this.callArgs)
      },
      callback
    )
  }

}
