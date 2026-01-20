<template>
	<view class="container">
		<view class="user-header">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image class="avatar-img" :src="profile.avatar || defaultAvatar"></image>
			</button>
			
			<input 
				type="nickname" 
				class="nick-name-input" 
				:value="profile.nickname" 
				placeholder="点击设置昵称" 
				@change="onNicknameChange"
				@blur="onNicknameChange"
			/>
		</view>

		<view class="form-area">
			<view class="section-title">个人信息</view>
			<view class="desc-text">完善主页后，方可发布信息。</view>
			
			<van-cell-group>
				<van-field
					:value="profile.wechat"
					label="微信号"
					placeholder="请输入您的微信号"
					@change="onWechatInput"
				/>
				<van-field
					:value="profile.phone"
					label="手机号"
					placeholder="选填"
					@change="onPhoneInput"
				/>
			</van-cell-group>

			<view style="padding: 20px; margin-top: 20px;">
				<van-button type="info" color="#7dc5eb" block round @click="saveProfile">保存修改</van-button>
				
				<button open-type="feedback" class="feedback-btn">反馈</button>
			</view>
			
		</view>
		
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '/wxcomponents/vant/toast/toast';
	export default {
		data() {
			return {
				// 默认灰色头像
				defaultAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2SJPGic3TB3C3uhG7uP629BTf20F-ExeFAb/0', 
				profile: { 
					wechat: '', 
					phone: '',
					avatar: '',   
					nickname: ''  
				}
			}
		},
		onShow() {
		    const saved = uni.getStorageSync('user_profile');
		    if(saved) {
		        this.profile = { 
		            ...this.profile, 
		            ...saved,
		            // 强制把 null 转为空字符串
		            wechat: saved.wechat || '', 
		            phone: saved.phone || '',
		            nickname: saved.nickname || '',
		            avatar: saved.avatar || ''
		        };
		    }
		},
		
		methods: {
			onWechatInput(e) { this.profile.wechat = e.detail; },
			onPhoneInput(e) { this.profile.phone = e.detail; },
			
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
				if(!this.profile.wechat) {
					uni.showToast({ title: '微信号不能为空', icon: 'none' });
					return;
				}
				
				// 3. 发送给后端的只有 wechat 和 phone
				this.$http({
					url: '/api/user/profile',
					method: 'POST',
					data: {
						contact_wechat: this.profile.wechat,
						contact_phone: this.profile.phone
					}
				}).then(res => {
					// 4. 保存成功后，将所有数据（包括没发给后端的头像昵称）存入本地缓存
					// 这样用户下次进来，依然能看到自己设置的头像
					uni.setStorageSync('user_profile', this.profile);
					
					uni.showToast({ title: '保存成功' });
				}).catch(() => {
					uni.showToast({ title: '保存失败', icon: 'none' });
				});
			}
		}
	}
</script>

<style>
	.container { background-color: #f7f8fa; min-height: 100vh; }
	.user-header { background-color: #ffffff; padding: 30px; text-align: center; margin-bottom: 10px; }
	
	/* 头像样式 */
	.avatar-wrapper {
		padding: 0;
		width: 80px !important; 
		height: 80px !important;
		border-radius: 50%;
		margin: 0 auto 10px;
		background: #eee;
		border: none;
		overflow: hidden;
	}
	.avatar-wrapper::after { border: none; }
	.avatar-img { width: 100%; height: 100%; }
	
	/* 昵称样式 */
	.nick-name-input {
		font-size: 18px;
		font-weight: bold;
		color: #333;
		text-align: center;
		height: 40px;
		line-height: 40px;
	}

	.form-area { background-color: #ffffff; padding: 20px;}
	.section-title { 
		font-size: 16px; font-weight: bold; 
		margin-bottom: 5px; border-left: 4px solid #7dc5eb; padding-left: 10px;}
	.desc-text { font-size: 12px; color: #999; margin-bottom: 15px; padding-left: 14px; }
	
	/* --- 意见反馈按钮样式 --- */
	.feedback-btn {
		margin-top: 20px;
		background-color: #7dc5eb;
		color: white;
		border-radius: 999px;
		border: none;
		
		/* 强制不加粗，字号对齐 */
		font-weight: 400 !important; 
		font-size: 14px !important; /* Vant 普通按钮通常是 14-16px */
		
		/* 高度与 Vant 对齐 */
		height: 44px;
		line-height: 44px;
		
		/* 宽度略小 */
		width: 48%;
		display: block;
		margin-left: auto;
		margin-right: auto;
	}
	
	/* 移除点击态背景变黑 */
	.feedback-btn::after { border: none; }
</style>