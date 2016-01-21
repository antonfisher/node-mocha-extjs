'use strict';

import {Set} from './utils/set.js';
import {Cursor} from './cursor.js';

//TODO class ?
export function Chain () {
    var self = this;
    var _chain = [];
    var _chainRunDelay = 200;
    var _chainComponents = new Set();
    var _chainPresented = false;
    var _chainCallback = function () {
        throw new Error('Chain callback is not defined');
    };

    var _cursor = new Cursor();

    var _createActionFunction = function (actionType, invert) {
        return function (...args) {
            if (_chainPresented) {
                throw new Error('Cannot add an action after the action which calls Mocha test callback.');
            }

            _chain.push({
                actionType: actionType,
                invert: invert,
                args: args
            });

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
            _actions[_chain[index]['actionType']](
                index,
                function (err) {
                    if (err || index + 1 === _chain.length) {
                        return _chainCallback(err ? new Error(err) : null);
                    }

                    setTimeout(function () {
                        callActionByIndex(index + 1);
                    }, _chainRunDelay);
                }
            );
        };

        callActionByIndex(0);
    };

    var _mochaUI = {
        show: function () {
            window.document.getElementById('mocha').style.display = 'block';
            window.document.getElementById('mocha-extjs-testing-tool-pointer').style.display = 'block';
        },
        hide: function () {
            window.document.getElementById('mocha').style.display = 'none';
            window.document.getElementById('mocha-extjs-testing-tool-pointer').style.display = 'none';
        }
    };

    var _waitForFn = function (waitFn, callback, params) {
        params = (params || {});
        params.delay = (typeof params.delay !== 'undefined' ? params.delay : 10);
        params.timeout = (typeof params.timeout !== 'undefined' ? params.timeout : 10 * 1000);

        var _ticInterval = 500;
        var interval;
        var startTimestamp = +(new Date());
        var lastError = '';
        var intervalFn = function () {
            if ((+new Date() - startTimestamp) > params.timeout) {
                clearInterval(interval);
                return callback('Out of time: ' + (params.timeout / 1000) + 's (' + lastError + ')');
            }

            waitFn(function (err, result) {
                if (err) {
                    lastError = err;
                } else {
                    clearInterval(interval);
                    return callback(null, result);
                }
            });
        };

        setTimeout(function () {
            interval = setInterval(intervalFn, _ticInterval);
            intervalFn();
        }, params.delay);
    };


    var _domHelpers = {
        getComponent: function (type, titleOrSelector, callback) {
            var selector = null;
            var component = null;
            var selectors = [];
            var _getVisibleComponents = function (selector) {
                return Ext.ComponentQuery.query(selector).filter(function (c) {
                    if (!c.el || !c.el.dom) {
                        return false;
                    }
                    var r = c.el.dom.getBoundingClientRect();
                    var x = (r.left + r.width / 2);
                    var y = (r.top + r.height / 2);
                    var visible = (window.document.elementsFromPoint(x, y) || []).filter(function (dom) {
                        return (dom === c.el.dom);
                    });

                    return (visible.length > 0);
                });
            };

            if (!type) {
                selector = titleOrSelector;
                _mochaUI.hide();
                component = _getVisibleComponents(selector)[0];
                _mochaUI.show();
            }

            if (!component && type) {
                var titleProperties = [];

                if (type === 'button') {
                    titleProperties = ['text'];
                    selectors = [type + '[text~="' + titleOrSelector + '"]'];
                } else if (type === 'tab' || type === 'window' || type === 'grid') {
                    titleProperties = ['title'];
                    selectors = [type + '[title~="' + titleOrSelector + '"]'];
                } else if (type === 'textfield' || type === 'numberfield' || type === 'combobox') {
                    titleProperties = ['fieldLabel'];
                    selectors = [type + '[fieldLabel~="' + titleOrSelector + '"]'];
                } else if (type === 'checkbox' || type === 'radio') {
                    titleProperties = ['fieldLabel', 'boxLabel'];
                    selectors = [
                        type + '[fieldLabel~="' + titleOrSelector + '"]',
                        type + '[boxLabel~="' + titleOrSelector + '"]'
                    ];
                } else {
                    return callback('Type "' + '" not supported.');
                }

                _mochaUI.hide();
                selectors.every(function (item) {
                    component = _getVisibleComponents(item)[0];
                    return !component;
                });
                _mochaUI.show();

                if (!component) {
                    (Ext.ComponentQuery.query(type) || []).every(function (item) {
                        titleProperties.every(function (prop) {
                            var title = item[prop];
                            var fnName = ('get' + prop[0].toUpperCase() + prop.slice(1));
                            if (fnName && item[fnName] && typeof item[fnName] === 'function') {
                                title = item[fnName].call(item);
                            }
                            if ((new RegExp(titleOrSelector, 'g')).test(title)) {
                                component = item;
                            }
                            return !component;
                        });
                        return !component;
                    });
                }
            }

            if (!component) {
                return callback('Selector "' + (selector || selectors.join(', ')) + '" not found.');
            } else if (!component.el || !component.el.dom) {
                return callback(
                    'No existing HTML element for selector "' + (selector || selectors.join(', ')) + '".'
                );
            }

            //TODO to method
            var rect = component.el.dom.getBoundingClientRect();
            if (rect.left + rect.width < 0 || rect.top + rect.height < 0) {
                return callback(
                    'No visible HTML element for selector "' + selector + '", offset: '
                    + rect.left + ',' + rect.top + ', size: ' + rect.width + ',' + rect.height + '.'
                );
            }

            return callback(null, component);
        },
        clickOnElement: function (el, callback) {
            var err;

            // for PhantomJs:
            //  ./node_modules/mocha-phantomjs/node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js:116
            // add "page.sendEvent.apply(this, data.sendEvent);"
            //
            var rect = el.getBoundingClientRect();
            var x = (rect.left + rect.width / 2);
            var y = (rect.top + rect.height / 2);

            _cursor.moveTo(x + 1, y + 1, function () {
                _mochaUI.hide();

                if (el.focus) {
                    el.focus();
                }

                if (el.scrollIntoView) {
                    el.scrollIntoView();
                }

                if (window.callPhantom) {
                    err = !window.callPhantom({
                        sendEvent: ['click', x, y]
                    });
                } else {
                    try {
                        window.document.elementFromPoint(x, y).click();
                        err = false;
                    } catch (e) {
                        err = ('[' + x + ',' + y + '] (' + e + ')');
                    }
                }

                _mochaUI.show();

                if (err) {
                    return callback('cannot click on "' + el.id + '" ' + err);
                } else {
                    return callback(null);
                }
            });
        },
        clickOnComponent: function (componentObject, callback) {
            var el = (
                (componentObject.component.inputEl && componentObject.component.inputEl.dom)
                || componentObject.component.el.dom
            );

            _domHelpers.clickOnElement(el, function (err) {
                if (err) {
                    return callback(
                        'cannot click on ' + componentObject.type + ' "' + componentObject.selector + '" '
                        + err
                    );
                } else {
                    return callback(null);
                }
            });
        },
        fillComponent: function (componentObject, value, callback) {
            _domHelpers.clickOnComponent(componentObject, function (err) {
                if (!err) {
                    try {
                        componentObject.component.setValue(value);
                        err = false;
                    } catch (e) {
                        err = 'failed to call setValue() method';
                    }
                }

                if (err) {
                    return callback(
                        'cannot fill ' + componentObject.type + ' "' + componentObject.selector + '" '
                        + err
                    );
                } else {
                    return callback(null);
                }
            });
        },
        select: function (componentObject, rowIndex, callback) {
            var el = null;

            if (componentObject.actionType === 'combobox') {
                // combobox
                _domHelpers.clickOnComponent(componentObject, function (err) {
                    if (err) {
                        return callback(
                            'cannot select ' + componentObject.type + ' row "'
                            + componentObject.selector + '" ' + err
                        );
                    }

                    if (!componentObject.component.picker || !componentObject.component.picker.id) {
                        return callback(
                            'cannot find picker for ' + componentObject.type + ' "'
                            + componentObject.selector + '" ' + err
                        );
                    }

                    try {
                        el = document
                            .getElementById(componentObject.component.picker.el.id)
                            .getElementsByClassName('x-boundlist-item')[rowIndex];
                    } catch (e) {
                        return callback('Failed to get element of combobox row #' + rowIndex + ' element.');
                    }

                    _domHelpers.clickOnElement(el, function (err) {
                        if (err) {
                            return callback(
                                'cannot select ' + componentObject.type + ' row "'
                                + componentObject.selector + '" ' + err
                            );
                        } else {
                            try {
                                el = document
                                    .getElementById(componentObject.component.picker.id)
                                    .getElementsByClassName('x-boundlist-item')[rowIndex];
                            } catch (e) {
                                return callback('Failed to click on combobox row #' + rowIndex + ' element.');
                            }

                            return callback(null);
                        }
                    });
                });
            } else {
                // grid
                try {
                    el = document
                        .getElementById(componentObject.component.el.id)
                        .getElementsByClassName('x-grid-item')[rowIndex];
                } catch (e) {
                    return callback('Failed to get element of grid row #' + rowIndex + ' element.');
                }

                _domHelpers.clickOnElement(el, function (err) {
                    if (err) {
                        return callback(
                            'cannot select ' + componentObject.type + ' row "' + componentObject.selector + '" '
                            + err
                        );
                    } else {
                        return callback(null);
                    }
                });
            }
        },
        checkState: function (componentObject, stateFnName, expectedValue, callback) {
            if (!componentObject.component[stateFnName]) {
                callback(
                    componentObject.type + ' "' + componentObject.selector + '" does not have function "'
                    + stateFnName + '"'
                );
            }

            var result = componentObject.component[stateFnName]();

            if (result === expectedValue) {
                return callback(null);
            } else {
                return callback(
                    'state of ' + componentObject.type + ' "' + componentObject.selector + '": function "'
                    + stateFnName + '" expected to be "' + expectedValue + '" instead of "' + result + '"'
                );
            }
        }
    };

    var _createComponentWaitFunction = function (type) {
        return function (index, callback) {
            var args = _chain[index]['args'];
            var invert = _chain[index]['invert'];
            var titleOrSelector = args[0];

            _waitForFn(
                function (done) {
                    _domHelpers.getComponent(type, titleOrSelector, function (err, result) {
                        if (invert) {
                            var message = (
                                'Component ' + type + ' "' + titleOrSelector + '" still presented.'
                            );
                            return done(err ? null : message);
                        } else {
                            return done(err, result);
                        }
                    });
                },
                function (err, component) {
                    if (component) {
                        _chainComponents.push({
                            actionType: type,
                            selector: titleOrSelector,
                            component: component
                        });
                    }

                    callback(err);
                }
            );
        }
    };

    var _actions = {
        tab: _createComponentWaitFunction('tab'),
        grid: _createComponentWaitFunction('grid'),
        radio: _createComponentWaitFunction('radio'),
        button: _createComponentWaitFunction('button'),
        window: _createComponentWaitFunction('window'),
        checkbox: _createComponentWaitFunction('checkbox'),
        combobox: _createComponentWaitFunction('combobox'),
        textfield: _createComponentWaitFunction('textfield'),
        numberfield: _createComponentWaitFunction('numberfield'),
        click: function (index, callback) {
            var componentObject = _chainComponents.last();

            if (!componentObject) {
                return callback('No click target.');
            }

            _domHelpers.clickOnComponent(componentObject, callback);
        },
        fill: function (index, callback) {
            var componentObject = _chainComponents.last();
            var args = _chain[index]['args'];

            if (!componentObject) {
                return callback('No fill target.');
            }

            _domHelpers.fillComponent(componentObject, args[0], callback);
        },
        select: function (index, callback) {
            var componentObject = _chainComponents.last();
            var args = _chain[index]['args'];

            if (!componentObject) {
                return callback('No target grid.');
            }

            _domHelpers.select(componentObject, args[0], callback);
        },
        checkRowsCount: function (index, callback) {
            var componentObject = _chainComponents.last();
            var args = _chain[index]['args'];

            if (!componentObject) {
                return callback('No target grid.');
            }

            if (!componentObject.component.getStore || !componentObject.component.getStore()) {
                return callback('No store binded to grid.');
            }

            var count = componentObject.component.getStore().getCount();
            var countExpected = args[0];

            if (count === countExpected) {
                return callback(null);
            } else {
                return callback(
                    componentObject.type + ' "' + componentObject.selector
                    + '": count of rows expected to be equal "' + countExpected
                    + '" instead of "' + count + '"'
                );
            }
        },
        isEnabled: function (index, callback) {
            var componentObject = _chainComponents.last();

            if (!componentObject) {
                return callback('No target for "isEnabled" check.');
            }

            _waitForFn(
                function (done) {
                    _domHelpers.checkState(componentObject, 'isDisabled', false, done);
                },
                callback
            );
        },
        isDisabled: function (index, callback) {
            var componentObject = _chainComponents.last();

            if (!componentObject) {
                return callback('No target for "isDisabled" check.');
            }

            _waitForFn(
                function (done) {
                    _domHelpers.checkState(componentObject, 'isDisabled', true, done);
                },
                callback
            );
        },
        isVisible: function (index, callback) {
            var componentObject = _chainComponents.last();

            if (!componentObject) {
                return callback('No target for "isVisible" check.');
            }

            _waitForFn(
                function (done) {
                    _domHelpers.checkState(componentObject, 'isHidden', false, done);
                },
                callback
            );
        },
        isHidden: function (index, callback) {
            var componentObject = _chainComponents.last();

            if (!componentObject) {
                return callback('No target for "isHidden" check.');
            }

            _waitForFn(
                function (done) {
                    _domHelpers.checkState(componentObject, 'isHidden', true, done);
                },
                callback
            );
        },
        waitLoadMask: function (index, callback) {
            // wait load mask display delay
            setTimeout(function () {
                _waitForFn(
                    function (done) {
                        //TODO improve this method
                        var maskDisplayed = (window.document.getElementsByClassName('x-mask-msg').length > 0);

                        if (maskDisplayed) {
                            done(true);
                        } else {
                            done(null);
                        }
                    },
                    callback
                );
            }, 500);
        },
        waitText: function (index, callback) {
            //TODO check parent

            var args = _chain[index]['args'];
            var text = args[0];

            _waitForFn(
                function (done) {
                    var textPresented = false;

                    if (text instanceof RegExp) {
                        textPresented = text.test(window.document.body.innerText);
                    } else if (window.find) {
                        textPresented = window.find(text, true, true, true); // arg aWholeWord - Unimplemented
                    } else {
                        textPresented = (new RegExp(text, 'g')).test(window.document.body.innerText);
                    }

                    if (textPresented) {
                        done(null);
                    } else {
                        done('Text pattern "' + text + '" not found');
                    }
                },
                callback
            );
        }
    };

    // find component
    self.tab = _createActionFunction('tab');
    self.grid = _createActionFunction('grid');
    self.radio = _createActionFunction('radio');
    self.button = _createActionFunction('button');
    self.window = _createActionFunction('window');
    self.checkbox = _createActionFunction('checkbox');
    self.combobox = _createActionFunction('combobox');
    self.textfield = _createActionFunction('textfield');
    self.numberfield = _createActionFunction('numberfield');

    // no component expected
    self.no = {
        tab: _createActionFunction('tab', true),
        grid: _createActionFunction('grid', true),
        radio: _createActionFunction('radio', true),
        button: _createActionFunction('button', true),
        window: _createActionFunction('window', true),
        checkbox: _createActionFunction('checkbox', true),
        combobox: _createActionFunction('combobox', true),
        textfield: _createActionFunction('textfield', true),
        numberfield: _createActionFunction('numberfield', true)
    };

    // component actions
    self.fill = _createActionFunction('fill');
    self.click = _createActionFunction('click');
    self.select = _createActionFunction('select');
    self.isEnabled = _createActionFunction('isEnabled');
    self.isDisabled = _createActionFunction('isDisabled');
    self.isHidden = _createActionFunction('isHidden');
    self.isVisible = _createActionFunction('isVisible');
    self.checkRowsCount = _createActionFunction('checkRowsCount');

    // wait methods
    self.waitText = _createActionFunction('waitText');
    self.waitLoadMask = _createActionFunction('waitLoadMask');

    return self;
}
