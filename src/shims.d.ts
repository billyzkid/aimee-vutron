// https://github.com/vuetifyjs/vuetify/issues/16346
declare module "vuetify/lib/util/colors";

declare module "unzip-crx-3" {
  export default function (source: string, destination?: string): Promise<void>;
}
