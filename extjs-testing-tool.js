(function () {
    var Chain = function () {
        var self = this;
        var _chain = [];

        var _addAction = function (actionType) {
            return function () {
                var args = Array.prototype.slice.call(arguments, 0);
                console.log('-- add to chain', actionType);
                _chain.push({
                    actionType: actionType,
                    args: args
                });
                if (typeof args[0] === 'function') {
                    _run();
                    _addAction = function () {
                        throw 'Call _addChain() after run.';
                    }
                }
                return self;
            };
        };

        var _run = function () {
            var callActionByIndex = function (index) {
                console.log('-- callAction', index, _chain[index]['actionType']);
                _actions[_chain[index]['actionType']](
                    index,
                    function (err) {
                        console.log('-- action callback', arguments);
                        if (err) {
                            _chain[_chain - 1]['args'][0].apply(_chain, [null]);
                            return;
                        }

                        if (index + 1 === _chain.length) {
                            _chain[index]['args'][0].apply(_chain, [null]);
                        } else if (index + 1 < _chain.length) {
                            callActionByIndex(index + 1);
                        }
                    }
                );
            };

            callActionByIndex(0);
        };

        var _actions = {
            button: function (index, callback) {
                var args = _chain[index]['args'];
                console.log('-- action BUTTON', args);
                callback(null);
            },
            click: function (index, callback) {
                var args = _chain[index]['args'];
                console.log('-- action CLICK', args);
                callback(null);
            }
        };

        // add init action and return object
        return {
            button: _addAction('button'),
            click: _addAction('click')
        };
    };

    var _createChain = function (initActionType) {
        return function () {
            var chain = new Chain(initActionType);
            chain[initActionType].apply(chain, Array.prototype.slice.call(arguments, 0));
            return chain;
        }
    };

    window.extJsTT = {
        button: _createChain('button')
    };
})();
