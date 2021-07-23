# Vendor package

DLL с общими js-зависимостями frontend-сервисов в виде npm-пакета.

##### Подробнее здесь:
https://webpack.js.org/plugins/dll-plugin/

### Содержимое

В зависимостях этого пакета модули которые однозначно входят в наш стек,
а значит **точно** будут присутствовать в бандле каждого frontend-сервиса.

Из этих зависимостей формируется результирующий vendor-бандл и соответствующий ему манифест.

### Использование

Сначала необходимо установить пакет:

```bash
# npm
$ npm i -D @sima-land/vendor

# или yarn
$ yarn add -D @sima-land/vendor
```

Затем необходимо установить peer-зависимости данного пакета.

После чего файлы из пакета можно использовать в webpack-конфигурации:

```js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require.resolve('@dev-dep/vendor/dist/manifest.json'),
    }),
  ],
};
```

Важно: использовать вендоры можно только в режиме production,
так как в зависимостях зашиты production-сборки пакетов.
