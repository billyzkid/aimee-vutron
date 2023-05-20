import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0
  }),
  actions: {
    incrementCount() {
      this.count++;
    }
  }
});
