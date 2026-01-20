"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/travel/travel.js";
  "./pages/seek/seek.js";
  "./pages/profile/profile.js";
  "./pages/post/post.js";
}
const _sfc_main = {
  onLaunch: function() {
    if (common_vendor.wx$1.cloud) {
      common_vendor.wx$1.cloud.init({
        env: "prod-3gsdhmmz4c25f5b7",
        // 填环境ID
        traceUser: true
      });
    }
    const token = common_vendor.index.getStorageSync("auth_token");
    if (!token) {
      this.doLogin();
    } else {
      common_vendor.index.__f__("log", "at App.vue:18", "已登录");
    }
  },
  methods: {
    doLogin() {
      common_vendor.index.login({
        provider: "weixin",
        success: (loginRes) => {
          this.$http({
            url: "/api/auth/login",
            method: "POST",
            data: { code: loginRes.code }
          }).then((res) => {
            common_vendor.index.setStorageSync("auth_token", res.token);
            common_vendor.index.setStorageSync("user_profile", res.user);
            common_vendor.index.__f__("log", "at App.vue:36", "登录成功", res.user);
          }).catch((err) => {
            common_vendor.index.__f__("error", "at App.vue:38", "登录失败", err);
          });
        }
      });
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$http = utils_request.request;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
