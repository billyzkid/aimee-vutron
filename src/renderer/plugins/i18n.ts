import { createI18n } from "vue-i18n";
import { getCurrentLocale } from "@/renderer/utils";
import * as de from "@/renderer/locales/de.json";
import * as en from "@/renderer/locales/en.json";
import * as es from "@/renderer/locales/es.json";
import * as fr from "@/renderer/locales/fr.json";
import * as ja from "@/renderer/locales/ja.json";
import * as ko from "@/renderer/locales/ko.json";
import * as pt from "@/renderer/locales/pt.json";
import * as ru from "@/renderer/locales/ru.json";
import * as zhHans from "@/renderer/locales/zh-hans.json";
import * as zhHant from "@/renderer/locales/zh-hant.json";

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: getCurrentLocale(),
  fallbackLocale: "en",
  messages: {
    de,
    en,
    es,
    fr,
    ja,
    ko,
    pt,
    ru,
    zhHans,
    zhHant
  }
});
