'use strict';

import {ChainItem} from './item.js';
import {waitForFn} from '../utils/utils.js';

export class ChainComponentActionItem extends ChainItem {

    run (callback) {
        var self = this;
        var lastComponent = self.chain.lastComponent;

        if (!lastComponent) {
            return callback(`No "${self.type}" action target.`);
        }

        var action = lastComponent[self.type];

        if (!action) {
            return callback(
                `Component "${lastComponent.constructor.name.replace(/.*Component/, '').toLowerCase()}" `
                + `does not support action "${self.type}".`
            );
        }

        return waitForFn(
            (done) => {
                lastComponent[self.type](done, ...self.callArgs);
            },
            callback
        );
    }

}
