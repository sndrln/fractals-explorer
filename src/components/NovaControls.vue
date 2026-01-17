<script setup lang="ts">
import { ref } from "vue";
import { useFractalStore } from "../store/fractalStore";
import SlidableValue from "./SlidableValue.vue";
import PaletteSelector from "./PaletteSelector.vue";

const store = useFractalStore();

const getVarColor = (varName: string): string => {
  const colors: Record<string, string> = {
    relaxation: "#ff6464", // Red-ish
    powerMain: "#64ff64", // Green-ish
    powerDerivative: "#64c8ff", // Cyan-ish
  };

  return colors[varName] || "#646cff"; // Fallback to default blue
};
</script>

<template>
  <Transition name="fade">
    <div id="ui" v-show="store.isUiVisible">
      <div class="ui-header">
        <h1>Nova</h1>
        <button
          class="close-ui-btn"
          @click="store.toggleUi()"
          title="Close UI (`) "
        >
          <span class="icon">◀</span>
        </button>
      </div>

      <div id="formula-display">
        z<sub>n+1</sub> = z<sub>n</sub> -
        <SlidableValue
          v-model="store.params.relaxation"
          varName="relaxation"
          color="#ff55ff"
          :step="0.005"
        />
        &times; (z<sup
          ><SlidableValue
            v-model="store.params.powerMain"
            varName="powerMain"
            color="#ffaa00"
            :step="0.01"
        /></sup>
        -
        <SlidableValue
          v-model="store.params.subtrahend"
          varName="subtrahend"
          :step="0.01"
          color="#ffffff"
        />) / z<sup
          ><SlidableValue
            v-model="store.params.powerDerivative"
            varName="powerDerivative"
            color="#00ffaa"
            :step="0.01"
        /></sup>
        <span>Iterations: </span>
        <SlidableValue
          v-model="store.params.maxIterations"
          varName="maxIterations"
          :step="1"
          color="#ffffff"
        />
      </div>

      <div>
        <span>Seed: </span>
        <SlidableValue
          v-model="store.params.seedX"
          varName="seedX"
          color="#ff00aa"
        />
        <span> + </span>
        <SlidableValue
          v-model="store.params.seedY"
          varName="seedY"
          color="#ff00aa"
        />
        <span>i</span>
      </div>

      <div>
        <span>Power I: </span>
        <SlidableValue
          v-model="store.params.powerMainImaginary"
          varName="powerMainImaginary"
          color="#ff00aa"
        />
        <span> + </span>
        <SlidableValue
          v-model="store.params.powerDerivativeImaginary"
          varName="powerDerivativeImaginary"
          color="#ff00aa"
        />
        <span>i</span>
      </div>

      <div>
        <span>Memory </span>
        <SlidableValue
          v-model="store.params.memoryR"
          varName="memoryR"
          color="#ff00aa"
        />
        <span> + </span>
        <SlidableValue
          v-model="store.params.memoryI"
          varName="memoryI"
          color="#ff00aa"
        />
        <span>i</span>
      </div>

      <div>
        <span>Julia morph</span>
        <SlidableValue
          v-model="store.params.juliaMorph"
          varName="juliaMorph"
          color="#ff00aa"
          :step="0.01"
        />
        <span>i</span>
      </div>

      <!-- <div class="toggle-container">
        <label class="switch">
          <input type="checkbox" v-model="store.isJulia" />
          <span class="slider"></span>
        </label>
        <span>Julia Mode</span>
      </div> -->

      <div class="axis-container">
        <div
          class="axis-well"
          :class="{ active: store.activeTargetAxis === 'x' }"
        >
          <div class="well-header">
            <span>Mouse X</span>
            <button @click.stop="store.toggleTargetAxis('x')" class="plus-btn">
              +
            </button>
          </div>
          <div class="pill-box">
            <div
              v-for="v in store.bindingsX"
              :key="v"
              class="pill"
              :style="{ borderColor: getVarColor(v) }"
            >
              {{ v }} <span @click="store.unbindVariable(v, 'x')">×</span>
            </div>
          </div>
        </div>

        <div
          class="axis-well"
          :class="{ active: store.activeTargetAxis === 'y' }"
        >
          <div class="well-header">
            <span>Mouse Y</span>
            <button @click.stop="store.toggleTargetAxis('y')" class="plus-btn">
              +
            </button>
          </div>
          <div class="pill-box">
            <div
              v-for="v in store.bindingsY"
              :key="v"
              class="pill"
              :style="{ borderColor: getVarColor(v) }"
            >
              {{ v }} <span @click="store.unbindVariable(v, 'y')">×</span>
            </div>
          </div>
        </div>
      </div>

      <PaletteSelector />
      <button @click="store.resetView" class="reset-btn" title="Reset View">
        ⟲
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px); /* Subtle "slide down" effect while fading out */
}

#ui {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(10, 10, 10, 0.85);
  padding: 20px;
  border-radius: 12px;
  color: white;
  width: 340px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.ui-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.ui-header h1 {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #646cff;
}

.close-ui-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-ui-btn:hover {
  background: rgba(100, 108, 255, 0.2);
  color: #fff;
  border-color: #646cff;
}

.close-ui-btn .icon {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.close-ui-btn:hover .icon {
  transform: translateX(-2px); /* Subtle hint of the closing direction */
}

#formula-display {
  background: rgba(0, 0, 0, 0.4);
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  font-family: "Times New Roman", serif;
  font-style: italic;
  font-size: 17px;
  line-height: 1.8;
  min-height: 40px;
  color: #eee;
}

h1 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.9;
}

.hint {
  font-size: 0.7rem;
  text-align: center;
  opacity: 0.4;
  text-transform: uppercase;
}

.axis-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.axis-well {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  min-height: 60px;
  transition: all 0.3s;
}
.axis-well.active {
  border-color: #646cff;
  background: rgba(100, 108, 255, 0.1);
}
.well-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 5px;
}
.plus-btn {
  background: none;
  border: 1px solid #555;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  padding: 0 5px;
}
.pill-box {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.pill {
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid;
  border-radius: 3px;
  display: flex;
  gap: 5px;
}
.pill span {
  cursor: pointer;
  opacity: 0.5;
}
.pill span:hover {
  opacity: 1;
}

.reset-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 8px;
  margin-top: 10px;
  transition: all 0.2s;
}
.reset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #646cff;
}
</style>
