"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _component_van_panel = common_vendor.resolveComponent("van-panel");
  _component_van_panel();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      title: "关于本程序",
      desc: "2026-01-08",
      status: "置顶"
    }),
    b: common_vendor.p({
      title: "更新通知",
      desc: "2026-01-14"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
