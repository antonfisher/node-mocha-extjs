'use strict';

import {Set} from './utils/set.js';
import {ChainActionItem} from './chain/actionItem.js';
import {ChainComponentItem} from './chain/componentItem.js';

export class Chain {

    constructor ({driver, cursor}) {
        var self = this;

        var _chain = [];
        var _chainRunDelay = 200;
        var _chainPresented = false;
        var _chainCallback = function () {
            throw new Error('Chain callback is not defined');
        };

        var componentsList = [
            'tab', 'grid', 'radio', 'button', 'window', 'checkbox', 'combobox', 'textfield', 'numberfield'
        ];

        self._chainComponents = new Set();
        self._driver = driver;

        var _createActionFunction = function (actionType, invert) {
            return function (...args) {
                if (_chainPresented) {
                    throw new Error('Cannot add an action after the action which calls Mocha test callback.');
                }

                if (componentsList.includes(actionType)) {
                    _chain.push(new ChainComponentItem({
                        type: actionType,
                        chain: _chain,
                        invert: invert,
                        callArgs: args,
                        driver: self._driver
                    }));
                } else {
                    _chain.push(new ChainActionItem({
                        type: actionType,
                        chain: _chain,
                        invert: invert,
                        callArgs: args,
                        driver: self._driver
                    }));
                }

                for (var i = 0; i < args.length; i++) {
                    if (typeof args[i] === 'function') {
                        _chainCallback = args[i];
                        _chainPresented = true;
                        _createActionFunction = function () {
                            throw new Error('Call _addChain() after run.');
                        };
                        _run();
                        break;
                    }
                }

                return self;
            };
        };

        var _run = function () {
            var callActionByIndex = function (index) {
                _chain[index].run((err) => {
                    if (err || index + 1 === _chain.length) {
                        return _chainCallback(err ? new Error(err) : null);
                    }

                    setTimeout(function () {
                        callActionByIndex(index + 1);
                    }, _chainRunDelay);
                });
            };

            callActionByIndex(0);
        };

        self.no = {};

        // entrance actions
        for (let component of componentsList) {
            self[component] = _createActionFunction(component);
            self.no[component] = _createActionFunction(component, true);
        }

        self.waitText = _createActionFunction('waitText');
        self.waitLoadMask = _createActionFunction('waitLoadMask');

        // component actions
        self.fill = _createActionFunction('fill');
        self.click = _createActionFunction('click');
        self.select = _createActionFunction('select');
        self.isEnabled = _createActionFunction('isEnabled');
        self.isDisabled = _createActionFunction('isDisabled');
        self.isHidden = _createActionFunction('isHidden');
        self.isVisible = _createActionFunction('isVisible');
        self.checkRowsCount = _createActionFunction('checkRowsCount');

        return self;
    }

}
