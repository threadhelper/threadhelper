'use strict';
import { curry } from 'ramda';
// via https://github.com/nolanlawson/promise-worker/blob/8856848391dac68407fd9d851926d9e4e0cf3259/register.js#L8
function isPromise(obj: Promise<any>) {
    // via https://unpkg.com/is-promise@2.1.0/index.js
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
export const onWorkerPromise = curry((callback: (arg0: any) => any, e: {data: any;}) => {
    function postOutgoingMessage(e: Object, messageId: number, error: Error, result: any) {
        function postMessage(msg: any[]) {
            /* istanbul ignore if */
            if (typeof self.postMessage !== 'function') { // service worker
                (e as any).ports[0].postMessage(msg);
            }
            else { // web worker
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
                self.postMessage(msg);
            }
        }
        if (error) {
            /* istanbul ignore else */
            if (typeof console !== 'undefined' && 'error' in console) {
                // This is to make errors easier to debug. I think it's important
                // enough to just leave here without giving the user an option
                // to silence it.
                console.error('Worker caught an error:', error);
            }
            postMessage([messageId, {message: error.message}]);
        }
        else {
            // console.log('worker posting result message', {messageId, result})
            postMessage([messageId, null, result]);
        }
    }
    function tryCatchFunc(callback: (arg0: any) => any, message) {
        try {
            return { res: callback(message) };
        }
        catch (e) {
            return { err: e };
        }
    }
    function handleIncomingMessage(e: {ports: {postMessage: (arg0: any) => void;}[];} | {data: any;}, callback: (arg0: any) => any, messageId, message) {
        var result = tryCatchFunc(callback, message);
        if (result.err) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
            postOutgoingMessage(e, messageId, result.err);
        }
        else if (!isPromise(result.res)) {
            postOutgoingMessage(e, messageId, null, result.res);
        }
        else {
            result.res.then(function (finalResult: undefined) {
                postOutgoingMessage(e, messageId, null, finalResult);
            }, function (finalError: Error) {
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
                postOutgoingMessage(e, messageId, finalError);
            });
        }
    }
    function onIncomingMessage(e: {data: any;}) {
        var payload = e.data;
        if (!Array.isArray(payload) || payload.length !== 2) {
            // message doens't match communication format; ignore
            return;
        }
        var messageId = payload[0];
        var message = payload[1];
        if (typeof callback !== 'function') {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
            postOutgoingMessage(e, messageId, new Error('Please pass a function into register().'));
        }
        else {
            handleIncomingMessage(e, callback, messageId, message);
        }
    }
    onIncomingMessage(e);
});
