import { defineStore } from "pinia";
import gsap from "gsap";
import { useInputStore } from "./useInputStore";

export const useViewStore = defineStore("view", {
  state: () => ({
    zoom: 2,
    offset: {
      x: 0,
      y: 0,
    },
    isUiVisible: true,
  }),

  actions: {
    toggleUi() {
      this.isUiVisible = !this.isUiVisible;
    },
    openUi() {
      this.isUiVisible = true;
    },

    resetView() {
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

    smoothZoom(delta: number) {
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
