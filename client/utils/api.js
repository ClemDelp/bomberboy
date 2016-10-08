// polyfills fetch on window object, if necessary
require('whatwg-fetch')

const checkResponseStatus = (res) => {
  if (res.status < 200 || res.status >= 300) {
    return res.json()
    .then((json = {}) => {
      throw new Error('Bad request: ' + (json.error || json.reason || '') + ' (' + res.status + ')')
    })
  }
  return res
}

export function apiRequest (endpoint, requestConfig = {}, cb) {
  // NOTE: assumes all calls are JSON in this API
  requestConfig.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  // NOTE: assumes body wasn't already stringified
  if (requestConfig.body) {
    requestConfig.body = JSON.stringify(requestConfig.body)
  }
  return window.fetch(endpoint, requestConfig)
  .then(checkResponseStatus)
  .then(res => res.json())
  .then(json => {
    if (cb) cb(json)
    return json || {}
  })
}
