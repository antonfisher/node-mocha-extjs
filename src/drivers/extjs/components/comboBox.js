'use strict';

import {HTMLComponentBase} from '../../html/components/base.js'
import {ExtJsComponentBase} from './base.js'

export class ExtJsComponentComboBox extends ExtJsComponentBase {

    select (callback, index) {
        var self = this;
        var cmp = self.extJsComponent;

        self.click((err) => {
            if (err) {
                return callback(`cannot select item #${index} in component "${self.componentType}": ${err}`);
            }

            //TODO add validation method
            if (!cmp || !cmp.picker || !cmp.picker.el || !cmp.picker.el.id) {
                return callback(`cannot find picker of component "${self.componentType}": ${err}`);
            }

            var htmlElement = null;

            try {
                htmlElement = document
                    .getElementById(cmp.picker.el.id)
                    .getElementsByClassName('x-boundlist-item')[index];
            } catch (e) {
                return callback(`Failed to get element of "${self.componentType}" row #${index}": ${err}`);
            }

            new HTMLComponentBase(htmlElement).click((err) => {
                if (err) {
                    return callback(`Failed to click on item #${index} of "${self.componentType}" ": ${err}`);
                } else {
                    return callback(null);
                }
            });
        });
    }

}
