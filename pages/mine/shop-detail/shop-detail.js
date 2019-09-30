//logs.js
const app = getApp()
const util = require('../../../utils/util.js')
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;

Page({
	data: {
		shopId:0,
		shopInfo:null,
		remind:'加载中...'
	},
	onLoad: function(option) {
		console.log('option', option)
		if(option.shopId){
			this.setData({
				shopId:Number(option.shopId)
			})
			this.getshopRecordList();
		}
		
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
			var filterArr = data.filter((item,index)=>{
				return item.id === this.data.shopId;
			})
			console.log(filterArr)
			var shop_recv_details = filterArr[0].shop_recv_details;
			shop_recv_details.forEach((item,index)=>{
				item.goods.thumb_img = app.globalData.imageUrlPath + item.goods.thumb_img
			})
			filterArr[0].shop_recv_details = shop_recv_details;
			console.log('filterArr',filterArr)
			this.setData({
				shopInfo: filterArr[0],
				remind:''
			})
		}).catch(error => {

		})
	}
})
