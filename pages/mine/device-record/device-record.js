//logs.js
const app = getApp()
const util = require('../../../utils/util.js')
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;
Page({
	data: {
		tabIndex: 0,
		remind: '加载中',
		hasTabbar: false,
		deviceRecordList: [],
		tabBars: [{
				id: 0,
				name: '今天'
			},
			{
				id: 1,
				name: '最近一周'
			},
			{
				id: 2,
				name: '最近一月'
			},
		]
	},
	onLoad: function() {
		this.getDeviceRecordList();
	},
	onShow:function(){
		
	},
	tabTab: function(event) {
		this.setData({
			tabIndex: event.target.dataset.current
		})
	},
	changeTab: function(event) {
		this.setData({
			tabIndex: event.detail.current
		})
	},
	getDeviceRecordList: function() {
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
			console.log('设备补货记录',res)
			var data = res.data;
			/* data.forEach((item,index)=>{
				item.device_image_url = app.globalData.imageUrlPath + item.device_image_url
			}) */
			this.setData({
				deviceRecordList: data,
				remind: '',
			})
		}).catch(error => {

		})
	}
})
