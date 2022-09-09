<script setup lang="ts">
// refer to https://github.com/Atinux/nuxt-icon
import type { Ref } from 'vue'
import type { IconifyIcon } from '@iconify/vue'
import { Icon as Iconify, loadIcon } from '@iconify/vue'

const props = defineProps<{
  name: string;
  iconClass?: string;
  colorStyle?: string;
  widthStyle?: string;
  heightStyle?: string;
}>()

// icon
const icon: Ref<IconifyIcon | null> = ref(null)

icon.value = await loadIcon(props.name).catch(_ => null)

watch(() => props.name, async () => {
  icon.value = await loadIcon(props.name).catch(_ => null)
})

// class and style value
let iconStyle = ''

if (props.colorStyle) {
  iconStyle += ' ' + `color: ${props.colorStyle}`
}

if (props.widthStyle) {
  iconStyle += ' ' + `width: ${props.widthStyle}`
}

if (props.heightStyle) {
  iconStyle += ' ' + `width: ${props.heightStyle}`
}
</script>

<template>
  <Iconify
    v-if="icon"
    :icon="icon"
    class="inline-block"
    :class="props.iconClass"
    :style="iconStyle"
  />
  <span v-else>{{ name }}</span>
</template>
