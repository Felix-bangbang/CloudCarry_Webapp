<template>
	<view class="container">
		<view class="banner">
			<view class="app-name">CloudCarry 云捎</view>
			<view class="slogan">The Decentralised Courier 
			Service</view>
		</view>
		<view class="content">
			<view class="section-title">公告</view>
			
			<van-panel title="关于本程序" desc="2026-01-08" status="置顶">
				<view class="notice-content">
					云捎是一个完全免费，独立运营的互助信息平台。
					<br><br>
					注意：本平台仅提供信息展示，不参与任何交易。
				</view>
			</van-panel>
			<view style="height: 10px;"></view> <van-panel title="更新通知" desc="2026-01-14">
				<view class="notice-content">
					1. 旅行/寻捎页面增加了筛选功能 <br>
					2. 旅行/寻捎页面添加了热门城市的logo
				</view>
			</van-panel>
		</view>
		
		<!-- 图片在content外面，完全铺满屏幕 -->
		<view class="image-section">
			<image src="https://7072-prod-3gsdhmmz4c25f5b7-1395072016.tcb.qcloud.la/images/anime.jpg?sign=563e7bb77e21adbd7c19c1aae940b53b&t=1768321925" class="content-image" mode="widthFix"></image>
		</view>
	</view>
</template>

<style>
	.banner {
	  background: linear-gradient(135deg, #5ba8d4 0%, #7dc5eb 100%);
	  padding: 40px 20px;
	  color: white;
	  text-align: center;
	  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	
	.app-name {
	  font-size: 28px;
	  font-weight: bold;
	  margin-bottom: 8px;
	  letter-spacing: 0.5px;
	}
	
	.slogan {
	  font-size: 14px;
	  opacity: 0.9;
	  margin-top: 5px;
	  font-weight: 300;
	}
	
	.content { 
	  padding: 15px; 
	}
	
	.section-title { 
	  font-size: 18px; 
	  font-weight: bold; 
	  margin-bottom: 15px; 
	  margin-top: 10px; 
	}
	
	.notice-content { 
	  padding: 15px; 
	  font-size: 14px; 
	  color: #666; 
	  line-height: 1.6; 
	}
	
	.image-section {
	  margin-top: 20px;
	  padding: 0;
	  width: 100%;
	}
	
	.content-image {
	  width: 100%;
	  display: block;
	}
</style>