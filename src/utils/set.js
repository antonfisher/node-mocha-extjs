'use strict'

export class Set {

  constructor () {
    this._items = []
  }

  push (component) {
    this._items.push(component)
  }

  * items () {
    for (let item of this._items) {
      yield item
    }
  }

  * reversedItems () {
    for (let i = this._items.length - 1; i >= 0; i--) {
      yield this._items[i]
    }
  }

}
