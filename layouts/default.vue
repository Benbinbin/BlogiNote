<script setup lang="ts">
const appConfig = useAppConfig()

/**
 *
 * set head meta for almost all page
 *
 */
useHead({
  style: [
    {
      type: 'text/css',
      children: 'html, body { scroll-behavior: smooth }'
    },
    {
      type: 'text/css',
      children: 'body { overflow: overlay }'
    }
  ],
  link: [
    {
      rel: 'icon',
      href: appConfig.theme.favicon
    }
  ]
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style lang="scss">
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(156, 163, 175, 1);
  border: 3px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 1);
}
</style>
