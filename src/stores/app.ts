import { defineStore } from 'pinia'

/** 脚手架自带的示例状态容器：应用级常量放在这里，避免各组件重复定义。 */
export const useAppStore = defineStore('app', {
  state: () => ({
    title: 'Learn App 脚手架',
  }),
})
