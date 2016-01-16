(function () {
    var Set = function () {
        var _items = [];

        return {
            push: function (component) {
                _items.push(component);
            },
            last: function () {
                return ((_items.length > 0) ? _items[_items.length - 1] : null);
            }
        };
    };

    var Cursor = function () {
        var self = this;
        var _size = 14;
        var _timeout = 400;
        var _initTransition = ('all ' + _timeout + 'ms ease-in-out');
        var _position = {
            x: 0,
            y: 0
        };

        var _point = window.document.getElementById('mocha-extjs-testing-tool-pointer');

        if (!_point) {
            _point = document.createElement('div');

            _point.id = 'mocha-extjs-testing-tool-pointer';
            _point.style.top = (_position.y + 'px');
            _point.style.left = (_position.x + 'px');
            _point.style.width = (_size + 'px');
            _point.style.zIndex = '90000';
            _point.style.height = (_size + 'px');
            _point.style.border = '2px solid #ffffff';
            _point.style.position = 'absolute';
            _point.style.opacity = '1';
            _point.style.transition = _initTransition;
            _point.style.borderRadius = ('0 ' + ((_size / 2) + 'px ') + ((_size / 2) + 'px ') + ((_size / 2) + 'px'));
            _point.style.backgroundColor = '#ee3333';

            window.document.body.appendChild(_point);
        }

        self.moveTo = function (x, y, callback) {
            var translate = ('translate(' + x + 'px,' + y + 'px)');

            _point.style.transform = translate;

            setTimeout(function () {
                _point.style.transition = ('all 50ms ease-in-out');
                _point.style.transform = (translate + ' scale(0.5)');
                setTimeout(function () {
                    _point.style.transform = (translate + ' scale(1)');
                    setTimeout(function () {
                        _point.style.transition = _initTransition;
                        callback(null);
                    }, 50);
                }, 50);
            }, _timeout);
        };

        return self;
    };

    var Chain = function () {
        var self = this;
        var _chain = [];
        var _chainRunDelay = 200;
        var _chainComponents = new Set();
        var _chainPresented = false;
        var _chainCallback = function () {
            throw new Error('Chain callback is not defined');
        };
        var _cursor = new Cursor();

        var _createActionFunction = function (actionType) {
            return function () {
                var args = Array.prototype.slice.call(arguments, 0);

                if (_chainPresented) {
                    throw new Error('Cannot add an action after the action which calls Mocha test callback.');
                }

                _chain.push({
                    actionType: actionType,
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
                            _chainCallback(err ? new Error(err) : null);
                            return;
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
            },
            hide: function () {
                window.document.getElementById('mocha').style.display = 'none';
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
                    callback('Out of time: ' + (params.timeout / 1000) + 's (' + lastError + ')');
                    return;
                }

                waitFn(function (err, result) {
                    if (err) {
                        lastError = err;
                    } else {
                        clearInterval(interval);
                        callback(null, result);
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

                if (!type) {
                    selector = titleOrSelector;
                    component = Ext.ComponentQuery.query(selector)[0];
                }

                if (!component && type) {
                    var titleFn = null;
                    selector = type;

                    if (type === 'button') {
                        titleFn = 'getText';
                        selector += ('[text~="' + titleOrSelector + '"]');
                    } else if (type === 'tab' || type === 'window') {
                        titleFn = 'getTitle';
                        selector += ('[title~="' + titleOrSelector + '"]');
                    } else {
                        return callback('Type "' + '" not supported.');
                    }

                    component = Ext.ComponentQuery.query(selector)[0];

                    if (!component) {
                        var components = (Ext.ComponentQuery.query(type) || []);
                        for (var i = 0; i < components.length; i++) {
                            if ((new RegExp(titleOrSelector, 'g')).test(components[i][titleFn]())) {
                                component = components[i];
                                break;
                            }
                        }
                    }
                }

                if (!component) {
                    return callback('Selector "' + selector + '" not found.');
                } else if (!component.el || !component.el.dom) {
                    return callback('No existing HTML element for selector "' + selector + '".');
                }

                var rect = component.el.dom.getBoundingClientRect();
                if (rect.left + rect.width < 0 || rect.top + rect.height < 0) {
                    return callback(
                        'No visible HTML element for selector "' + selector + '", offset: '
                        + rect.left + ',' + rect.top + ', size: ' + rect.width + ',' + rect.height + '.'
                    );
                }

                return callback(null, component);
            },
            clickOnComponent: function (componentObject, callback) {
                var err;
                var el = componentObject.component.el.dom;

                // for PhantomJs:
                //  ./node_modules/mocha-phantomjs/node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js:116
                // add "page.sendEvent.apply(this, data.sendEvent);"
                //
                var rect = el.getBoundingClientRect();
                var x = (rect.left + rect.width / 2);
                var y = (rect.top + rect.height / 2);

                _cursor.moveTo(x + 1, y + 1, function () {
                    _mochaUI.hide();

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
                        callback(
                            'cannot click on ' + componentObject.type + ' "' + componentObject.selector + '" ' + err
                        );
                    } else {
                        callback(null);
                    }
                });
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
                    callback(null);
                } else {
                    callback(
                        'state of ' + componentObject.type + ' "' + componentObject.selector + '": function "'
                        + stateFnName + '" expected to be "' + expectedValue + '" instead of "' + result + '"'
                    );
                }
            }
        };

        var _createComponentWaitFunction = function (type) {
            return function (index, callback) {
                var args = _chain[index]['args'];
                var titleOrSelector = args[0];

                _waitForFn(
                    function (done) {
                        _domHelpers.getComponent(type, titleOrSelector, done);
                    },
                    function (err, component) {
                        if (component) {
                            _chainComponents.push({
                                type: type,
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
            button: _createComponentWaitFunction('button'),
            window: _createComponentWaitFunction('window'),
            //noWindow: _createComponentWaitFunction('window', true),
            click: function (index, callback) {
                var componentObject = _chainComponents.last();

                if (!componentObject) {
                    callback('No click target.');
                }

                _domHelpers.clickOnComponent(componentObject, callback);
            },
            isEnabled: function (index, callback) {
                var componentObject = _chainComponents.last();

                if (!componentObject) {
                    callback('No target for "isEnabled" check.');
                    return;
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
                    callback('No target for "isEnabled" check.');
                    return;
                }

                _waitForFn(
                    function (done) {
                        _domHelpers.checkState(componentObject, 'isDisabled', true, done);
                    },
                    callback
                );
            }
        };

        // find component
        self.tab = _createActionFunction('tab');
        self.button = _createActionFunction('button');
        self.window = _createActionFunction('window');

        // no component expected
        //self.noWindow = _createActionFunction('window');

        // component actions
        self.click = _createActionFunction('click');
        self.isEnabled = _createActionFunction('isEnabled');
        self.isDisabled = _createActionFunction('isDisabled');

        //TODO
        // fill
        // select grid row
        // check grid rows count
        // wait load mask
        // text presented
        // hidden

        return self;
    };

    var _createChain = function (initActionType) {
        return function () {
            var chain = new Chain(initActionType);
            return chain[initActionType].apply(chain, Array.prototype.slice.call(arguments, 0));
        }
    };

    window.extJsTT = {
        tab: _createChain('tab'),
        button: _createChain('button'),
        window: _createChain('window'),
        //noWindow: _createChain('noWindow')
    };
})();
