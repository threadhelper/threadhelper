// https://github.com/sktt/kefir-observable-selector
/*
Exposes the obsAdded, obsRemoved and obsAttributes for creating streams

obsAdded(root: Node, selector: String, subtree: boolean)
Creates a stream emitting nodes already added and newly added nodes which matches selector for aslong as the stream has subscribers. If subtree is set, nodes matching selector added to anywhere in the subtree of root will be emitter.

obsRemoved(root: Node, selector: String, subtree: boolean)
Creates a stream emitting nodes removed from root which matches selector for aslong as the stream has subscribers. If subtree is set, nodes matching selector removed from anywhere in the subtree of root will be emitter.

obsAttributes(root: Node, attributeFilter: [String])
Creates a stream emitting root when an attribute matching attributeFilter (optional) is changed for as long as the stream has subscribers.

*/

import {fromEvents, constant, stream} from 'kefir'
import {isNil} from 'ramda'

const domReady = constant(document.readyState)
  .filter(state => state !== 'loading')
  .merge(fromEvents(document, 'DOMContentLoaded').map(_ => document.readyState))
  .take(1)
  .toProperty()

export const mutationRecorder = (root: Node, options: MutationObserverInit) => {
  return domReady.flatMap(
    _ => stream(
      emitter => {
        const obs = new MutationObserver(emitter.emit)

        //At the very least, childList, attributes, or characterData
        //must be set to true. Otherwise, "An invalid or illegal string was
        //specified" error is thrown.
        obs.observe(root, options)
        return () => obs.disconnect()
      }
    )
  )
}

const exists = e => e != null
const populated = e => !isNil(e) && (Object.keys(e).length > 0)
const matches = selector => (el: { matches: (arg0: any) => any }) => el.matches && el.matches(selector)
const pluck = (key: string) => (arr: any[]) => arr.map((el: { [x: string]: any }) => el[key])
const noop = x => x
const concat = (acc: string | any[], n) => acc.concat(n)
const nodesMatching = selector => (nodes: any[]) => nodes.filter(matches(selector))
const toArray = collection => Array.prototype.concat.apply([], collection)
const flattenArrays = (nodeArrs: any[]) => nodeArrs.map(toArray).reduce(concat, [])

const includeNested = selector => (nodes: any[]) => {
  const m = nodes.filter(
(    // only include nodes
    node: { nodeType: number }) => node.nodeType === 1
  ).map(
(    node: { querySelectorAll: (arg0: any) => any }) => toArray(node.querySelectorAll(selector))
  ).reduce(concat, [])

  return nodes.concat(m)
}

export const obsAdded = (root: Node, selector, subtree) => {
  return mutationRecorder(root, {
    childList: true,
    subtree
  })
  .map(pluck('addedNodes'))
  .map(flattenArrays)
  .map(subtree ? includeNested(selector) : noop)
  .map(nodesMatching(selector))
  .merge(constant(Array.prototype.concat.apply([],
    document.querySelectorAll(selector)
  )))
  .filter(populated)
}

export const obsRemoved = (root: Node, selector, subtree) => {
  return mutationRecorder(root, {
    childList: true,
    subtree
  })
  .map(pluck('removedNodes'))
  .map(flattenArrays)
  .map(subtree ? includeNested(selector) : noop)
  .map(nodesMatching(selector))
  .filter(populated)
}

export const obsAttributes = (root: Node, attributeFilter) => {
  return mutationRecorder(root, {
    attributes: true,
    attributeFilter
  })
  .map(pluck('target'))
  .map((nodes: any[]) => nodes.filter((n: Node) => n === root))
  .map((nodes: any[]) => nodes.reduce(concat, []))
  // only looking at one node
  .map((el: any[]) => el[0])
}

//bad, I'm only sure it works for 1 purpose
export const obsCharData = (root: Node, selector) => {
  return mutationRecorder(root, {
    characterData: true, 
    subtree: true, 
    childList: true
  }).map(pluck('target'))
  // .filter(matches(selector))
  // .filter(populated)
  // .map(console.log)
  // only looking at one node
  // .map(el => el[0])
}
