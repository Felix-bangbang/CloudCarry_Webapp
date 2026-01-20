"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../wxcomponents/vant/toast/toast.js");
const _sfc_main = {
  data() {
    return {
      // 默认灰色头像
      defaultAvatar: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2SJPGic3TB3C3uhG7uP629BTf20F-ExeFAb/0",
      profile: {
        wechat: "",
        phone: "",
        avatar: "",
        nickname: ""
      }
    };
  },
  onShow() {
    const saved = common_vendor.index.getStorageSync("user_profile");
    if (saved) {
      this.profile = {
        ...this.profile,
        ...saved,
        // 强制把 null 转为空字符串
        wechat: saved.wechat || "",
        phone: saved.phone || "",
        nickname: saved.nickname || "",
        avatar: saved.avatar || ""
      };
    }
  },
  methods: {
    onWechatInput(e) {
      this.profile.wechat = e.detail;
    },
    onPhoneInput(e) {
      this.profile.phone = e.detail;
    },
    // 1. 处理头像 (只存本地临时路径)
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      this.profile.avatar = avatarUrl;
    },
    // 2. 处理昵称 (只存本地)
    onNicknameChange(e) {
      this.profile.nickname = e.detail.value;
    },
    saveProfile() {
      if (!this.profile.wechat) {
        common_vendor.index.showToast({ title: "微信号不能为空", icon: "none" });
        return;
      }
      this.$http({
        url: "/api/user/profile",
        method: "POST",
        data: {
          contact_wechat: this.profile.wechat,
          contact_phone: this.profile.phone
        }
      }).then((res) => {
        common_vendor.index.setStorageSync("user_profile", this.profile);
        common_vendor.index.showToast({ title: "保存成功" });
      }).catch(() => {
        common_vendor.index.showToast({ title: "保存失败", icon: "none" });
      });
    }
  }
};
if (!Array) {
  const _component_van_field = common_vendor.resolveComponent("van-field");
  const _component_van_cell_group = common_vendor.resolveComponent("van-cell-group");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_toast = common_vendor.resolveComponent("van-toast");
  (_component_van_field + _component_van_cell_group + _component_van_button + _component_van_toast)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.profile.avatar || $data.defaultAvatar,
    b: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    c: $data.profile.nickname,
    d: common_vendor.o((...args) => $options.onNicknameChange && $options.onNicknameChange(...args)),
    e: common_vendor.o((...args) => $options.onNicknameChange && $options.onNicknameChange(...args)),
    f: common_vendor.o($options.onWechatInput),
    g: common_vendor.p({
      value: $data.profile.wechat,
      label: "微信号",
      placeholder: "请输入您的微信号"
    }),
    h: common_vendor.o($options.onPhoneInput),
    i: common_vendor.p({
      value: $data.profile.phone,
      label: "手机号",
      placeholder: "选填"
    }),
    j: common_vendor.o($options.saveProfile),
    k: common_vendor.p({
      type: "info",
      color: "#7dc5eb",
      block: true,
      round: true
    }),
    l: common_vendor.p({
      id: "van-toast"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
