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
    if (hour > 14) {
      startDate.setTime(startDate.getTime() + 3600 * 1000 * 24 * 2);
    } else {
      startDate.setTime(startDate.getTime() + 3600 * 1000 * 24);
    }
    const endDate = new Date()
    endDate.setTime(endDate.getTime() + 3600 * 1000 * 24 * 10);
    var ajaxData = {
      startTime: util.formatTimeTwo(startDate, "Y-M-D"),
      endTime: util.formatTimeTwo(endDate, "Y-M-D")
    }
    // var ajaxData = {
    //   startTime: "2019-08-27",
    //   endTime: "2019-09-30"
    // }
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
