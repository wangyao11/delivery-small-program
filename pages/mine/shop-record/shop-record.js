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
		shopRecordList: [],
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
		console.log('获取收餐记录')
		this.getshopRecordList();
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
	getshopRecordList: function() {
		var supply_id = app.globalData.userInfo.id;
		var that = this;
		var ajaxData = {
			supply_id: supply_id
		}
		request.fetch({
			url: api.shopRecvRecords,
			data: ajaxData,
			method: 'GET'
		}).then(res => {
			console.log(res)
			var data = res.data;
			/* data.forEach((item,index)=>{
				item.device_image_url = app.globalData.imageUrlPath + item.device_image_url
			}) */
			this.setData({
				shopRecordList: data,
				remind: '',
			})
		}).catch(error => {

		})
	}
})
