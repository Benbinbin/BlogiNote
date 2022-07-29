
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
  <img
    ref="image"
    class="mx-auto"
    :src="props.src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    @dblclick="doubleClickHandler"
  >
</template>

<style lang="scss" scoped>
</style>
