'use strict';

export class Set {

    constructor () {
        this._items = [];
    }

    push (component) {
        this._items.push(component);
    }

    last () {
        return ((this._items.length > 0) ? this._items[this._items.length - 1] : null);
    }

}
