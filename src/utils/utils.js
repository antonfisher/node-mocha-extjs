'use strict';

export function waitForFn (waitFn, callback, params) {
    params = (params || {});
    params.delay = (typeof params.delay !== 'undefined' ? params.delay : 10);
    params.timeout = (typeof params.timeout !== 'undefined' ? params.timeout : 10 * 1000);

    var _ticInterval = 500;
    var interval;
    var startTimestamp = +(new Date());
    var lastError = '';
    var exectution = false;
    var intervalFn = function () {
        if ((+new Date() - startTimestamp) > params.timeout) {
            exectution = false;
            clearInterval(interval);
            return callback('Out of time: ' + (params.timeout / 1000) + 's (' + lastError + ')');
        }

        if (!exectution) {
            try {
                exectution = true;
                waitFn(function (err, result) {
                    if (!exectution) {
                        console.warn(`waitForFn(): Operation finished after time out.`);
                        return;
                    }
                    exectution = false;
                    if (err) {
                        lastError = err;
                    } else {
                        clearInterval(interval);
                        return callback(null, result);
                    }
                });
            } catch (e) {
                exectution = false;
                throw e;
            }
        }
    };

    setTimeout(function () {
        interval = setInterval(intervalFn, _ticInterval);
        intervalFn();
    }, params.delay);
}
