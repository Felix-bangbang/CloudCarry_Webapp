<script>
	export default {
		onLaunch: function() {
				// 新增：初始化云开发
				if (wx.cloud) {
						wx.cloud.init({
								env: 'prod-3gsdhmmz4c25f5b7', // 填环境ID
								traceUser: true
						});
				}
			// 检查本地有没有 Token
			const token = uni.getStorageSync('auth_token');
			if (!token) {
				// 没有 Token，执行静默登录
				this.doLogin();
			} else {
				// 有 Token，检查是否过期（可选，这里为了简化先不做）
				console.log('已登录');
			}
		},
		methods: {
			doLogin() {
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						// 发送 code 给后端
						this.$http({
							url: '/api/auth/login',
							method: 'POST',
							data: { code: loginRes.code }
						}).then(res => {
							// 存 Token 和 用户信息
							uni.setStorageSync('auth_token', res.token);
							// 后端返回的 user 包含 {id, wechat, phone}
							uni.setStorageSync('user_profile', res.user);
							console.log('登录成功', res.user);
						}).catch(err => {
							console.error('登录失败', err);
						});
					}
				});
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
