<script setup lang="ts">
const props = defineProps<{
  type?: string;
  icon?: string;
  name?: string;
  bgColorClass?: string;
  bgColorStyle?: string;
  textColorClass?: string;
  textColorStyle?: string;
  borderColorClass?: string;
  borderColorStyle?: string;
}>()

// some default types:
// tip
// announce
// warning
// fun
// achieve
// question
// good
// bad
const defaultTypeMap = {
  tip: {
    icon: 'bi:lightbulb-fill',
    name: 'Tip',
    bgColorClass: 'bg-yellow-100',
    textColorClass: 'text-yellow-500',
    borderColorClass: 'border-yellow-400'
  },
  announce: {
    icon: 'bi:megaphone',
    name: 'Announce',
    bgColorClass: 'bg-purple-100',
    textColorClass: 'text-purple-500',
    borderColorClass: 'border-purple-400'
  },
  warning: {
    icon: 'bi:exclamation-triangle-fill',
    name: 'Warning',
    bgColorClass: 'bg-red-100',
    textColorClass: 'text-red-500',
    borderColorClass: 'border-red-400'
  },
  fun: {
    icon: 'bi:balloon-fill',
    name: 'Fun',
    bgColorClass: 'bg-cyan-100',
    textColorClass: 'text-cyan-500',
    borderColorClass: 'border-cyan-300'
  },
  achieve: {
    icon: 'bi:award-fill',
    name: 'Achieve',
    bgColorClass: 'bg-orange-100',
    textColorClass: 'text-orange-500',
    borderColorClass: 'border-orange-200'
  },
  question: {
    icon: 'bi:question-circle-fill',
    name: 'Question',
    bgColorClass: 'bg-fuchsia-100',
    textColorClass: 'text-fuchsia-500',
    borderColorClass: 'border-fuchsia-300'
  },
  good: {
    icon: 'bi:hand-thumbs-up-fill',
    name: 'Good',
    bgColorClass: 'bg-green-100',
    textColorClass: 'text-green-500',
    borderColorClass: 'border-green-300'
  },
  bad: {
    icon: 'bi:hand-thumbs-down-fill',
    name: 'Bad',
    bgColorClass: 'bg-red-100',
    textColorClass: 'text-red-500',
    borderColorClass: 'border-red-300'
  },
  tldr: {
    icon: 'bi:chat-left-text-fill',
    name: 'TL;DR',
    bgColorClass: 'bg-gray-100',
    textColorClass: 'text-gray-700',
    borderColorClass: 'border-gray-300'
  }
}

const iconValue = ref('')
const nameValue = ref('')
const bgColorClassValue = ref('')
const bgColorStyleValue = ref('')
const textColorClassValue = ref('')
const textColorStyleValue = ref('')
const borderColorClassValue = ref('')
const borderColorStyleValue = ref('')

const typeValue = props.type ? props.type.toLowerCase() : ''

if (typeValue) {
  const defaultType = defaultTypeMap[typeValue]
  if (defaultType) {
    iconValue.value = defaultType.icon
    nameValue.value = defaultType.name
    bgColorClassValue.value = defaultType.bgColorClass
    textColorClassValue.value = defaultType.textColorClass
    borderColorClassValue.value = defaultType.borderColorClass
  }
}

if (props.icon) {
  iconValue.value = props.icon
}

if (props.name) {
  nameValue.value = props.name
}

if (props.bgColorClass) {
  bgColorClassValue.value = props.bgColorClass
}

if (props.textColorClass) {
  textColorClassValue.value = props.textColorClass
}

if (props.bgColorStyle) {
  bgColorStyleValue.value = props.bgColorStyle
}

if (props.textColorStyle) {
  textColorStyleValue.value = props.textColorStyle
}

if (props.borderColorClass) {
  borderColorClassValue.value = props.borderColorClass
}

if (props.borderColorStyle) {
  borderColorStyleValue.value = props.borderColorStyle
}

const containerClass = ref('')
const containerStyle = ref('')

if (!nameValue.value) {
  containerClass.value += ' ' + 'flex items-center gap-4'
}

if (bgColorStyleValue.value) {
  containerStyle.value += ' ' + `background-color: ${bgColorClassValue.value};`
} else if (bgColorClassValue.value) {
  containerClass.value += ' ' + bgColorClassValue.value
}

if (textColorStyleValue.value) {
  containerStyle.value += ' ' + `color: ${textColorStyleValue.value};`
} else if (textColorClassValue.value) {
  containerClass.value += ' ' + textColorClassValue.value
}

if (borderColorStyleValue.value) {
  containerStyle.value += ' ' + `border-color: ${borderColorStyleValue.value};`
} else if (borderColorClassValue.value) {
  containerClass.value += ' ' + borderColorClassValue.value
}
</script>

<template>
  <div class="my-4 px-4 lg:px-6 py-2 border rounded-md" :class="containerClass" :style="containerStyle">
    <p v-if="nameValue" class="font-bold flex items-center gap-2">
      <IconCustom v-if="iconValue" :name="iconValue" class="w-4 h-4" />
      <span v-if="nameValue">{{ nameValue }}</span>
    </p>

    <IconCustom v-else-if="iconValue && !nameValue" :name="iconValue" class="w-4 h-4" />
    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped>

</style>
