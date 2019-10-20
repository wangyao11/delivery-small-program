//index.js
//获取应用实例
const app = getApp();
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;
var util = require('../../../utils/util.js');
Page({
	data: {
    devicesList: [],
    remind: '加载中...',
    deliveryId:''
	},
  onLoad: function (options) {
    console.log("id:" + options.deliveryId)
    this.setData({
      deliveryId: options.deliveryId
    })
  },
  onShow: function () {
    console.log(app.globalData.userlogin)
    if (app.globalData.userlogin == '') {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return false;
    }
    this.getDevicesList();
  },
  getDevicesList: function () {
    var that = this;
    const date = new Date()
    const hour = date.getHours();
    if(hour < 16) {
      date.setTime(date.getTime() - 3600 * 1000 * 24);
    }
    let userId = app.globalData.userId;
    var ajaxData = {
      deliveryItemId: that.data.deliveryId,
      userId:userId
    }
    request.fetch({
      url: api.listByDeviceItemId,
      data: ajaxData
    }).then(res => {
      
      var data = res.value;
      that.setData({
        devicesList: data,
        remind: ''
      })
    }).catch(error => {

    })
  },
})
