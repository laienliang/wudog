<template>
  <svg
    :viewBox="viewBox"
    :width="sizePx"
    :height="sizePx"
    :style="{ color, display: 'block' }"
    aria-hidden="true"
  >
    <g :fill="filled ? 'currentColor' : 'none'" :stroke="filled ? 'none' : 'currentColor'" :stroke-width="strokeWidth">
      <template v-if="name === 'search'">
        <circle cx="30" cy="30" r="15" :fill="filled ? 'currentColor' : 'none'" />
        <path d="M43 43l18 18" stroke-linecap="round" stroke-linejoin="round" />
      </template>

      <template v-else-if="name === 'cart'">
        <path d="M14 16h5l4 20h21l4-14H22" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="26" cy="41" r="2.5" />
        <circle cx="38" cy="41" r="2.5" />
      </template>

      <path v-else-if="name === 'heart'" d="M32 50c-1.4-1.2-15-11.4-15-22.2C17 21.6 21 18 25.9 18c3.1 0 5.8 1.6 7.2 4.1C34.5 19.6 37.2 18 40.3 18 45.2 18 49 21.6 49 27.8 49 38.6 33.4 48.8 32 50Z" stroke-linejoin="round" />
      <path v-else-if="name === 'heart-fill'" d="M32 50c-1.4-1.2-15-11.4-15-22.2C17 21.6 21 18 25.9 18c3.1 0 5.8 1.6 7.2 4.1C34.5 19.6 37.2 18 40.3 18 45.2 18 49 21.6 49 27.8 49 38.6 33.4 48.8 32 50Z" />

      <path v-else-if="name === 'share'" d="M36 18l12 12-12 12M48 30H24c-6.6 0-12 5.4-12 12v4" stroke-linecap="round" stroke-linejoin="round" />

      <path v-else-if="name === 'comment'" d="M15 17h34v24H32l-10 8v-8H15z" stroke-linejoin="round" />

      <template v-else-if="name === 'order'">
        <path d="M18 14h28v36H18z" stroke-linejoin="round" />
        <path d="M24 22h16M24 30h16M24 38h10" stroke-linecap="round" />
      </template>

      <path v-else-if="name === 'user'" d="M32 33c-7 0-12-5-12-12s5-12 12-12 12 5 12 12-5 12-12 12Zm0 4c-10 0-18 6-20 16h40c-2-10-10-16-20-16Z" stroke-linejoin="round" />

      <path v-else-if="name === 'arrow-right'" d="M24 18l14 14-14 14" stroke-linecap="round" stroke-linejoin="round" />
      <path v-else-if="name === 'plus'" d="M32 16v32M16 32h32" stroke-linecap="round" />
      <path v-else-if="name === 'minus'" d="M18 32h28" stroke-linecap="round" />
      <path v-else-if="name === 'check'" d="M17 33l10 10 19-22" stroke-linecap="round" stroke-linejoin="round" />

      <template v-else-if="name === 'location'">
        <path d="M32 49s14-13.8 14-23.6C46 17 39.7 11 32 11S18 17 18 25.4C18 35.2 32 49 32 49Z" stroke-linejoin="round" />
        <circle cx="32" cy="26" r="5" />
      </template>

      <template v-else-if="name === 'calendar'">
        <path d="M18 16h28v32H18z" stroke-linejoin="round" />
        <path d="M24 12v8M40 12v8M18 24h28" stroke-linecap="round" />
      </template>

      <template v-else-if="name === 'ticket'">
        <path d="M16 22h32v8a6 6 0 0 0 0 12v8H16v-8a6 6 0 0 0 0-12z" stroke-linejoin="round" />
        <path d="M28 22v28" stroke-linecap="round" stroke-dasharray="3 4" />
      </template>

      <template v-else-if="name === 'camera'">
        <path d="M18 21h10l4-6h8l4 6h10v28H18z" stroke-linejoin="round" />
        <circle cx="32" cy="36" r="8" />
      </template>

      <template v-else-if="name === 'wallet'">
        <path d="M16 20h28c4.4 0 8 3.6 8 8v16H16c-2.2 0-4-1.8-4-4V24c0-2.2 1.8-4 4-4Z" stroke-linejoin="round" />
        <path d="M44 29h8v10h-8c-2.8 0-5-2.2-5-5s2.2-5 5-5Z" stroke-linejoin="round" />
      </template>

      <template v-else-if="name === 'home'">
        <path d="M16 30l16-14 16 14v18H16z" stroke-linejoin="round" />
        <path d="M26 48V36h12v12" stroke-linejoin="round" />
      </template>

      <path v-else-if="name === 'category'" d="M14 14h16v16H14zM34 14h16v16H34zM14 34h16v16H14zM34 34h16v16H34z" stroke-linejoin="round" />

      <path v-else-if="name === 'community'" d="M14 18h36v22H28l-10 8v-8H14z" stroke-linejoin="round" />

      <path v-else-if="name === 'mine'" d="M32 18c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10Zm-14 30c2-8 8.6-12 14-12s12 4 14 12" stroke-linejoin="round" />

      <template v-else-if="name === 'login'">
        <path d="M18 16h14v8H26v16h6v8H18z" stroke-linejoin="round" />
        <path d="M34 32h14M42 24l8 8-8 8" stroke-linecap="round" stroke-linejoin="round" />
      </template>

      <path v-else-if="name === 'phone'" d="M23 14h18l4 8-6 4c2.2 4.6 5.8 8.2 10 10l4-6 8 4v18c-17 0-31-14-31-31z" stroke-linejoin="round" />

      <path v-else-if="name === 'publish'" d="M18 46h28M24 40l22-22 8 8-22 22-10 2z" stroke-linejoin="round" />

      <path v-else-if="name === 'profile'" d="M32 33c-7 0-12-5-12-12s5-12 12-12 12 5 12 12-5 12-12 12Zm0 4c-10 0-18 6-20 16h40c-2-10-10-16-20-16Z" stroke-linejoin="round" />

      <template v-else-if="name === 'address'">
        <path d="M18 24h28v18H18z" stroke-linejoin="round" />
        <path d="M24 24l8-10 8 10" stroke-linecap="round" stroke-linejoin="round" />
      </template>

      <template v-else-if="name === 'album'">
        <path d="M16 18h32v28H16z" stroke-linejoin="round" />
        <path d="M20 40l8-10 6 8 4-4 6 6" stroke-linecap="round" stroke-linejoin="round" />
      </template>

      <path v-else-if="name === 'star'" d="M32 14l5.9 11.9 13.1 1.9-9.5 9.3 2.2 13.1L32 43.9 20.3 50l2.2-13.1-9.5-9.3 13.1-1.9z" stroke-linejoin="round" />

      <template v-else-if="name === 'clock'">
        <path d="M32 14a18 18 0 1 0 0 36 18 18 0 1 0 0-36Z" stroke-linejoin="round" />
        <path d="M32 22v12l8 5" stroke-linecap="round" stroke-linejoin="round" />
      </template>

      <path v-else-if="name === 'chef'" d="M20 26a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 4-3 7-7 8v12H27V34c-4-1-7-4-7-8Z" stroke-linejoin="round" />

      <template v-else-if="name === 'clothing'">
        <path d="M22 16h20l6 8-7 6v20H23V30l-7-6z" stroke-linejoin="round" />
        <path d="M26 17c1.4 4 3.4 6 6 6s4.6-2 6-6" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M28 33h8M28 40h8" stroke-linecap="round" />
        <path d="M18 24l5 6M46 24l-5 6" stroke-linecap="round" />
      </template>

      <template v-else-if="name === 'food'">
        <path d="M20 30h28v4c0 8-6 14-14 14s-14-6-14-14z" stroke-linejoin="round" />
        <path d="M18 48h32" stroke-linecap="round" />
        <path d="M22 23c3-5 17-5 20 0" stroke-linecap="round" />
        <path d="M18 18v13M24 18v13M21 18v13M46 18v31" stroke-linecap="round" />
      </template>

      <template v-else-if="name === 'lodging'">
        <path d="M16 30l16-14 16 14" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 30v19h24V30" stroke-linejoin="round" />
        <path d="M26 49V36h12v13" stroke-linejoin="round" />
        <path d="M16 38h32M21 24l22 22M43 24L21 46" stroke-linecap="round" opacity="0.64" />
      </template>

      <template v-else-if="name === 'travel'">
        <path d="M12 46c6-8 11-12 16-12 4 0 6 3 9 3 4 0 7-5 15-19" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 48h38" stroke-linecap="round" />
        <path d="M28 24l5-8 5 8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M34 16v24" stroke-linecap="round" />
        <circle cx="46" cy="18" r="4" />
      </template>

      <template v-else-if="name === 'scenic'">
        <path d="M12 46l14-24 10 16 6-10 10 18z" stroke-linejoin="round" />
        <path d="M19 46c5-5 8-6 13-3 5 3 9 2 14-3" stroke-linecap="round" />
        <circle cx="47" cy="18" r="5" />
      </template>

      <template v-else-if="name === 'agriculture'">
        <path d="M32 48V20" stroke-linecap="round" />
        <path d="M32 30c-8 0-13-4-16-12 9 0 14 4 16 12Z" stroke-linejoin="round" />
        <path d="M32 38c8 0 13-4 16-12-9 0-14 4-16 12Z" stroke-linejoin="round" />
        <path d="M21 48h22" stroke-linecap="round" />
      </template>

      <path v-else d="M16 32h32" stroke-linecap="round" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: 'arrow-right' },
  size: { type: [Number, String], default: 32 },
  color: { type: String, default: 'currentColor' },
  filled: { type: Boolean, default: false },
  strokeWidth: { type: [Number, String], default: 2.2 },
})

const sizePx = computed(() => `${Number(props.size) || 32}px`)
const viewBox = '0 0 64 64'
</script>
