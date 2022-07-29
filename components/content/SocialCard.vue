<script setup lang="ts">
const props = defineProps<{
    name: string,
    nameClass?: string,
    url?: string,
    iconName?: string,
    iconClass?: string,
    imagePath?: string,
    imageClass?: string,
    cardClass?: string,
}>()
</script>

<template>
  <a
    :href="props.url ? props.url : '#'"
    :target="props.url ? '_blank' : '_self'"
    class="social-card"
    :class="props.cardClass ? props.cardClass : 'p-4 flex flex-col justify-center items-center space-y-2 hover:bg-gray-100 transition-colors duration-300 border rounded'"
  >
    <div class="grow flex justify-center items-center">
      <IconCustom
        v-if="props.iconName"
        :name="props.iconName"
        :class="props.iconClass ? props.iconClass :'w-10 h-10'"
      />
      <img v-else-if="props.imagePath" :src="props.imagePath" :alt="props.name" class="w-20">
      <IconCustom v-else name="ion:share-social" :class="props.iconClass ? props.iconClass :'w-10 h-10'" />
    </div>

    <p :class="props.nameClass ? props.nameClass : ''">
      {{ props.name }}
    </p>
  </a>
</template>

<style lang="scss">

.social-card {
  p {
    @apply shrink-0 px-2 text-xs text-center text-gray-500
  }
}
</style>
