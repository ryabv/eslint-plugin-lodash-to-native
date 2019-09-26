# eslint-plugin-lodash-to-native

Правило находит использование функции `_.map`, например `_.map(collection, fn)`, и предлагает заменить его на использование нативного `Array#map`.

Например, код
```js
return _.map(collection, fn);
```
надо заменить на
```js
return (Array.isArray(collection)) ?
	collection.map(fn) :
	_.map(collection, fn);
```