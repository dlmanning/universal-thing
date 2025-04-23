# Universal Thing

A flexible JavaScript utility that creates universal proxy objects that can be called, awaited, accessed, iterated over, and more. This utility enables fluid interfaces, mocking, testing, and dynamic property chaining.

## Installation

```bash
npm install universal-thing
```

## Basic Usage

```javascript
import universalThing from 'universal-thing'

// Create a basic universal thing
const thing = universalThing()

// Use it in various ways
thing.property.chain.works()
thing().chained.calls.work()
await thing.promises.work()
thing.properties = "can be set"
thing[Symbol('even symbols work')] = true
```

## API Reference

### universalThing(handler)

Creates a universal proxy object that can be used in various ways.

**Parameters:**

- `handler` (Function, optional): A function that receives information about every interaction with the proxy and can modify the behavior.
  - **Signature:** `handler(action, internal, proxy, next)`
  - **Returns:** If the handler returns a non-undefined value, that value will be used instead of the default behavior.

**Returns:**

A proxy object that can be used in various ways.

### Handler Function

The handler function receives the following parameters:

- `action` (Object): Information about the current interaction
  - `type` (String): The type of interaction ('get', 'set', or 'call')
  - `path` (Array): The reverse path of properties accessed to reach this point
  - `args` (Array): Arguments for the interaction (property name for 'get', property name and value for 'set', or function arguments for 'call')
- `internal` (Map): A Map of property names to values that have been explicitly set on this proxy
- `proxy` (Proxy): The current proxy object
- `next` (Proxy): The next proxy object in the chain

### universalThing.logSymbol

A Symbol that can be used to access the log of all interactions with the proxy.

```javascript
const thing = universalThing()
thing.a.b.c()
console.log(thing[universalThing.logSymbol])
// Will output the log of all interactions
```

## Examples

### Basic Chaining

```javascript
const api = universalThing()
// This works even if these properties and methods don't exist
const response = api.users.getById(123).profile.load()
```

### Custom Handler

```javascript
// Create a proxy that returns data based on the path
const data = universalThing((action) => {
  if (action.type === 'get' && action.path.join('.') === 'user.name') {
    return 'John Doe'
  }
  
  if (action.type === 'call' && action.path[1] === 'users' && action.path[0] === 'getById') {
    const userId = action.args[0]
    return { id: userId, name: 'User ' + userId }
  }
})

console.log(data.user.name) // "John Doe"
console.log(data.users.getById(42)) // { id: 42, name: "User 42" }
```

### Mocking APIs

```javascript
// Create a mock API for testing
const mockApi = universalThing((action) => {
  // Record API calls for later inspection
  if (action.type === 'call' && action.path[0] === 'get' && action.path[1] === 'users') {
    return [{ id: 1, name: 'Test User' }]
  }
})

// Use in tests
async function testUserFlow() {
  const users = await mockApi.users.get()
  console.log(users) // [{ id: 1, name: 'Test User' }]
  
  // Verify API was called correctly
  const log = mockApi[universalThing.logSymbol]
  console.log(log) // Shows all calls to the API
}
```

### Promise-like Behavior

```javascript
const asyncThing = universalThing()
// Can be awaited like a promise
await asyncThing.fetch.data() // Works even though it's not a real promise
```

### Tracking Property Access

```javascript
const tracker = universalThing()
tracker.user.profile.settings.theme
console.log(tracker[universalThing.logSymbol])
// Shows the entire chain of property access
```

## Advanced Features

### Symbol.toPrimitive Support

The proxy implements `Symbol.toPrimitive` to provide helpful string representations and allows numeric conversion.

```javascript
const thing = universalThing()
// When converted to a string, shows the access path
console.log('' + thing.a.b.c) // "root.a.b.c"
// When converted to a number, returns a counter value
console.log(+thing) // 3 (initial value, decrements with certain operations)
```

### Iteration Support

The proxy can be used in iteration contexts:

```javascript
const collection = universalThing()
for (const item of collection) {
  // Works for a limited number of iterations (3 by default)
}
```

## How It Works

The utility creates a chain of nested Proxy objects that track all interactions. Each property access, method call, or assignment creates a new proxy that remembers its place in the chain. This enables fluid interfaces and allows inspection of how the object was used.

The internal counter enables iteration for a limited number of times before stopping, preventing infinite loops.

## Use Cases

- **Fluid interfaces**: Build chainable APIs with minimal code
- **Mocking**: Create mock objects that record how they're used
- **Testing**: Verify correct API usage without actual implementation
- **Exploratory programming**: Use before designing the actual API
- **Data access abstraction**: Create path-based data access patterns
