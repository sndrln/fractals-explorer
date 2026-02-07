import { defineStore } from "pinia";
import { palettes } from "../constants/palettes";
import gsap from "gsap";
import type { Palette } from "../types/ui";

export const usePaletteStore = defineStore("palette", {
  state: () => ({
    selectedPalette: structuredClone(palettes[0]),
    currentIndex: 0,
    isRandom: false,
  }),

  actions: {
    animateToPalette(target: Partial<Palette>, duration = 0.8) {
      const ease = "power2.inOut";

      const arrayKeys: Array<keyof Palette> = [
        "brightness",
        "contrast",
        "osc",
        "phase",
      ];

      arrayKeys.forEach((key) => {
        const currentArray = this.selectedPalette[key];
        const targetArray = target[key];

        if (currentArray && targetArray) {
          gsap.killTweensOf(currentArray);
          gsap.to(currentArray, {
            endArray: targetArray,
            duration,
            ease,
          });
        }
      });
    },

    setPalette(palette: Palette) {
      this.animateToPalette(palette);
    },

    setPaletteByIndex(index: number) {
      if (index >= 0 && index < palettes.length) {
        this.currentIndex = index;
        this.isRandom = false;
        this.animateToPalette(palettes[index]);
      }
    },
    generateRandomPalette() {
      const shift = (amt = 0.5) => (Math.random() - 0.5) * amt;
      const rand = (min: number, max: number) =>
        min + Math.random() * (max - min);

      const target: Omit<Palette, "name"> = {
        brightness: [rand(0.3, 0.7), rand(0.3, 0.7), rand(0.3, 0.7)],
        contrast: [rand(0.3, 0.7), rand(0.3, 0.7), rand(0.3, 0.7)],
        osc: this.selectedPalette.osc.map((v) =>
          Math.max(0.1, Math.min(1.0, v + shift(0.3))),
        ),
        phase: this.selectedPalette.phase.map((v) => v + shift(2.0)),
      };

      this.isRandom = true;
      this.animateToPalette(target, 1.2);
    },

    nextPalette() {
      const nextIndex = (this.currentIndex + 1) % palettes.length;
      this.setPaletteByIndex(nextIndex);
    },

    prevPalette() {
      const prevIndex =
        (this.currentIndex - 1 + palettes.length) % palettes.length;
      this.setPaletteByIndex(prevIndex);
    },
  },
});
