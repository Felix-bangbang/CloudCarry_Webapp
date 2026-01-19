"use strict";
const common_vendor = require("../../common/vendor.js");
const wxcomponents_vant_toast_toast = require("../../wxcomponents/vant/toast/toast.js");
const _sfc_main = {
  data() {
    return {
      filterDest: "",
      isShowPopup: false,
      wechatRevealed: false,
      currentItem: {},
      // 图片映射 (和 Travel 页保持一致)
      cityImageMap: {
        "北京": "https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/beijing.jpg?sign=81e9cc12932785bbcb226895d0ff2388&t=1768322246",
        "上海": "https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/shanghai.jpg?sign=1f12e7902c9213ff82bbfdcb07afd871&t=1768322174",
        "伦敦": "https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/london.jpg?sign=365f2858e4bb6ce40f86e3fb402e4df1&t=1768322214",
        "纽约": "https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/newyork.jpg?sign=54adcf9b78283241f09f26f51f135957&t=1768322184",
        "都柏林": "https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/dublin.jpg?sign=c8d637691f61ab4a3267df882571c449&t=1768322225",
        "苏黎世": "https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/zurich.jpg?sign=5f1e8a0e7958c88d478316603872000b&t=1768322143",
        "赫尔辛基": "https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/helsinki.jpg?sign=3f3d9f2f08903c5597005efce4651a10&t=1768322236",
        "墨尔本": "https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/melbourne.jpg?sign=df4c84bb38fcd4f0eb7c2094e8137bdc&t=1768322206"
      },
      defaultImage: "/static/cloudcarry.png",
      // Mock Data (寄件人数据)
      rawData: []
    };
  },
  computed: {
    displayList() {
      if (!this.filterDest)
        return this.rawData;
      return this.rawData.filter((item) => item.destination.includes(this.filterDest));
    }
  },
  onShow() {
    this.fetchList();
  },
  methods: {
    onSearchChange(e) {
      this.filterDest = e.detail;
    },
    onSearch() {
    },
    getCityImage(destination) {
      for (let key in this.cityImageMap) {
        if (destination.includes(key)) {
          return this.cityImageMap[key];
        }
      }
      return this.defaultImage;
    },
    goToPost() {
      common_vendor.index.navigateTo({ url: "/pages/post/post?type=sender" });
    },
    showDetail(item) {
      this.currentItem = item;
      this.wechatRevealed = false;
      this.isShowPopup = true;
    },
    revealWechat() {
      const myInfo = common_vendor.index.getStorageSync("user_profile");
      if (!myInfo || !myInfo.wechat) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先去[我的]页面完善您的微信号",
          confirmText: "去完善",
          success: (res) => {
            if (res.confirm)
              common_vendor.index.switchTab({ url: "/pages/profile/profile" });
          }
        });
        return;
      }
      this.wechatRevealed = true;
    },
    copyWechat() {
      common_vendor.index.setClipboardData({
        data: this.currentItem.wechat,
        success: () => {
          wxcomponents_vant_toast_toast.Toast.success("已复制");
        }
      });
    },
    // 1. 获取列表
    fetchList() {
      common_vendor.index.showLoading({ title: "加载中..." });
      this.$http({
        url: "/api/posts",
        method: "GET",
        data: { type: "sender" }
      }).then((data) => {
        this.rawData = data.map((item) => ({
          ...item,
          capacity: item.capacity || "",
          // 防止 null
          item_desc: item.item_desc || "",
          // 防止 null
          remark: item.remark || ""
          // 防止 null
        }));
        common_vendor.index.hideLoading();
      }).catch(() => {
        common_vendor.index.hideLoading();
        this.rawData = [];
      });
    },
    // 2. 显示微信号（权限逻辑）
    revealWechat() {
      const myInfo = common_vendor.index.getStorageSync("user_profile");
      if (!myInfo || !myInfo.wechat) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先去[我的]页面完善您的微信号",
          confirmText: "去完善",
          success: (res) => {
            if (res.confirm)
              common_vendor.index.switchTab({ url: "/pages/profile/profile" });
          }
        });
        return;
      }
      this.$http({
        url: `/api/posts/${this.currentItem.id}/contact`,
        method: "GET"
      }).then((res) => {
        this.$set(this.currentItem, "wechat", res.wechat);
        this.wechatRevealed = true;
      }).catch((err) => {
        if (err.statusCode === 429) {
          common_vendor.index.showToast({ title: "今日查看次数已达上限", icon: "none" });
        } else {
          common_vendor.index.showToast({ title: "查看失败", icon: "none" });
        }
      });
    }
  }
};
if (!Array) {
  const _component_van_search = common_vendor.resolveComponent("van-search");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_card = common_vendor.resolveComponent("van-card");
  const _component_van_empty = common_vendor.resolveComponent("van-empty");
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_cell = common_vendor.resolveComponent("van-cell");
  const _component_van_cell_group = common_vendor.resolveComponent("van-cell-group");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  const _component_van_toast = common_vendor.resolveComponent("van-toast");
  (_component_van_search + _component_van_button + _component_van_card + _component_van_empty + _component_van_icon + _component_van_cell + _component_van_cell_group + _component_van_popup + _component_van_toast)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onSearchChange),
    b: common_vendor.o($options.onSearch),
    c: common_vendor.p({
      value: $data.filterDest,
      placeholder: "搜索目的地 (如: 都柏林)",
      useActionSlot: true
    }),
    d: common_vendor.f($options.displayList, (item, index, i0) => {
      return {
        a: $options.getCityImage(item.destination),
        b: common_vendor.o(($event) => $options.showDetail(item), index),
        c: common_vendor.t(item.origin),
        d: common_vendor.t(item.destination),
        e: common_vendor.o(($event) => $options.showDetail(item), index),
        f: common_vendor.t(item.date),
        g: common_vendor.t(item.item_desc),
        h: common_vendor.o(($event) => $options.showDetail(item), index),
        i: common_vendor.o(($event) => $options.showDetail(item), index),
        j: "8571a17e-2-" + i0 + "," + ("8571a17e-1-" + i0),
        k: "8571a17e-1-" + i0,
        l: index
      };
    }),
    e: common_vendor.p({
      size: "small",
      type: "primary",
      round: true,
      color: "#7dc5eb"
    }),
    f: common_vendor.p({
      useThumbSlot: true,
      useTitleSlot: true,
      useFooterSlot: true
    }),
    g: $options.displayList.length === 0
  }, $options.displayList.length === 0 ? {
    h: common_vendor.p({
      description: "暂无相关需求"
    })
  } : {}, {
    i: common_vendor.p({
      name: "plus",
      color: "white",
      size: "30px"
    }),
    j: common_vendor.o((...args) => $options.goToPost && $options.goToPost(...args)),
    k: common_vendor.p({
      title: "物品所在地",
      value: $data.currentItem.origin || ""
    }),
    l: common_vendor.p({
      title: "送达目的地",
      value: $data.currentItem.destination || ""
    }),
    m: common_vendor.p({
      title: "期望日期",
      value: $data.currentItem.date || ""
    }),
    n: common_vendor.p({
      title: "物品描述",
      value: $data.currentItem.item_desc || ""
    }),
    o: common_vendor.p({
      title: "备注",
      label: $data.currentItem.remark || ""
    }),
    p: !$data.wechatRevealed
  }, !$data.wechatRevealed ? {
    q: common_vendor.o($options.revealWechat),
    r: common_vendor.p({
      type: "primary",
      color: "#7dc5eb",
      block: true,
      round: true
    })
  } : {
    s: common_vendor.t($data.currentItem.wechat),
    t: common_vendor.o($options.copyWechat),
    v: common_vendor.p({
      size: "small",
      type: "info",
      color: "#7dc5eb"
    })
  }, {
    w: common_vendor.o(($event) => $data.isShowPopup = false),
    x: common_vendor.p({
      show: $data.isShowPopup,
      round: true,
      position: "bottom",
      customStyle: "height: 60%"
    }),
    y: common_vendor.p({
      id: "van-toast"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/seek/seek.js.map
