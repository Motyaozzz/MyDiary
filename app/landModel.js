// import {NativeModules, Platform} from 'react-native';
// import {observable, action} from 'mobx';
// import AsyncStorage from '@react-native-community/async-storage';
// import translations from './translations';

// const STORE = '@lang-store';
// // список ru локали 
// const RU_LANGS = [
//   'ru',
//   'az',
//   'am',
//   'by',
//   'ge',
//   'kz',
//   'kg',
//   'md',
//   'tj',
//   'tm',
//   'uz',
//   'ua',
// ];

// class LangModel {
//   @observable
//   lang = 'en';

//   constructor() {
//     this.init();
//   }

//   @action
//   async init() {
//     // Берем текущую локаль из AsyncStorage
//     const lang = await AsyncStorage.getItem(STORE);
//     if (lang) {
//       this.lang = lang;
//     } else {
//       let deviceLanguage: string = (Platform.OS === 'ios'
//         ? NativeModules.SettingsManager.settings.AppleLocale ||
//           NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
//         : NativeModules.I18nManager.localeIdentifier
//       ).toLowerCase();

//       if (
//         RU_LANGS.findIndex((rulang) => deviceLanguage.includes(rulang)) > -1
//       ) {
//         this.lang = 'ru';
//       }
//       AsyncStorage.setItem(STORE, this.lang);
//   }

//   @action
//   changeLang(lang: string) {
//     this.lang = lang;
//     AsyncStorage.setItem(STORE, lang);
//   }

//   rk(text) {
//     if (!text) {
//       return text;
//     }
//     // если локаль ru, то переводить не нужно
//     if (this.lang === 'ru') {
//       return text;
//     }
//     // если перевода нет, кинем предупреждение 
//     if (translations[text] === undefined || translations[text][this.lang] === undefined) {
//       console.warn(text);
//       return text;
//     }
//     return translations[text][this.lang];
//   }
// }

// export default new LangModel();