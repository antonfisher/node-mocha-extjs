'use strict'

export class ChainItem {

  constructor ({chain, type, invert = false, callArgs = []}) {
    var self = this

    if (!chain) {
      throw new Error(`Class ${self.constructor.name} created with undefined property "chain".`)
    }

    if (!type) {
      throw new Error(`Class ${self.constructor.name} created with undefined property "type".`)
    }

    self.type = type
    self.chain = chain
    self.invert = invert
    self.callArgs = callArgs
  }

  run () {
    console.error(`called on implemented method: ${this.constructor.name}.run()`)
  }

}
