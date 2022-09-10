
<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
})

const image = ref(null)

const showZoomImage = useShowZoomImage()
const zoomImage = useZoomImage()
const currentZoomImage = useCurrentZoomImage()

// click to set zoom image
// the ligtbox which contains a copy of this image will enlarge as large as possible to the page center
const doubleClickHandler = () => {
  if (image.value) {
    const imageRect = image.value.getBoundingClientRect()
    zoomImage.value = {
      src: props.src,
      width: imageRect.width,
      height: imageRect.height,
      x: imageRect.x,
      y: imageRect.y
    }

    currentZoomImage.value = zoomImage.value
    showZoomImage.value = 'show'
  }
}

</script>

<template>
  <figure class="my-2">
    <img
      ref="image"
      class="mx-auto my-2"
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      @dblclick="doubleClickHandler"
    >
    <figcaption v-if="props.alt" class="text-sm text-center font-light italic">
      {{ props.alt }}
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
</style>
