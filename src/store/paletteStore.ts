import { defineStore } from "pinia";
import { palettes } from "../constants/palettes";
import gsap from "gsap";

export const usePaletteStore = defineStore("palette", {
  state: () => ({
    selectedPalette: JSON.parse(JSON.stringify(palettes[0])),
  }),
  actions: {
    setPalette(id: number) {
      const found = palettes.find((p) => p.id === id);
      if (found) {
        this.animateToPalette(id);
      } else {
        this.animateToPalette(0);
        console.warn(`Palette ID ${id} not found. Falling back to default.`);
      }
    },
    animateToPalette(targetId: number) {
      const target = palettes.find((p) => p.id === targetId);
      if (!target) return;

      gsap.killTweensOf(this.selectedPalette.brightness);
      gsap.killTweensOf(this.selectedPalette.contrast);
      gsap.killTweensOf(this.selectedPalette.osc);
      gsap.killTweensOf(this.selectedPalette.phase);

      const duration = 0.8;
      const ease = "power2.inOut";

      gsap.to(this.selectedPalette.brightness, {
        endArray: target.brightness,
        duration,
        ease,
      });
      gsap.to(this.selectedPalette.contrast, {
        endArray: target.contrast,
        duration,
        ease,
      });
      gsap.to(this.selectedPalette.osc, {
        endArray: target.osc,
        duration,
        ease,
      });
      gsap.to(this.selectedPalette.phase, {
        endArray: target.phase,
        duration,
        ease,
      });
      this.selectedPalette.id = target.id;
    },
    generateRandomPalette() {
      const duration = 1.0;
      const ease = "power2.inOut";

      // helper to get a small random shift (-0.5 to 0.5)
      const shift = (amt = 0.5) => (Math.random() - 0.5) * amt;

      const target = {
        // Randomize brightness/contrast within "safe" beautiful ranges
        brightness: [
          0.4 + Math.random() * 0.4,
          0.4 + Math.random() * 0.4,
          0.4 + Math.random() * 0.4,
        ],
        contrast: [
          0.3 + Math.random() * 0.4,
          0.3 + Math.random() * 0.4,
          0.3 + Math.random() * 0.4,
        ],

        // OSC: We shift slightly from current to keep the "vibe" but change the frequency
        osc: this.selectedPalette.osc.map((v: number) =>
          Math.max(0.2, Math.min(1.0, v + shift(0.4))),
        ),

        // PHASE: This is the key. We only shift the phase by a small amount
        // so it doesn't "spin" through the whole rainbow.
        phase: this.selectedPalette.phase.map((v: number) => v + shift(2.0)),
      };

      // Standard GSAP Morph
      [
        this.selectedPalette.brightness,
        this.selectedPalette.contrast,
        this.selectedPalette.osc,
        this.selectedPalette.phase,
      ].forEach((arr) => gsap.killTweensOf(arr));

      gsap.to(this.selectedPalette.brightness, {
        endArray: target.brightness,
        duration,
        ease,
      });
      gsap.to(this.selectedPalette.contrast, {
        endArray: target.contrast,
        duration,
        ease,
      });
      gsap.to(this.selectedPalette.osc, {
        endArray: target.osc,
        duration,
        ease,
      });
      gsap.to(this.selectedPalette.phase, {
        endArray: target.phase,
        duration,
        ease,
      });

      this.selectedPalette.id = -1;
    },

    nextPalette() {
      const nextId = (this.selectedPalette.id + 1) % palettes.length;
      this.animateToPalette(nextId);
    },

    prevPalette() {
      const len = palettes.length;
      const prevId = (this.selectedPalette.id - 1 + len) % len;
      this.animateToPalette(prevId);
    },
  },
});
