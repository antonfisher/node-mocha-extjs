'use strict';

import {Set} from './utils/set.js';
import {ChainActionItem} from './chain/actionItem.js';
import {ChainComponentItem} from './chain/componentItem.js';
import {ChainComponentActionItem} from './chain/componentActionItem.js';

export class Chain {

    constructor ({driver, itemsRunDelay = 200}) {
        var self = this;

        self._itemsSet = new Set();

        self._chainRunned = false;
        self._chainCallback = function () {
            throw new Error('Chain callback is not presented.');
        };

        self.driver = driver;
        self.itemsRunDelay = itemsRunDelay;
        self.no = {};

        // entrance actions

        for (let component of driver.supportedComponents) {
            self[component] = self.createActionFunction(component);
            self.no[component] = self.createActionFunction(component, true);
        }

        for (let action of driver.supportedComponentActions) {
            self[action] = self.createActionFunction(action);
        }

        for (let action of driver.supportedActions) {
            self[action] = self.createActionFunction(action);
        }

        return self;
    }

    createActionFunction (actionType, invert) {
        var self = this;

        return function (...args) {
            if (self._chainRunned) {
                throw new Error('Cannot add an action after the action which calls Mocha test callback.');
            }

            var chainProperties = {
                type: actionType,
                chain: self,
                invert: invert,
                callArgs: args
            };

            if (self.driver.supportedComponents.includes(actionType)) {
                self._itemsSet.push(new ChainComponentItem(chainProperties));
            } else if (self.driver.supportedComponentActions.includes(actionType)) {
                self._itemsSet.push(new ChainComponentActionItem(chainProperties));
            } else if (self.driver.supportedActions.includes(actionType)) {
                self._itemsSet.push(new ChainActionItem(chainProperties));
            }

            for (let arg of args) {
                if (typeof arg === 'function') {
                    self._chainRunned = true;
                    self._chainCallback = arg;
                    self.run();
                    break;
                }
            }

            return self;
        };
    }

    run () {
        var self = this;
        var itemsGenerator = self._itemsSet.items();

        var runNextAction = function () {
            var item = itemsGenerator.next();

            if (item.done) {
                return self._chainCallback(null);
            } else {
                return item.value.run((err) => {
                    if (err) {
                        return self._chainCallback(new Error(err));
                    }

                    setTimeout(function () {
                        runNextAction();
                    }, self.chainRunDelay);
                });
            }
        };

        runNextAction();
    }

    get lastComponent () {
        var self = this;

        for (let item of self._itemsSet.reversedItems()) {
            if (item.component) {
                return item.component;
                break;
            }
        }

        return null;
    }

}
