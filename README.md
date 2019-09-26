# eslint-plugin-lodash-to-native

Правило находит использование функции `_.map`, например `_.map(collection, fn)`, и предлагает заменить его на использование нативного `Array#map`.

Например, код
```js
return _.map(collection, fn);
```

заменится на
```js
return (Array.isArray(collection)) ?
	collection.map(fn) :
	_.map(collection, fn);
```

### Дополнительно

Если `_` был переопределён, то правило не срабатает после переопределения
```js
var m1 = _.map([], fn); // здесь сработает
_ = {map: () => []};
var m2 = _.map([], fn); // здесь НЕ сработает
```