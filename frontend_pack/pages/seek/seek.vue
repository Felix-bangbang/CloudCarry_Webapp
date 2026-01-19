<template>
	<view class="container">
		<view class="filter-box">
			<van-search 
				:value="filterDest" 
				placeholder="搜索目的地 (如: 都柏林)" 
				use-action-slot 
				@change="onSearchChange" 
				@search="onSearch"
			>
			</van-search>
		</view>

		<view class="list-box">
			<block v-for="(item, index) in displayList" :key="index">
				<van-card
					use-thumb-slot
					use-title-slot
					use-footer-slot
				>
					<view slot="thumb" class="city-thumb" @click="showDetail(item)">
						<image 
							:src="getCityImage(item.destination)" 
							mode="aspectFill" 
							class="thumb-image"
						/>
					</view>

					<view slot="title" class="card-title-box" @click="showDetail(item)">
						<text class="origin-text">{{ item.origin }}</text>
						<text class="fly-icon"> ➡️ </text> <text class="dest-text">{{ item.destination }}</text>
					</view>

					<view slot="desc" class="card-desc-box" @click="showDetail(item)">
						<view class="date-row">期望日期: {{ item.date }}</view>
						<view class="item-row">{{ item.item_desc }}</view>
					</view>

					<view slot="footer">
						<van-button 
							size="small" 
							type="primary" 
							round 
							color="#7dc5eb"
							@click.stop="showDetail(item)"
						>
							查看需求详情
						</van-button>
					</view>
				</van-card>
				
				<view style="height: 10px;"></view> </block>
			
            <van-empty v-if="displayList.length === 0" description="暂无相关需求" />
		</view>

		<view class="fab-button" @click="goToPost">
			<van-icon name="plus" color="white" size="30px" />
		</view>

		<van-popup :show="isShowPopup" round position="bottom" custom-style="height: 60%" @close="isShowPopup = false">
			<view class="popup-content">
				<view class="popup-title">需求详情</view>
				<van-cell-group>
					<van-cell title="物品所在地" :value="currentItem.origin || ''" />
					<van-cell title="送达目的地" :value="currentItem.destination || ''" />
					<van-cell title="期望日期" :value="currentItem.date || ''" />
					<van-cell title="物品描述" :value="currentItem.item_desc || ''" />
					<van-cell title="备注" :label="currentItem.remark || ''" />
				</van-cell-group>
				
				<view style="padding: 20px; margin-top: 20px;">
					<van-button v-if="!wechatRevealed" type="primary" color="#7dc5eb" block round @click="revealWechat">显示微信号</van-button>
					
					<view v-else class="wechat-box">
						<text class="wx-text">微信号：{{ currentItem.wechat }}</text>
						<van-button size="small" type="info" color="#7dc5eb" @click="copyWechat">复制</van-button>
					</view>
				</view>
			</view>
		</van-popup>
		
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '/wxcomponents/vant/toast/toast';
	
	export default {
		data() {
			return {
				filterDest: '',
				isShowPopup: false,
				wechatRevealed: false,
				currentItem: {},
				// 图片映射 (和 Travel 页保持一致)
				cityImageMap: {
					'北京': 'https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/beijing.jpg?sign=81e9cc12932785bbcb226895d0ff2388&t=1768322246',
					'上海': 'https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/shanghai.jpg?sign=1f12e7902c9213ff82bbfdcb07afd871&t=1768322174',
					'伦敦': 'https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/london.jpg?sign=365f2858e4bb6ce40f86e3fb402e4df1&t=1768322214',
					'纽约': 'https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/newyork.jpg?sign=54adcf9b78283241f09f26f51f135957&t=1768322184',
					'都柏林': 'https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/dublin.jpg?sign=c8d637691f61ab4a3267df882571c449&t=1768322225',
					'苏黎世': 'https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/zurich.jpg?sign=5f1e8a0e7958c88d478316603872000b&t=1768322143',
					'赫尔辛基': 'https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/helsinki.jpg?sign=3f3d9f2f08903c5597005efce4651a10&t=1768322236',
					'墨尔本': 'https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/melbourne.jpg?sign=df4c84bb38fcd4f0eb7c2094e8137bdc&t=1768322206'
				},
				defaultImage: '/static/cloudcarry.png',
				
				// Mock Data (寄件人数据)
				rawData: []
			}
		},
		computed: {
			displayList() {
				if (!this.filterDest) return this.rawData;
				return this.rawData.filter(item => item.destination.includes(this.filterDest));
			}
		},
		onShow() {
		        this.fetchList();
		},
		methods: {
			onSearchChange(e) { this.filterDest = e.detail; },
			onSearch() { },
			
			getCityImage(destination) {
				for (let key in this.cityImageMap) {
					if (destination.includes(key)) {
						return this.cityImageMap[key];
					}
				}
				return this.defaultImage;
			},
			
			goToPost() {
				// 关键点：这里传参是 type=sender
				uni.navigateTo({ url: '/pages/post/post?type=sender' });
			},
			
			showDetail(item) {
				this.currentItem = item;
				this.wechatRevealed = false;
				this.isShowPopup = true;
			},
			
			revealWechat() {
				const myInfo = uni.getStorageSync('user_profile');
				if(!myInfo || !myInfo.wechat) {
					uni.showModal({
						title:'提示', content:'请先去[我的]页面完善您的微信号',
						confirmText:'去完善',
						success: (res) => { if(res.confirm) uni.switchTab({url:'/pages/profile/profile'}) }
					});
					return;
				}
				this.wechatRevealed = true;
			},
			
			copyWechat() {
				uni.setClipboardData({
					data: this.currentItem.wechat,
					success: () => { Toast.success('已复制'); }
				});
			},
			// 1. 获取列表
			fetchList() {
				uni.showLoading({ title: '加载中...' });
				this.$http({
					url: '/api/posts',
					method: 'GET',
					data: { type: 'sender' }
				}).then(data => {
					this.rawData = data.map(item => ({
					    ...item,
					    capacity: item.capacity || '',   // 防止 null
					    item_desc: item.item_desc || '', // 防止 null
					    remark: item.remark || ''        // 防止 null
					})); // 后端直接返回数组
					uni.hideLoading();
				}).catch(() => {
					uni.hideLoading();
					// 首次加载如果没数据或报错，给个空数组防止崩
					this.rawData = [];
				});
			},
			
			// 2. 显示微信号（权限逻辑）
			revealWechat() {
				 // 先检查本地有没有微信号
				 const myInfo = uni.getStorageSync('user_profile');
				 if(!myInfo || !myInfo.wechat) {
					 uni.showModal({
						title: '提示', content: '请先去[我的]页面完善您的微信号',
						confirmText: '去完善',
						success: (res) => { if(res.confirm) uni.switchTab({url:'/pages/profile/profile'}) }
					 });
					 return;
				 }
				 
				 // 🔴 核心：向后端请求敏感数据
				 this.$http({
					 url: `/api/posts/${this.currentItem.id}/contact`,
					 method: 'GET'
				 }).then(res => {
					 // 成功拿到数据
					 // Vue2 写法 (Uni-app 默认是 Vue2/3 混合，如果界面不刷新用这个)
					 this.$set(this.currentItem, 'wechat', res.wechat); 
					 this.wechatRevealed = true;
				 }).catch(err => {
					 if (err.statusCode === 429) {
						 uni.showToast({ title: '今日查看次数已达上限', icon: 'none' });
					 } else {
						 uni.showToast({ title: '查看失败', icon: 'none' });
					 }
				 });
			}
		}
	}
</script>

<style>
	.container { background-color: #f7f8fa; min-height: 100vh; padding-bottom: 80px; }
	.list-box { padding: 10px; }
	
	/* 图片样式 */
	.thumb-image { width: 90px; height: 90px; border-radius: 8px; }
	
	/* 标题样式 */
	.card-title-box { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
	.origin-text { color: #333; }
	.fly-icon { color: #999; margin: 0 5px; font-size: 14px; font-weight: bold; } /* 箭头稍微大一点 */
	.dest-text { color: #333; }
	
	/* 描述样式 */
	.card-desc-box { color: #666; font-size: 14px; }
	.date-row { margin-bottom: 5px; }
	
	/* 物品描述 - 黑色加粗 */
	.item-row { color: #666; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	
	/* 悬浮按钮 */
	.fab-button {
		position: fixed; right: 20px; bottom: 30px;
		width: 60px; height: 60px;
		background-color: #7dc5eb;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		box-shadow: 0 4px 10px rgba(0,122,255,0.3);
		z-index: 99;
	}
	
	/* 弹窗样式 */
	.popup-content { padding: 20px; }
	.popup-title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 20px; }
	.wechat-box { background: #f0f9eb; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
	.wx-text { font-size: 16px; font-weight: bold; color: #333; }
</style>