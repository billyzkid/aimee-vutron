import { defineStore } from "pinia";

export const useCounter = defineStore("counter", {
  state: () => ({
    count: 0
  }),
  getters: {
    getCount: (state) => state.count
  },
  actions: {
    increaseCount(amount: number) {
      this.count += amount;
    }
  }
});
