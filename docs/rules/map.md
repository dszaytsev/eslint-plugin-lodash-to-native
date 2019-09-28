# Check lodash map method (map)

## Rule Details

This rule aims to `_.map([], mapFn)`

Examples of **incorrect** code for this rule:


```
js_.map([1, 2, 3, 4], () => {})
```

```js
const array = [1, 2, 3, 4]

_.map(array, mapFn)
```

```js
import { array } from '...'

_.map(array, mapFn)
```

```js
_.map(object, mapFn)

const object = {}
```

Examples of **correct** code for this rule:

```js
_.map({}, mapFn)
```

```js
const object = {}

_.map(object, mapFn)
```


```js
_.map({}, mapFn)

const object = {}
```

```js
_.map(array, mapFn)

const array = []
```

```js
const _ = { map() { } }

_.map([], mapFn)
```


## When Not To Use It

When Array has no map method
