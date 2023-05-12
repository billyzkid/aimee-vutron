import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { de, en, es, fr, ja, ko, pt, ru, zhHans, zhHant } from "vuetify/locale";
import colors from "vuetify/lib/util/colors";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.min.css";

export default createVuetify({
  locale: {
    messages: { de, en, es, fr, ja, ko, pt, ru, zhHans, zhHant },
    locale: "en"
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.green.darken2
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.green.darken4
        }
      }
    }
  }
});
