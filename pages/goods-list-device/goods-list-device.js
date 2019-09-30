//index.js
//获取应用实例
const app = getApp()
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;
var util = require('../../utils/util.js');

Page({
	data: {
		goodsList: [],
		remind: '加载中...',
		scaleNo: 0
	},
	onLoad: function(e) {
		// console.log(e);
		if (e.scale_no) {
			this.setData({
				scaleNo: Number(e.scale_no)
			})
		}
	},
	onShow: function() {
		this.getGoodsList();
	},
	getGoodsList: function() {
		var merchant_id = app.globalData.userInfo.merchant_id;
		var ajaxData = {
			is_on_sale: 1,
			merchant_id: merchant_id
		}
		request.fetch({
			url: api.goods,
			data: ajaxData,
			method: 'GET'
		}).then(res => {
			var goodsList = res.data;
			console.log('goods', goodsList);
			var deviceGoodList = wx.getStorageSync('deviceGoodList') ? JSON.parse(wx.getStorageSync('deviceGoodList')) : [];
			var goodsIds = [];
			var filterDeviceGoodList = deviceGoodList.filter((item, index) => {
				return item.scale_no == this.data.scaleNo
			})
			filterDeviceGoodList.forEach((item, index) => {
				goodsIds.push(item.goods.id)
			})
			console.log('filterDeviceGoodList', filterDeviceGoodList, goodsIds)
			
			
			var filterGoodsList = goodsList.filter((item,index)=>{
				return goodsIds.indexOf(item.id) == -1
			})
			filterGoodsList.forEach((item, index) => {
				item.thumb_img = app.globalData.imageUrlPath + item.thumb_img;
				item.count = 1;
			})
			console.log('最后的商品列表',filterGoodsList);
			this.setData({
				goodsList: filterGoodsList,
				remind: ''
			})
		})
	},
	// 点击选择
	chooseGood: function(e) {
		var itemData = e.currentTarget.dataset.item;
		var selectList = (wx.getStorageSync('deviceGoodList')) ? wx.getStorageSync('deviceGoodList') : [];
		if (!util.isEmpty(selectList)) {
			selectList = JSON.parse(selectList);
		}
		selectList.forEach((item, index) => {
			if(item.scale_no == this.data.scaleNo){
				item.goods = itemData;
				item.goods_id = itemData.id;
				item.weight = Number(itemData.weight);
				item.offset = itemData.offset;
				item.price = Number(itemData.price);
				item.quatity = 1;
			}
		})
		console.log('选择之后新的替换数组',selectList);
		var selectGoodArr = JSON.stringify(selectList);
		wx.setStorageSync('deviceGoodList', selectGoodArr);
		wx.navigateBack({
			delta: -1
		})
	}
})
