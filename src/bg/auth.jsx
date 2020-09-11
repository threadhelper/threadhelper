import delay from "delay";
import * as browser from "webextension-polyfill";
import Kefir from 'kefir';


export function makeAuthObs(){

  return Kefir.stream(emitter => {
    
    let tabId
    let authorization
    let csrfToken

    emitter.emit({
      name: "credentials",
      authorization,
      csrfToken,
    })

    // const webRequestOptions = ["requestHeaders", "blocking"]
    const webRequestOptions = ["requestHeaders"]

    if (typeof window.browser === "undefined") {
      // For Chrome only
      webRequestOptions.push("extraHeaders")
    }

    const chromePrep = details => {
      const requestHeaders = details.requestHeaders
      // This is required for our fetch requests to succeed in Chromes
      if (!requestHeaders.find(h => h.name.toLowerCase() === "origin")) {
        requestHeaders.push({ name: "Origin", value: "https://twitter.com" })
      }
      return {
        requestHeaders,
      }
    }
    //needed for it to work on chrome
    chrome.webRequest.onBeforeSendHeaders.addListener(
      chromePrep,
      { urls: ["https://api.twitter.com/*"] },
      webRequestOptions
    )

    
    const sendCredentials = () => {
      // console.log("sending credentials", {
      //   name: "credentials",
      //   authorization,
      //   csrfToken,
      // })
      emitter.emit({
        name: "credentials",
        authorization,
        csrfToken,
      })
    }

    const onSendHeaders = async details => {
      tabId = details.tabId
      const _authorization = details.requestHeaders.find(h => h.name.toLowerCase() === "authorization")
      const _csrfToken = details.requestHeaders.find(h => h.name.toLowerCase() === "x-csrf-token")
      // just return if fields don't exist
      if (!(_authorization != null) || !(_csrfToken != null)) return
      authorization = _authorization.value
      csrfToken = _csrfToken.value

      sendCredentials()
    }

    chrome.webRequest.onSendHeaders.addListener(
      onSendHeaders,
      { urls: ["https://api.twitter.com/*"] },
      ["requestHeaders"]
    )
    
    return () => {
      chrome.webRequest.onSendHeaders.removeListener(onSendHeaders)
      chrome.webRequest.onBeforeSendHeaders.removeListener(chromePrep)
      emitter.end()
    }

  });
}