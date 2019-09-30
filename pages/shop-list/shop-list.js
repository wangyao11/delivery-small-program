//index.js
//获取应用实例
const app = getApp()
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;
Page({
  data: {
    shopList: [],
    userInfo: {},
	remind: '加载中',
    hasUserInfo: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
	
  },
  onShow:function(){
	  console.log(app.globalData.userlogin)
	  if(app.globalData.userlogin == ''){
	    wx.redirectTo({
	  	  url:'/pages/login/login'
	    })
	    return false;
	  }
	  this.getShopList();
  },
  getShopList:function(){
	var supply_id = app.globalData.userInfo.id;
	var that = this;
	 var ajaxData = {
		  supply_id:supply_id
	 }
	request.fetch({
		url:api.listShopsBySuppierId,
		data:ajaxData,
		method:'GET'
	  }).then(res=>{
		console.log(res)
		var data = res;
		data.forEach((item,index)=>{
			item.logo = app.globalData.imageUrlPath + item.logo
		})
		that.setData({
			shopList: [],
			remind:''
		})
	  }).catch(error=>{
		
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
