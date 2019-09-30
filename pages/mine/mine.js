//index.js
//获取应用实例
const app = getApp()
var wxApi = require('../../utils/network/base.js').wxApi;
var api = require('../../utils/network/config.js').api;
Page({
	data: {
		userInfo: {},
		remind: '加载中...',
		isShow: false,
		dialogTitle: '提示',
		logoImg: 'logo.jpg',
		dialogText: '是否登录并继续使用该程序',
		authorizeItem: '登录程序需进行微信授权',
		rejectText: '拒绝',
		confirmText: '去登录',
		wxUserInfo:{}
	},
	//事件处理函数
	bindViewTap: function() {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function() {
		this.getUserInfo();
	},
	getUserInfo: function(e) {
		var userInfo = app.globalData.userInfo;
		console.log(userInfo)
		this.setData({
			userInfo: userInfo,
			remind: ''
		})
	},
	onload: function() {
		this.onLoad();
	}
})
