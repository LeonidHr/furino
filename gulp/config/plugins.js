import replace from "gulp-replace"; // перемещение и изменение(img)
import plumber from "gulp-plumber";// обработка ошибок
import notify from "gulp-notify";// подсказки
import browsersync from "browser-sync";// локальный сервер
import newer from "gulp-newer";// проверка изменения img
import ifPlugin from "gulp-if"// условное ветвление

//Экспортируем объект
export const plugins = {
  replace: replace,
  plumber: plumber,
  notify: notify,
  browsersync: browsersync,
  newer: newer,
  if: ifPlugin
}

