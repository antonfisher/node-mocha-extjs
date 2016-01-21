'use strict';

import {Chain} from './src/chain.js';

window.MochaExtJs = function () {
    var _createChain = function (initActionType, invert) {
        return function () {
            var chain = new Chain(initActionType);
            var action = (invert ? chain.no[initActionType] : chain[initActionType]);
            return action.apply(chain, Array.prototype.slice.call(arguments, 0));
        }
    };

    // entrance actions
    return {
        tab: _createChain('tab'),
        grid: _createChain('grid'),
        radio: _createChain('radio'),
        button: _createChain('button'),
        window: _createChain('window'),
        checkbox: _createChain('checkbox'),
        combobox: _createChain('combobox'),
        textfield: _createChain('textfield'),
        numberfield: _createChain('numberfield'),
        waitText: _createChain('waitText'),
        waitLoadMask: _createChain('waitLoadMask'),
        no: {
            tab: _createChain('window', true),
            grid: _createChain('grid', true),
            radio: _createChain('radio', true),
            window: _createChain('window', true),
            button: _createChain('button', true),
            checkbox: _createChain('checkbox', true),
            combobox: _createChain('combobox', true),
            textfield: _createChain('textfield', true),
            numberfield: _createChain('numberfield', true)
        }
    };
};
