<script setup lang="ts">
import {ref} from "vue";
import {BIcon} from "buefy";

const images = ref<string[]>([]);
fetch(`api/images?code=1f32cb95b1c4b520b4b7d73e0c4d662f`).then(res => {
  res.json().then(data => {
    images.value = data.map((image: string) => `api/image?code=1f32cb95b1c4b520b4b7d73e0c4d662f&image=${image}`)
    console.log(images);
  });
});

function expandPicture(event: MouseEvent) {
  const target = event.target as HTMLElement;
  console.log("expand picture " + event.target?.src);
  target.offsetParent.style.animationPlayState = "running";
  console.log("Scrolled to " + target.src);
}
</script>

<template>
<div class="columns is-multiline">
  <div v-for="image in images" :key="image" class="column is-one-quarter">
    <img @click="expandPicture" :src="image" alt="Image" ratio="4by3" class="thumb">
      <div class="holder">
        <b-icon icon="arrow-expand" size="is-large" custom-class="icon"></b-icon>
      </div>
  </div>
</div>
</template>

<style scoped>
.column {
  position: relative;
  overflow: hidden;
  //animation: selectImage 0.3s forwards;
  animation-iteration-count: 1;
  animation-play-state: paused;
}

.thumb {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.holder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none; /* verhindert, dass Overlay Klicks blockiert; entfernen falls Klicks nötig */
}

.column:hover .holder {
  opacity: 1;
}

.icon {
  color: white;
}

@keyframes selectImage {
  from {
    width: 25%;
  }
  to {
    width: 100%;
    position: absolute;
  }
}
</style>