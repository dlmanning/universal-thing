import universalThing from './index.js'

var a = universalThing(function ({type, path, args}, map, p, next) {
  // if (type === "get" && args[0] === 'test') {
  //   console.log(args)
  //   return 'wat'
  // }
  if (type === "call" && path[0] === 'asdf', args[0] === 1) {
    console.log('here', path)
    return {
      foo: function () {
        console.log('break out of the proxy')
        return next
      }
    }
  }
})

a().asdf(1,3,5).foo().wtf('back in')
a.test = "weeeee"
a.test += " wooooo"
assert(() => a.test === 'weeeee wooooo')

;(async function () { 
  await a.awaited()
  console.log('after awaited')
})()

assert(() => +a.b.c.d === 3)

assert(() => a.aprop === a.aprop)
assert(() => a.bprop('test') === a.bprop('test'))

// console.log(a[universalThing.logSymbol])

const document = universalThing()

var el = document.getElementById('1.2.3')
el.innerHTML = 'foo'
el.innerHTML += 'bar'

// console.log(document[universalThing.logSymbol])

const fetch = universalThing()

// from mdn fetch docs
async function getData() {
  const url = "https://example.org/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log('fetched json', json);
  } catch (error) {
    console.error(error.message);
  }
}

getData()

const arr = universalThing()

for (const i of arr) {
  console.log('here ' + i)
}

const arr2 = universalThing()

var n = 0
var a = null

while (a = arr2.pop()) {
  console.log(n++)
}

assert(() => n === 3)

const arr3 = universalThing()

var n = 0
var a = null

for (n = 0; n < arr3.length; n += 1) {
  console.log(n)
}

assert(() => n === 3)


// console.log(arr[universalThing.logSymbol])

function assert (fn) {
  var a = fn()
  if (!a) {
    throw new Error(`Assertion failed got ${a} from ${fn.toString()}`)
  }
}

