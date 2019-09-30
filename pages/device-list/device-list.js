//logs.js
const app = getApp()
const util = require('../../utils/util.js')
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
	  this.getDevicesList();
  },
  getDevicesList:function(){
	var supply_id = app.globalData.userInfo.id;
  	var that = this;
  	 var ajaxData = {
  		  supply_id:supply_id
  	 }
  	request.fetch({
  		url:api.listDevicesBySuppierId,
  		data:ajaxData,
  		method:'GET'
  	  }).then(res=>{
  		console.log(res)
  		var data = res;
  		data.forEach((item,index)=>{
  			item.device_image_url = app.globalData.imageUrlPath + item.device_image_url
  		})
  		that.setData({
  			devicesList: [{name:'王耀'}],
			remind:''
  		})
  	  }).catch(error=>{
  		
  	  })
  },
})
