// import ReactGA from "react-ga";
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
// import { msgBG } from "./dutils.tsx"

export const UA_CODE = 'UA-170230545-2';

export const initGA = () => {
  // ReactGA.initialize(UA_CODE, {
  //   debug: false,
  //   titleCase: false,
  // });
  // ReactGA.ga('set', 'checkProtocolTask', null);
};

export const PageView = (name) => {
  // ReactGA.pageview(name);
};

export const Event = (category, action, label, value = 0) => {
  // ReactGA.event({
  //   category,
  //   action,
  //   label,
  //   value
  // });
};

export const Exception = (description, fatal) => {
  // return ReactGA.exception({
  // description: description,
  // fatal: fatal
  // })
};

export const csEvent = (category, action, label, value = 0) => {
  // msgBG({type: 'gaEvent', event: {category, action, label, value}})
};
export const csException = (description, fatal) => {
  // msgBG({type: 'gaException', exception: {description, fatal}})
};
