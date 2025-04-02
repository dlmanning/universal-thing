# Universal Thing

```
npm install universal-thing
```

```javascript
import createThing from 'univeral-thing'

const thing = createThing()
```

Create a thing that you can use universally. Can be called, awaited, assigned to,
etc. Provide an optional handler to observe actions taken on the thing and its
descendants.