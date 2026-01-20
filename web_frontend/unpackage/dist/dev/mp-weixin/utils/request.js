"use strict";
const common_vendor = require("../common/vendor.js");
const ENV_ID = "prod-3gsdhmmz4c25f5b7";
const SERVICE_NAME = "flask-24y5";
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("auth_token");
    const header = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
      // 这是一个特殊的 Header，告诉云托管即使没有公网域名也要处理请求
      "X-WX-SERVICE": SERVICE_NAME
    };
    common_vendor.wx$1.cloud.callContainer({
      config: {
        env: ENV_ID
        // 指定环境
      },
      path: options.url,
      // 接口路径 (例如 /api/posts)
      header,
      method: options.method || "GET",
      data: options.data || {},
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          reject(res);
        } else {
          common_vendor.index.showToast({ title: "服务器开小差了", icon: "none" });
          common_vendor.index.__f__("error", "at utils/request.js:39", "API Error:", res);
          reject(res);
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at utils/request.js:44", "Network Error:", err);
        common_vendor.index.showToast({ title: "网络连接失败", icon: "none" });
        reject(err);
      }
    });
  });
};
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
