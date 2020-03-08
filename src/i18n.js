/**
 * File: i18n.js
 * Project: z-react
 * FilePath: /src/i18n.js
 * Created Date: 2019-12-28 23:29:55
 * Author: Zz
 * -----
 * Last Modified: 2019-12-29 00:02:12
 * Modified By: Zz
 * -----
 * Description:
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './i18n/zh-CN.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      'Welcome to React': 'Welcome to React and react-i18next',
      searchInputPlaceholder: 'search',
    },
  },

  'zh-CN': {
    translation: zhCN,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'zh-CN',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
