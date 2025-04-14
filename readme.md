# Universal Thing

```
npm install universal-thing
```

```javascript
import createThing from 'univeral-thing'

const thing = createThing([handler])
```

Create a thing that you can use universally. Can be called, awaited, assigned
to, iterated over, etc. Provide an optional handler to observe actions taken on
the thing and its descendants and change return results. Inspect the results
with createThing.logSymbol