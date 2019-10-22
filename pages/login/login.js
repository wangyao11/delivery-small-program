//index.js

var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;

//获取应用实例
const app = getApp()

Page({
  data: {
    autoFocus: false,
    userInfo: {},
    hasUserInfo: false,
	is_pwd:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  loginSubmit: function(e) {
		console.log(e)
		var account = e.detail.value.account;
		var password = e.detail.value.password;
		var ajaxData = {
			user_name:account,
			password:password
		}
		if(account == '' || password == '') {
			wx.showToast({
				title:'用户名或密码不能为空',
				icon:'none',
				duration: 1500
			})
			return false;
		}
		console.log(api.login)
		wx.showLoading({
			title:'正在登录中...'
		})
		request.fetch({
			url:api.login,
			data:ajaxData
		}).then(res=>{
			console.log('userInfo',res);
			
			app.globalData.token = res.value.token;
			app.globalData.userInfo = res.value;
			app.globalData.userlogin = true;
      app.globalData.userId = res.value.id;
			wx.setStorageSync('userId', res.value.id);
      wx.setStorageSync('userInfo', res.value);
			wx.setStorageSync('userlogin', true);
			wx.setStorageSync('token', res.value.token);
			wx.showToast({
				title:'登录成功',
				icon:'success',
				duration:1000
			})
			setTimeout(function() {
				wx.switchTab({
          url: '/pages/device-list/device-list'
				})
			}, 1000);
		}).catch(error=>{
			wx.showToast({
				title:'登录失败',
				icon:'none'
			})
		})
		
		
		console.log(ajaxData)
    
  },
  onLoad: function () {
    
  },
  togglePwd:function(){
	  var that = this;
	  var is_pwd = that.data.is_pwd;
	  that.setData({
		  is_pwd:!is_pwd
	  })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
