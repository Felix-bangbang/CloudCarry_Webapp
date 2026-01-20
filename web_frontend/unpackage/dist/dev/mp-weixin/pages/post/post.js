"use strict";
const common_vendor = require("../../common/vendor.js");
const wxcomponents_vant_toast_toast = require("../../wxcomponents/vant/toast/toast.js");
const _sfc_main = {
  data() {
    return {
      type: "traveler",
      // 默认值，通过页面参数修改
      today: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      form: { origin: "", destination: "", date: "", capacity: "", item_desc: "", remark: "" }
    };
  },
  onLoad(options) {
    if (options.type) {
      this.type = options.type;
    }
  },
  methods: {
    onInput(key, e) {
      this.form[key] = e.detail;
    },
    bindDateChange(e) {
      this.form.date = e.detail.value;
    },
    submit() {
      if (!this.form.origin || !this.form.destination || !this.form.date) {
        wxcomponents_vant_toast_toast.Toast.fail("请完善核心信息");
        return;
      }
      const myInfo = common_vendor.index.getStorageSync("user_profile");
      if (!myInfo || !myInfo.wechat) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先去[我的]页面完善微信号",
          success: (res) => {
            if (res.confirm)
              common_vendor.index.switchTab({ url: "/pages/profile/profile" });
          }
        });
        return;
      }
      common_vendor.index.showLoading({ title: "发布中..." });
      const postData = {
        type: this.type,
        // 'traveler' 或 'sender'
        origin: this.form.origin,
        destination: this.form.destination,
        date: this.form.date,
        // 如果是旅行者传 capacity，如果是云捎传 item_desc
        capacity: this.type === "traveler" ? this.form.capacity : null,
        item_desc: this.type === "sender" ? this.form.item_desc : null,
        remark: this.form.remark
      };
      this.$http({
        url: "/api/posts",
        method: "POST",
        data: postData
      }).then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "发布成功" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "发布失败：内容可能包含违规词", icon: "none" });
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
  return common_vendor.e({
    a: common_vendor.t($data.type === "traveler" ? "出行信息" : "寻捎需求"),
    b: common_vendor.o(($event) => $options.onInput("origin", $event)),
    c: common_vendor.p({
      value: $data.form.origin,
      label: "出发地",
      placeholder: "例如：上海"
    }),
    d: common_vendor.o(($event) => $options.onInput("destination", $event)),
    e: common_vendor.p({
      value: $data.form.destination,
      label: "目的地",
      placeholder: "例如：伦敦"
    }),
    f: common_vendor.p({
      value: $data.form.date,
      label: "日期",
      placeholder: "点击选择日期",
      readonly: true,
      isLink: true
    }),
    g: $data.today,
    h: common_vendor.o((...args) => $options.bindDateChange && $options.bindDateChange(...args)),
    i: $data.type === "traveler"
  }, $data.type === "traveler" ? {
    j: common_vendor.o(($event) => $options.onInput("capacity", $event)),
    k: common_vendor.p({
      value: $data.form.capacity,
      label: "可用重量",
      placeholder: "例如：1kg"
    })
  } : {
    l: common_vendor.o(($event) => $options.onInput("item_desc", $event)),
    m: common_vendor.p({
      value: $data.form.item_desc,
      label: "物品描述",
      placeholder: "例如：几件衣服，一双鞋...."
    })
  }, {
    n: common_vendor.o(($event) => $options.onInput("remark", $event)),
    o: common_vendor.p({
      value: $data.form.remark,
      label: "其它要求",
      type: "textarea",
      placeholder: "请输入备注信息...",
      autosize: true
    }),
    p: common_vendor.o($options.submit),
    q: common_vendor.p({
      type: "primary",
      color: "#7dc5eb",
      block: true,
      round: true
    }),
    r: common_vendor.p({
      id: "van-toast"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post/post.js.map
