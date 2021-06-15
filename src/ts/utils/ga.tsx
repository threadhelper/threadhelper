import { assoc, curry, defaultTo, mergeLeft, prop } from 'ramda';
import v5 from 'uuid/v5';
import { enqueueStg, getData, getStgPath } from '../stg/dutils';

export const GA_TRACKING_ID = 'UA-170230545-2';
export const tid = GA_TRACKING_ID;
export const TH_NAMESPACE = '14f437ac-c36e-43d7-a307-e769016a22a1';

export const xhr = (params) => {
  const tidParams = mergeLeft(params, { tid: GA_TRACKING_ID, v: 1 });
  const message = new URLSearchParams(tidParams).toString();
  let request = new XMLHttpRequest();
  request.open('POST', 'https://www.google-analytics.com/collect', true);
  request.send(message);
};
// export const xhrVersioned = (params) =>
//   xhr(assoc('v', chrome.runtime.getManifest().version, params));
export const xhrCliented = async (params) => {
  const screen_name = await getStgPath(['userInfo', 'screen_name']);
  const clientId = v5(defaultTo('no userInfo yet', screen_name), TH_NAMESPACE);
  xhr(assoc('cid', clientId, params));
};
// version, GA_CLIENT_ID, category, action, label, value
// value must be numeric
export const xhrEvent = curry((event) => {
  xhrCliented(
    mergeLeft(event, {
      ds: 'add-on',
      t: 'event',
    })
  );
});

// description, fatal
// fatal 1 or 0
export const xhrException = curry(async (exception) => {
  xhrCliented(
    mergeLeft(exception, {
      ds: 'add-on',
      t: 'exception',
    })
  );
});

export const enqueueEvent = (category, action, label, value) => {
  enqueueStg('queue_analyticsEvents', [
    { ec: category, ea: action, el: label, ev: value },
  ]);
};
export const enqueueException = (description, fatal) => {
  enqueueStg('queue_analyticsEvents', [{ exd: description, exf: fatal }]);
};
