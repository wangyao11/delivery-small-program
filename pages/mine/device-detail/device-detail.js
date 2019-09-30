//logs.js
const app = getApp()
const util = require('../../../utils/util.js')
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;

Page({
	data: {
		itemId:0,
		supplyInfo:null,
		remind:'加载中...'
	},
	onLoad: function(option) {
		console.log('option', option)
		if(option.itemId){
			this.setData({
				itemId:Number(option.itemId)
			})
			this.getsupplyRecordList();
		}
		
	},
	getsupplyRecordList: function() {
		var supply_id = app.globalData.userInfo.id;
		var that = this;
		var ajaxData = {
			// supply_id: supply_id
		}
		request.fetch({
			url: api.deviceSupplyRecords,
			data: ajaxData,
			method: 'GET'
		}).then(res => {
			console.log('deviceSupplyRecords',res)
			var data = res.data;
			var filterArr = data.filter((item,index)=>{
				return item.id === this.data.itemId;
			})
			console.log('当前项的列表',filterArr)
			var device_supply_details = filterArr[0].device_supply_details;
			device_supply_details.forEach((item,index)=>{
				item.goods.thumb_img = app.globalData.imageUrlPath + item.goods.thumb_img
			})
			filterArr[0].device_supply_details = device_supply_details;
			console.log('filterArr',filterArr)
			this.setData({
				supplyInfo: filterArr[0],
				remind:''
			})
		}).catch(error => {

		})
	}
})
