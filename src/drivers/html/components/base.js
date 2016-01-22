'use strict';

//TODO remove this dependency
import {Cursor} from '../../../cursor.js';
import {MochaUI} from '../../../utils/mochaUI.js'

export class HTMLComponentBase {

    constructor (htmlElement) {
        this._htmlElement = htmlElement;
    }

    get htmlElement () {
        return this._htmlElement;
    }

    click (callback) {
        var err;
        var el = this.htmlElement;

        // for PhantomJs:
        //  ./node_modules/mocha-phantomjs/node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js:116
        // add "page.sendEvent.apply(this, data.sendEvent);"
        //
        var rect = el.getBoundingClientRect();
        var x = (rect.left + rect.width / 2);
        var y = (rect.top + rect.height / 2);

        //TODO remove
        var _cursor = new Cursor();

        _cursor.moveTo(x + 1, y + 1, () => {
            MochaUI.hide();

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
                    err = `[${x},${y}] (${e})`;
                }
            }

            MochaUI.show();

            return callback(err ? `cannot click on "${el.id}" ${err}` : null);
        });
    }

}
