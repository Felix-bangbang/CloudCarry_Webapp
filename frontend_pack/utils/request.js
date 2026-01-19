// utils/request.js

// 1. 填入云托管环境ID
const ENV_ID = 'prod-3gsdhmmz4c25f5b7'; 
// 2. 填入服务名称 (在云托管服务列表里看，一般叫 flask-xxx)
const SERVICE_NAME = 'flask-24y5';

const request = (options) => {
    return new Promise((resolve, reject) => {
        // 1. 获取本地 Token
        const token = uni.getStorageSync('auth_token');
        
        // 2. 构造 Header
        const header = {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            // 这是一个特殊的 Header，告诉云托管即使没有公网域名也要处理请求
            'X-WX-SERVICE': SERVICE_NAME 
        };

        // 3. 使用微信云托管原生调用 (无需域名)
        wx.cloud.callContainer({
            config: {
                env: ENV_ID // 指定环境
            },
            path: options.url, // 接口路径 (例如 /api/posts)
            header: header,
            method: options.method || 'GET',
            data: options.data || {},
            success: (res) => {
                // 4. 统一处理状态码
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data);
                } else if (res.statusCode === 401) {
                    uni.showToast({ title: '请先登录', icon: 'none' });
                    reject(res);
                } else {
                    uni.showToast({ title: '服务器开小差了', icon: 'none' });
                    console.error('API Error:', res);
                    reject(res);
                }
            },
            fail: (err) => {
                console.error('Network Error:', err);
                uni.showToast({ title: '网络连接失败', icon: 'none' });
                reject(err);
            }
        });
    });
}

export default request;