# eslint-plugin-lodash-to-native

ESLint плагин для с библиотеки lodash


## Установка


$ npm i --save-dev https://github.com/aisylu-iunusova/eslint-plugin-lodash-to-native.git



## Использование

Добавьте lodash-to-native к списку плагинов .eslintrc:

json
"plugins": [
    "lodash-to-native"
]



Затем любое из правил, перечисленных в списке

json
"rules": {
    "lodash-to-native/rule-name": 1
}


## Список поддерживаемых правил

- lodash-to-native/map: правило находит использование функции _.map, например _.map(collection, fn), и, если это возможно, предлагает заменить его на использование нативного Array#map