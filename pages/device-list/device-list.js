//logs.js
const app = getApp();
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;

Page({
  data: {
    devicesList: [],
	remind:'加载中...'
  },
  onLoad: function () {
    
  },
  onShow:function(){
    console.log(app.globalData.userlogin)
    if (app.globalData.userlogin == '') {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return false;
    }
	  this.getDevicesList();
  },
  getDevicesList:function(){
  	var that = this;
	var ajaxData = {
		startTime:'2019-09-11',
		endTime:'2019-09-17'
	}
  	request.fetch({
	  url:api.getDeliveryItems,
	  data:ajaxData
	}).then(res=>{
	console.log(res)
	var data = res.value;
	that.setData({
	  devicesList: data,
	  remind:''
	})
	}).catch(error=>{
	
	})
  },
})
