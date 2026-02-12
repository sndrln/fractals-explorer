import gsap from "gsap";
import { defineStore } from "pinia";
import { FORMULAS } from "../constants/formulas";
import { useInputStore } from "./useInputStore";

export const useCameraStore = defineStore("camera", {
  state: () => ({
    zoom: FORMULAS[0].cameraZoom,
    offset: FORMULAS[0].cameraOffset,
  }),

  actions: {
    resetCamera(): void {
      gsap.to(this, {
        zoom: 2.0,
        duration: 1.5,
        ease: "expo.inOut",
      });

      gsap.to(this.offset, {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: "expo.inOut",
      });
    },

    smoothZoom(delta: number): void {
      const interaction = useInputStore();
      const zoomSpeed = 0.2;
      const factor = delta > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      const newZoom = this.zoom * factor;

      const dx = interaction.mouse.x * (this.zoom - newZoom);
      const dy = interaction.mouse.y * (this.zoom - newZoom);

      gsap.to(this, {
        zoom: newZoom,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(this.offset, {
        x: this.offset.x + dx,
        y: this.offset.y + dy,
        duration: 0.4,
        ease: "power2.out",
      });
    },
  },
});
