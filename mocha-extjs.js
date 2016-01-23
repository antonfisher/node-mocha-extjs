'use strict';

import "babel-polyfill";

import {Chain} from './src/chain.js';
import {Cursor} from './src/cursor.js';
import {ExtJsDriver} from './src/drivers/extjs/driver.js';

export class MochaExtJs {

    constructor ({driver: driver, cursor: cursor} = {driver: new ExtJsDriver({cursor: new Cursor()})}) {

        return function () {
            return new Chain({
                driver: driver
            });
        };
    }

}

if (window) {
    window.MochaExtJs = MochaExtJs;
}
