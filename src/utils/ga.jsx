

const getGaq = ()=>{
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-170230545-1']);
  _gaq.push(['_trackPageview']);
  return _gaq
}

export function activateTracking() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
}

function trackButton(e) {
  _gaq.push(['_trackEvent', e.target.id, 'clicked']);
};
