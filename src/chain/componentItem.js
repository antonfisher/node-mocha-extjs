'use strict';

import {ChainItem} from './item.js';
import {waitForFn} from '../utils/utils.js';

export class ChainComponentItem extends ChainItem {

    constructor (...args) {
        super(...args);

        this.component = null;
    }

    run (callback) {
        var self = this;
        var titleOrSelector = self.callArgs[0];

        return waitForFn(
            (done) => {
                self.chain.driver.getComponent(self.type, titleOrSelector, (err, result) => {
                    if (self.invert) {
                        let message = `Component ${self.type} "${titleOrSelector}" still presented.`;
                        return done(err ? null : message);
                    } else {
                        return done(err, result);
                    }
                });
            },
            (err, component) => {
                self.component = component;
                return callback(err);
            }
        );
    }

}
