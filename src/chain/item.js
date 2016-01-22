'use strict';

export class ChainItem {

    constructor ({chain, type, driver, invert = false, callArgs = []}) {
        var self = this;

        if (!chain) {
            throw new Error(`Class ${self.constructor.name} created with undefined property "chain".`);
        }

        if (!type) {
            throw new Error(`Class ${self.constructor.name} created with undefined property "type".`);
        }

        if (!driver) {
            throw new Error(`Class ${self.constructor.name} created with undefined property "driver".`);
        }

        self._invert = invert;
        self._chain = chain;
        self._driver = driver;
        self._type = type;
        self._callArgs = callArgs;
    }

    get type () {
        return this._type;
    }

    get driver () {
        return this._driver;
    }

    run () {
        console.error(`called on implemented method: ${this.constructor.name}.run()`);
    }

    //TODO move to Set
    getLastComponent () {
        for (var i = this._chain.length - 1; i >= 0; i--) {
            if (this._chain[i]._component) {
                return this._chain[i]._component;
                break;
            }
        }
        return null;
    }

}
