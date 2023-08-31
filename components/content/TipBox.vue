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
  boxClass?: string;
  boxStyle?: string;
  open?: string;
}>()

interface DefaultTypeItem {
  icon: string;
  name: string;
  boxClass: string;
}

interface DefaultType {
  [propName: string]: DefaultTypeItem
}

/**
 * some default types for TipBox
 */
// tip
// announce
// warning
// fun
// achieve
// question
// good
// bad
const defaultTypeMap: DefaultType = {
  tip: {
    icon: 'bi:lightbulb-fill',
    name: 'Tip',
    boxClass: 'text-amber-500 bg-amber-50 border-amber-400'
  },
  announce: {
    icon: 'bi:megaphone-fill',
    name: 'Announce',
    boxClass: 'text-purple-600 bg-purple-50 border-purple-400'
  },
  warning: {
    icon: 'bi:exclamation-triangle-fill',
    name: 'Warning',
    boxClass: 'text-red-500 bg-red-50 border-red-400'
  },
  fun: {
    icon: 'bi:balloon-fill',
    name: 'Fun',
    boxClass: 'text-sky-600 bg-cyan-50 border-cyan-400'
  },
  achieve: {
    icon: 'bi:award-fill',
    name: 'Achieve',
    boxClass: 'text-orange-600 bg-orange-50 border-orange-400'
  },
  question: {
    icon: 'bi:question-circle-fill',
    name: 'Question',
    boxClass: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-400'
  },
  good: {
    icon: 'bi:hand-thumbs-up-fill',
    name: 'Good',
    boxClass: 'text-green-600 bg-green-100 border-green-500'
  },
  bad: {
    icon: 'bi:hand-thumbs-down-fill',
    name: 'Bad',
    boxClass: 'text-red-500 bg-red-50 border-red-400'
  },
  tldr: {
    icon: 'bi:chat-left-text-fill',
    name: 'TL;DR',
    boxClass: 'text-gray-800 bg-gray-100 border-gray-400'
  }
}

const openState = ref(props.open ? props.open === 'true' : true)
const iconValue = ref('')
const nameValue = ref('')
const bgColorClassValue = ref('')
const bgColorStyleValue = ref('')
const textColorClassValue = ref('')
const textColorStyleValue = ref('')
const borderColorClassValue = ref('')
const borderColorStyleValue = ref('')
const boxClassValue = ref('')
const boxStyleValue = ref('')

const typeValue = props.type ? props.type.toLowerCase() : ''

if (typeValue) {
  const defaultType = defaultTypeMap[typeValue]
  if (defaultType) {
    iconValue.value = defaultType.icon
    nameValue.value = defaultType.name
    boxClassValue.value = defaultType.boxClass
  }
}

if (props.icon) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  iconValue.value = props.icon
}

if (props.name) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  nameValue.value = props.name
}

if (props.bgColorClass) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  bgColorClassValue.value = props.bgColorClass
}

if (props.textColorClass) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  textColorClassValue.value = props.textColorClass
}

if (props.bgColorStyle) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  bgColorStyleValue.value = props.bgColorStyle
}

if (props.textColorStyle) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  textColorStyleValue.value = props.textColorStyle
}

if (props.borderColorClass) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  borderColorClassValue.value = props.borderColorClass
}

if (props.borderColorStyle) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  borderColorStyleValue.value = props.borderColorStyle
}

if(props.boxClass) {
  boxClassValue.value = props.boxClass
}

if(props.boxStyle) {
  boxStyleValue.value = props.boxStyle
}

// combine the class and style props to a string
const containerClass = ref('')
const containerStyle = ref('')

if (!nameValue.value) {
  containerClass.value += ' ' + 'flex items-center gap-4'
}

// style setting has higher priority than class setting
if (bgColorStyleValue.value) {
  containerStyle.value += ' ' + `background-color: ${bgColorStyleValue.value};`
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

// boxClass and boxStyle will rewrite the other class and style setting
if(boxClassValue.value) {
  containerClass.value = boxClassValue.value
}

if(boxStyleValue.value) {
  containerStyle.value = boxStyleValue.value
}
</script>

<template>
  <details
    class="my-4 px-4 lg:px-6 py-2 border rounded-md"
    :class="containerClass"
    :style="containerStyle"
    :open="openState"
  >
    <!-- box header -->
    <summary
      class="my-4 font-bold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-300"
    >
      <IconCustom
        :name="iconValue || 'bi:lightbulb-fill'"
        class="w-4 h-4"
      />
      <span>{{ nameValue || 'Tip' }}</span>
    </summary>

    <!-- box content -->
    <div>
      <slot />
    </div>
  </details>
</template>

<style scoped>

</style>
