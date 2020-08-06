const { src, dest } = require('gulp');
const del = require('del');

/**
 * Очищает директорию build.
 * @return {Stream} Поток NodeJS.
 */
const clean = () => del(['build']);

/**
 * Добавляет данные необходимые для публикации пакета в NPM в директорию build/package.
 * @return {Stream} Поток NodeJS.
 */
const addPackageData = () => src([
  'package.json',
  'README.md',
])
  .pipe(dest('build/package'));

exports.clean = clean;
exports.build = addPackageData;
exports.default = addPackageData;