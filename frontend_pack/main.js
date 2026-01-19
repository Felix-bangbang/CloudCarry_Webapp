import App from './App'

// 从 'vue' 中引入 createSSRApp
import { createSSRApp } from 'vue'
// 引入封装好的请求工具
import request from './utils/request.js'

export function createApp() {
  const app = createSSRApp(App)
  
  // 挂载全局请求方法
  app.config.globalProperties.$http = request
  
  return {
    app
  }
}