<template>
	<view class="container">
		<view class="header-title">
			发布{{ type === 'traveler' ? '出行信息' : '寻捎需求' }}
		</view>

		<van-cell-group>
			<van-field :value="form.origin" label="出发地" placeholder="例如：上海" @change="onInput('origin', $event)" />
			<van-field :value="form.destination" label="目的地" placeholder="例如：伦敦" @change="onInput('destination', $event)" />
			
			<picker mode="date" :start="today" @change="bindDateChange">
				<van-field :value="form.date" label="日期" placeholder="点击选择日期" readonly is-link />
			</picker>

			<van-field 
				v-if="type === 'traveler'"
				:value="form.capacity" 
				label="可用重量" 
				placeholder="例如：1kg" 
				@change="onInput('capacity', $event)" 
			/>
			<van-field 
				v-else
				:value="form.item_desc" 
				label="物品描述" 
				placeholder="例如：几件衣服，一双鞋...." 
				@change="onInput('item_desc', $event)" 
			/>

			<van-field 
				:value="form.remark" 
				label="其它要求" 
				type="textarea" 
				placeholder="请输入备注信息..." 
				autosize 
				@change="onInput('remark', $event)" 
			/>
		</van-cell-group>

		<view style="padding: 20px;">
			<van-button type="primary" color="#7dc5eb" block round @click="submit">确认发布</van-button>
		</view>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '/wxcomponents/vant/toast/toast';
	export default {
		data() {
			return {
				type: 'traveler', // 默认值，通过页面参数修改
				today: new Date().toISOString().slice(0, 10),
				form: { origin: '', destination: '', date: '', capacity: '', item_desc: '', remark: '' }
			}
		},
		onLoad(options) {
			// 接收上个页面传来的参数：type='traveler' 或 'sender'
			if (options.type) {
				this.type = options.type;
			}
		},
		methods: {
			onInput(key, e) { this.form[key] = e.detail; },
			bindDateChange(e) { this.form.date = e.detail.value; },
			submit() {
				// 简单的非空校验
				if(!this.form.origin || !this.form.destination || !this.form.date) {
					Toast.fail('请完善核心信息');
					return;
				}
				// 权限校验：必须完善信息才能发布
				const myInfo = uni.getStorageSync('user_profile');
				if(!myInfo || !myInfo.wechat) {
					uni.showModal({
						title:'提示', content:'请先去[我的]页面完善微信号',
						success: (res) => { if(res.confirm) uni.switchTab({url:'/pages/profile/profile'}) }
					});
					return;
				}
				uni.showLoading({ title: '发布中...' });

				const postData = {
					type: this.type, // 'traveler' 或 'sender'
					origin: this.form.origin,
					destination: this.form.destination,
					date: this.form.date,
					// 如果是旅行者传 capacity，如果是云捎传 item_desc
					capacity: this.type === 'traveler' ? this.form.capacity : null,
					item_desc: this.type === 'sender' ? this.form.item_desc : null,
					remark: this.form.remark
				};

				this.$http({
					url: '/api/posts',
					method: 'POST',
					data: postData
				}).then(res => {
					uni.hideLoading();
					uni.showToast({ title: '发布成功' });
					setTimeout(() => {
						// 返回上一页并自动刷新
						uni.navigateBack(); 
					}, 1500);
				}).catch(err => {
					uni.hideLoading();
					// 如果触发了内容安全拦截 (msgSecCheck)
					uni.showToast({ title: '发布失败：内容可能包含违规词', icon: 'none' });
				});
			}
		}
	}
</script>

<style>
	.container { background-color: #f7f8fa; min-height: 100vh; padding-top: 10px; }
	.header-title { padding: 15px; font-size: 20px; font-weight: bold; color: #333; text-align: center;}
</style>