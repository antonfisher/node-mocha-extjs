'use strict';

export class Cursor {

    constructor () {
        var self = this;

        self._size = 14;
        self._timeout = 400;
        self._initTransition = `all ${self._timeout}ms ease-in-out`;
        self._position = {
            x: 0,
            y: 0
        };

        self._point = window.document.getElementById('mocha-extjs-testing-tool-pointer');

        if (!self._point) {
            self._point = document.createElement('div');

            self._point.id = 'mocha-extjs-testing-tool-pointer';
            self._point.style.top = `${self._position.y}px`;
            self._point.style.left = `${self._position.x}px`;
            self._point.style.width = `${self._size}px`;
            self._point.style.zIndex = '90000';
            self._point.style.height = `${self._size}px`;
            self._point.style.border = '2px solid #ffffff';
            self._point.style.opacity = '1';
            self._point.style.position = 'absolute';
            self._point.style.transition = self._initTransition;
            self._point.style.borderRadius = `0 ${self._size / 2}px ${self._size / 2}px ${self._size / 2}px`;
            self._point.style.backgroundColor = '#ee3300';

            window.document.body.appendChild(self._point);
        }
    }

    moveTo (x, y, callback) {
        var self = this;
        var translate = `translate(${x}px, ${y}px)`;

        self._point.style.transform = translate;

        setTimeout(() => {
            self._point.style.transition = 'all 50ms ease-in-out';
            self._point.style.transform = `${translate} scale(0.5)`;
            setTimeout(() => {
                self._point.style.transform = `${translate} scale(1)`;
                setTimeout(() => {
                    self._point.style.transition = self._initTransition;
                    return callback(null);
                }, 50);
            }, 50);
        }, self._timeout);
    }

}
