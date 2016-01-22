'use strict';

import {ChainItem} from './item.js';
import {waitForFn} from '../utils/utils.js';

export class ChainComponentItem extends ChainItem {

    constructor (...args) {
        super(...args);

        this._component = null;
    }

    get component () {
        return this._component;
    }

    run (callback) {
        var self = this;
        var titleOrSelector = self._callArgs[0];

        waitForFn(
            function (done) {
                self.driver.getComponent(self._type, titleOrSelector, function (err, result) {
                    if (self._invert) {
                        var message = (
                            'Component ' + self._type + ' "' + titleOrSelector + '" still presented.'
                        );
                        return done(err ? null : message);
                    } else {
                        return done(err, result);
                    }
                });
            },
            function (err, component) {
                if (component) {
                    self._component = component;
                }

                callback(err);
            }
        );
    }

}
