export default function universalThing (handler) {
  return createProxy(handler)
}

function createProxy (handler=function () {}, path=['root'], log=[], parent) {
  // Handler can be used to return custom values in various situations
  // path is the reverse order of properties accessed to get to where you are
  // log can be inspected as obj._log to see calls that were made
  const internal = new Map()
  internal.set('length', 3)

  const p = new Proxy(base, {
    get (tar, prop, rec) {
      if (prop === "_log") return log
      if (prop === Symbol.toPrimitive) return toPrimitive
      // TODO: Decide if symbols should be mocked or not
      // if (typeof prop === 'symbol') return tar[prop]
      const action = { type: "get", path, args: [prop] }
      const next = createProxy(handler, [prop].concat(path), log, p)
      // short circuit promise unraveling
      if (prop === "then" && path[0] === "then") return undefined
      // special case to make promises work
      if (prop === "then") return makeThen(action, next)
      return runHandler(action, next)
    },
    set (tar, prop, val) {
      if (prop === "_log") {
        throw new Error("Something tried to set _log on universal thing")
      }
      internal.set(prop, val)
      const action = { type: "set", path, args: [prop, val] }
      const next = createProxy(handler, [prop].concat(path), log, p)
      return runHandler(action, next)
    }
  })
  function toPrimitive (hint) {
    if (hint === 'number') {
      return path.length
    }
    return path.map((a, n) => {
        if (n === path.length - 1 && a === 'root') return a
        if (typeof a === 'symbol') return `[Symbol(${a.description})]`
        if (a === '_called') return '()'
        return '.' + a
      })
      .reverse()
      .join('') + ' '
  }

  function makeThen (action, next) {
    let result = runHandler(action, next)
    return function (fn) {
      setTimeout(function () {
        fn(result)
      }, 0)
    }
    return next
  }

  function base () { 
    const action = {type: "call", path, args:[...arguments]}
    const next = createProxy(handler, ['_called'].concat(path), log, p)
    return runHandler(action, next)
  }

  function runHandler (action, next) {
    log.push(action)
    const toReturn = handler(action, internal, p, next)
    if (toReturn !== void 0) {
      return toReturn
    }

    if (action.args[0] === "done" && action.path[0] === '_called' && action.path[1] === 'next') {
      let len = internal.get('length')
      internal.set('length', len - 1)
      return len <= 0
    }

    if (action.type === 'call' && (action.path[0] === "pop" || action.path[0] === "unshift")) {
      let len = parent.length
      if (len <= 0) {
        return void 0
      } else {
        parent.length = len - 1
        return next
      }
    }

    const alreadySet = internal.get(action.args[0])
    if ((action.type === 'get' || action.type === 'call') && alreadySet !== void 0) {
      return alreadySet
    } else if (action.type === 'get') {
      internal.set(action.args[0], next)
    } else if (action.type === 'call') {
      internal.set(action.args[0], next)
    }

    return next
  }
  return p
}

