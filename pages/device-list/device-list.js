//logs.js
const app = getApp();
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;
var util = require('../../utils/util.js');

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
    
    const startDate = new Date()
    const hour = startDate.getHours();
    if (hour > 16) {
      startDate.setTime(startDate.getTime() + 3600 * 1000 * 24);
    }
    const endDate = new Date()
    endDate.setTime(endDate.getTime() + 3600 * 1000 * 24 * 7);
    var ajaxData = {
      startTime: util.formatTimeTwo(startDate, "Y-M-D"),
      endTime: util.formatTimeTwo(endDate, "Y-M-D")
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
