'use strict';

import {ChainItem} from './item.js';
import {waitForFn} from '../utils/utils.js';

export class ChainActionItem extends ChainItem {

    run (callback) {
        var self = this;

        if (self.driver[self.type]) {
            // call driver action
            return waitForFn(
                function (done) {
                    self.driver[self.type](done, ...self._callArgs);
                },
                callback
            );
        } else {
            // call component action
            var lastComponent = self.getLastComponent();

            if (!lastComponent) {
                return callback(`No "${self._type}" action target.`);
            }

            var action = lastComponent[self._type];

            if (!action) {
                return callback(
                    `Component "${lastComponent.constructor.name.replace(/.*Component/, '').toLowerCase()}" `
                    + `does not support action "${self._type}".`
                );
            }

            return waitForFn(
                function (done) {
                    lastComponent[self._type](done, ...self._callArgs);
                },
                callback
            );
        }

    }

}
