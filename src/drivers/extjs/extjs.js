'use strict';

//TODO remove this dependency
import {MochaUI} from '../../utils/mochaUI.js';

import {waitForFn} from '../../utils/utils.js';

import {ExtJsComponentTab} from './components/tab.js';
import {ExtJsComponentGrid} from './components/grid.js';
import {ExtJsComponentRadio} from './components/radio.js';
import {ExtJsComponentButton} from './components/button.js';
import {ExtJsComponentWindow} from './components/window.js';
import {ExtJsComponentCheckBox} from './components/checkBox.js';
import {ExtJsComponentComboBox} from './components/comboBox.js';
import {ExtJsComponentTextField} from './components/textField.js';
import {ExtJsComponentNumberField} from './components/numberField.js';

export class ExtJsDriver {

    getComponent (type, titleOrSelector, callback) {
        var self = this;
        var selector = null;
        var extJsComponent = null;
        var selectors = [];

        //BUG does not work properly
        var _getVisibleComponents = function (selector) {
            return Ext.ComponentQuery.query(selector).filter(function (item) {
                if (!item.el || !item.el.dom) {
                    return false;
                }

                var r = item.el.dom.getBoundingClientRect();
                var x = (r.left + r.width / 2);
                var y = (r.top + r.height / 2);

                MochaUI.hide();
                var visible = (window.document.elementsFromPoint(x, y) || []).filter(function (dom) {
                    return (dom === item.el.dom);
                });
                MochaUI.show();

                return (visible.length > 0);
            });
        };

        if (!type) {
            selector = titleOrSelector;
            extJsComponent = _getVisibleComponents(selector)[0];
        }

        if (!extJsComponent && type) {
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

            selectors.every(function (item) {
                extJsComponent = _getVisibleComponents(item)[0];
                return !extJsComponent;
            });

            if (!extJsComponent) {
                (Ext.ComponentQuery.query(type) || []).every(function (item) {
                    titleProperties.every(function (prop) {
                        var title = item[prop];
                        var fnName = ('get' + prop[0].toUpperCase() + prop.slice(1));
                        if (fnName && item[fnName] && typeof item[fnName] === 'function') {
                            title = item[fnName].call(item);
                        }
                        if ((new RegExp(titleOrSelector, 'g')).test(title)) {
                            extJsComponent = item;
                        }
                        return !extJsComponent;
                    });
                    return !extJsComponent;
                });
            }
        }

        if (!extJsComponent) {
            return callback('Selector "' + (selector || selectors.join(', ')) + '" not found.');
        } else if (!extJsComponent.el || !extJsComponent.el.dom) {
            return callback(
                'No existing HTML element for selector "' + (selector || selectors.join(', ')) + '".'
            );
        }

        //TODO to method
        var rect = extJsComponent.el.dom.getBoundingClientRect();
        if (rect.left + rect.width < 0 || rect.top + rect.height < 0) {
            return callback(
                'No visible HTML element for selector "' + selector + '", offset: '
                + rect.left + ',' + rect.top + ', size: ' + rect.width + ',' + rect.height + '.'
            );
        }

        var componentObject = null;
        var properties = {
            selectors: (selector || selectors.join(', ')),
            extJsComponent
        };

        if (type === 'tab') {
            componentObject = new ExtJsComponentTab(properties);
        } else if (type === 'grid') {
            componentObject = new ExtJsComponentGrid(properties);
        } else if (type === 'radio') {
            componentObject = new ExtJsComponentRadio(properties);
        } else if (type === 'button') {
            componentObject = new ExtJsComponentButton(properties);
        } else if (type === 'window') {
            componentObject = new ExtJsComponentWindow(properties);
        } else if (type === 'checkbox') {
            componentObject = new ExtJsComponentCheckBox(properties);
        } else if (type === 'combobox') {
            componentObject = new ExtJsComponentComboBox(properties);
        } else if (type === 'textfield') {
            componentObject = new ExtJsComponentTextField(properties);
        } else if (type === 'numberfield') {
            componentObject = new ExtJsComponentNumberField(properties);
        }

        if (componentObject) {
            return callback(null, componentObject);
        } else {
            throw new Error(`Component "${type}" is not supported by driver "${self.constructor.name}".`);
        }
    }

    waitLoadMask (callback) {
        return waitForFn(
            function (done) {
                //TODO improve this method
                var maskDisplayed = (window.document.getElementsByClassName('x-mask-msg').length > 0);

                if (maskDisplayed) {
                    done(true);
                } else {
                    done(null);
                }
            },
            callback,
            {
                delay: 500 // wait load mask display delay
            }
        );
    }

    waitText (callback, text) {
        //TODO check parent
        return waitForFn(
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
                    done(`Text pattern "${text}" not found on page.`);
                }
            },
            callback
        );
    }

}
