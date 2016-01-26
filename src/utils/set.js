'use strict'

export class Set {

  constructor () {
    this._items = []
  }

  push (component) {
    this._items.push(component)
  }

  * items () {
    var self = this

    for (let item of self._items) {
      yield item
    }
  }

  * reversedItems () {
    var self = this

    for (var i = self._items.length - 1; i >= 0; i--) {
      yield self._items[i]
    }
  }

}
