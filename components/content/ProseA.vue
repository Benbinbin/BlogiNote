<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String,
    default: undefined,
    required: false
  }
})

const isRelative = /^(\.\/|\.\.\/|\/|@\/|~\/)/.test(props.href)
const isAssetType = ref(false)

if(isRelative) {
  const appConfig = useAppConfig()
  const extensionArr = appConfig.bloginote.assetTypes

  const result = props.href.match(/\.(\w+)$/)

  if(result) {
    const ext = result[1]
    isAssetType.value = extensionArr.includes(ext)
  }
}
</script>

<template>
  <NuxtLink
    :href="href"
    :target="isRelative && isAssetType ? '_blank' : target"
    :external="isRelative && isAssetType"
  >
    <slot />
  </NuxtLink>
</template>