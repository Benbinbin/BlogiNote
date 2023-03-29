<script setup lang="ts">
const props = defineProps<{
  date: string;
  type: 'created' | 'last updated'
}>()

// const themeOptions = useTheme()
const appConfig = useAppConfig()

// the default outdated time threshold of an article is 1 month (30 days)
const outdatedThreshold = appConfig.bloginote.articlePage.outdated.threshold || 30

const nowDate = new Date()
const preDate = new Date(props.date)
const intervalDays = Math.floor((nowDate.getTime() - preDate.getTime()) / (1000 * 60 * 60 * 24))

const showOutdatedWarning = ref(false)
if (intervalDays > outdatedThreshold) {
  showOutdatedWarning.value = true
}
</script>

<template>
  <div
    v-if="showOutdatedWarning"
    class="w-fit mx-auto mb-2 px-2 py-1 flex items-center gap-1 text-xs text-red-300 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded transition-colors duration-30"
  >
    <IconCustom
      name="bi:exclamation-triangle-fill"
      class="shrink-0 w-4 h-4"
    />
    <p class="text-center">
      {{ intervalDays }} day(s) have passed since this article {{ props.type }} and it may be outdated
    </p>
  </div>
</template>

<style scoped>

</style>
