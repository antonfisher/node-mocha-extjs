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

    var Chain = function () {
        var self = this;
        var _chain = [];
        var _chainRunDelay = 500;
        var _chainComponents = new Set();
        var _chainCallback = function () {
            throw new Error('Chain callback is not defined');
        };

        var _createActionFunction = function (actionType) {
            return function () {
                var args = Array.prototype.slice.call(arguments, 0);

                _chain.push({
                    actionType: actionType,
                    args: args
                });

                if (typeof args[0] === 'function') {
                    _chainCallback = args[0];
                    _createActionFunction = function () {
                        throw new Error('Call _addChain() after run.');
                    };
                    _run();
                }

                return self;
            };
        };

        var _run = function () {
            var callActionByIndex = function (index) {
                _actions[_chain[index]['actionType']](
                    index,
                    function (err) {
                        if (err) {
                            _chainCallback(new Error(err));
                            return;
                        } else if (index + 1 === _chain.length) {
                            _chainCallback(null);
                        } else if (index + 1 < _chain.length) {
                            setTimeout(function () {
                                callActionByIndex(index + 1);
                            }, _chainRunDelay);
                        }
                    }
                );
            };

            callActionByIndex(0);
        };

        var _domHelpers = {
            getComponent: function (selector, callback) {
                var component = Ext.ComponentQuery.query(selector)[0];

                if (component) {
                    callback(null, component);
                } else {
                    callback('Selector "' + selector+ '" not found.');
                }
            },
            clickOnComponent: function (componentObject, callback) {
                var err;
                var el = componentObject.component.el.dom;
                var rect = el.getBoundingClientRect();

                if (window.callPhantom) {
                    err = !window.callPhantom({
                        sendEvent: ['click', rect.left + rect.width / 2, rect.top + rect.height / 2]
                    });
                } else {
                    try {
                        document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2).click();
                        err = false;
                    } catch (e) {
                        err = true;
                    }
                }

                if (err) {
                    callback('Cannot click on ' + componentObject.type + ' "' + componentObject.selector + '".');
                } else {
                    callback(null);
                }
            }
        };

        var _actions = {
            button: function (index, callback) {
                var args = _chain[index]['args'];
                var selector = args[0];

                _domHelpers.getComponent('button[text~="' + selector + '"]', function (err, component) {
                    if (component) {
                        _chainComponents.push({
                            type: 'button',
                            selector: selector,
                            component: component
                        });
                    }

                    callback(err);
                });
            },
            click: function (index, callback) {
                var componentObject = _chainComponents.last();

                if (!componentObject) {
                    callback('No click target.');
                }

                _domHelpers.clickOnComponent(componentObject, callback);
            }
        };

        // add actions
        self.button = _createActionFunction('button');
        self.click = _createActionFunction('click');

        return self;
    };

    var _createChain = function (initActionType) {
        return function () {
            var chain = new Chain(initActionType);
            return chain[initActionType].apply(chain, Array.prototype.slice.call(arguments, 0));
        }
    };

    window.extJsTT = {
        button: _createChain('button')
    };
})();
