'use strict'

export class ChainItem {

  constructor ({chain, type, invert = false, callArgs = []}) {
    if (!chain) {
      throw new Error(`Class ${this.constructor.name} created with undefined property "chain".`)
    }

    if (!type) {
      throw new Error(`Class ${this.constructor.name} created with undefined property "type".`)
    }

    this.type = type
    this.chain = chain
    this.invert = invert
    this.callArgs = callArgs
  }

  run () {
    console.error(`called on implemented method: ${this.constructor.name}.run()`)
  }

}
