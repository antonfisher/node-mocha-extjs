'use strict';

import {ChainItem} from './item.js';
import {waitForFn} from '../utils/utils.js';

export class ChainActionItem extends ChainItem {

    run (callback) {
        var self = this;

        return waitForFn(
            (done) => {
                self.chain.driver[self.type](done, ...self.callArgs);
            },
            callback
        );
    }

}
