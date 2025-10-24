<script setup lang="ts">
import {ref, watch} from "vue";
import {BIcon} from "buefy";

const images = ref<string[]>([]);
const showBackdrop = ref(false);
const scrollEnabled = ref(true);

fetch(`api/images?code=1f32cb95b1c4b520b4b7d73e0c4d662f`).then(res => {
  res.json().then(data => {
    images.value = data.map((image: string) => `api/image?code=1f32cb95b1c4b520b4b7d73e0c4d662f&image=${image}`)
    console.log(images);
  });
});

function expandPicture(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const column = target.parentElement;
  const expandImage = column.cloneNode(true) as HTMLElement;
  expandImage.style.width = `auto`;
  expandImage.style.height = `${column.offsetHeight}px`;
  expandImage.style.zIndex = '5';
  expandImage.style.position = 'absolute';
  expandImage.style.top = `${column?.offsetTop}px`;
  expandImage.style.left = `${column?.offsetLeft}px`;
  expandImage.classList.add('expanded-image');
  expandImage.removeChild(expandImage.querySelector('.holder'));
  expandImage.style.setProperty('--top-position-expanded', `${window.scrollY + (window.innerHeight * 0.075)}px`);
  column.style.opacity = 0;
  column.parentElement.appendChild(expandImage);
  showBackdrop.value = true;
  scrollEnabled.value = false;
  requestAnimationFrame(() => {
    expandImage.classList.add('expanded');
  });
}

// Scroll-Lock ohne position: fixed
function lockScroll() {
  document.body.setAttribute('data-scroll-y', String(window.scrollY));
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  const y = Number(document.body.getAttribute('data-scroll-y') || '0');
  document.body.removeAttribute('data-scroll-y');
  window.scrollTo(0, y);
}

watch(scrollEnabled, (val) => {
  if (!val) {
    lockScroll();
  } else {
    unlockScroll();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && showBackdrop.value) {
    const expandedImage = document.querySelector('.expanded-image');
    if (expandedImage) {
      expandedImage.style.setProperty('--original-height', `${expandedImage.style.height}`);
      expandedImage.style.setProperty('--original-top', `${expandedImage.style.top}`);
      expandedImage.style.setProperty('--original-left', `${expandedImage.style.left}`);
      expandedImage.style.height = `${expandedImage.clientHeight}px`;
      expandedImage.style.top = `${expandedImage.offsetTop}px`;
      expandedImage.style.left = `${expandedImage.offsetLeft}px`;
      expandedImage.classList.remove('expanded');
      expandedImage.classList.add('shrinking');
      expandedImage.addEventListener('animationend', () => {
        const originalColumn = Array.from(document.querySelectorAll('.column')).find(col => {
          const img = col.querySelector('img');
          const expandedImg = expandedImage.querySelector('img');
          return img?.getAttribute('src') === expandedImg?.getAttribute('src');
        });
        if (originalColumn) {
          originalColumn.style.opacity = '1';
        }
        expandedImage.remove();
      }, {once: true});
    }
    showBackdrop.value = false;
    scrollEnabled.value = true;
  }
})
</script>

<template>
  <div v-show="showBackdrop" class="backdrop"></div>
  <div class="columns is-multiline">
    <div v-for="image in images" :key="image" class="column is-one-quarter">
      <img @click="expandPicture" :src="image" alt="Image" class="thumb">
      <div class="info-box">Test</div>
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
  background: rgba(0, 0, 0, 0.5);
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

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 4;
}

.info-box {
  position: absolute;
  left: 102%;
  width: 30%;
  height: 90%;
  border-radius: 10px;
  top: 5%;
  background: #ffffff;
  color: white;
  z-index: 6;
}


.column.expanded-image {
  overflow: visible;

  &.expanded {
    animation: expandImage 0.5s forwards;
  }

  &.shrinking {
    animation: shrinking 0.3s forwards;
  }
}

@keyframes expandImage {
  to {
    height: 90%;
    top: var(--top-position-expanded);
    left: 5%;
  }
}

@keyframes shrinking {
  to {
    height: var(--original-height);
    top: var(--original-top);
    left: var(--original-left);
  }
}

:root {
  --top-position-expanded: 7.5%;
  --original-height: 0px;
  --original-top: 0px;
  --original-left: 0px;
}
</style>