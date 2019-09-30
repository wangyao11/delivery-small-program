//index.js
//获取应用实例
const app = getApp();
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;
var util = require('../../../utils/util.js');

Page({
	data: {
		shopGoodList: [],
		remind: '加载中...'
	},
	onLoad: function(e) {
		if (e.shop_id) {
			wx.setStorageSync('shopId', e.shop_id);
		}

	},
	onShow: function() {
		this.getDataFromStorage();
		console.log('从缓存中取得的列表值', this.data.shopGoodList)
	},
	/* onUnload: function() {
		this.saveDataToStorage();
	}, */
	getDataFromStorage: function() { //从缓存中获取已经选择的商品列表
		var selectGoodArr = wx.getStorageSync('selectGoodArr') ? JSON.parse(wx.getStorageSync('selectGoodArr')) : [];
		this.setData({
			shopGoodList: selectGoodArr,
			remind: ''
		})
	},
	saveDataToStorage: function(shopGoodList) {
		wx.setStorageSync('selectGoodArr', JSON.stringify(shopGoodList));
		this.bindGoodList(shopGoodList);
	},
	bindGoodList: function(shopGoodList) {
		this.setData({
			shopGoodList: shopGoodList,
			remind: ''
		})
	},
	deleteGood: function(e) { //删除商品
		var id = e.currentTarget.dataset.id;
		this.updateStorageGoodsItem(id);
	},
	callChangeCount: function(e) { // 绑定加减值
		var count = e.detail.count;
		var id = e.currentTarget.dataset.id;
		this.changeCurList(count, id);
	},
	changeCurList: function(count, id) {
		var shopGoodList = this.data.shopGoodList;
		shopGoodList.forEach((item, index) => {
			if (item.id === id) {
				item.count = count
			}
		})
		this.saveDataToStorage(shopGoodList);
		console.log('操作之后shopGoodList', shopGoodList);
	},
	updateStorageGoodsItem: function(id) { //删除添加的商品
		var selectGoodArr = JSON.parse(wx.getStorageSync('selectGoodArr'));
		selectGoodArr = selectGoodArr.filter((item, index) => {
			return item.id != id;
		})
		this.saveDataToStorage(selectGoodArr);
	},
	shopGoods: function() { //收餐完成
		var shopId = Number(wx.getStorageSync('shopId'));
		var supply_id = app.globalData.userInfo.id;
		var goodsList = [];
		if (util.isEmpty(this.data.shopGoodList)) {
			wx.showToast({
				title: '请添加商品',
				duration: 1500,
				icon: 'none'
			})
			return false;
		}
		this.data.shopGoodList.forEach((item, index) => {
			var obj = {};
			obj.goods_id = item.id;
			obj.quatity = item.count;
			goodsList.push(obj);
		})

		var ajaxData = {
			supply_id: supply_id,
			shop_id: shopId,
			ShopRecvDetails: goodsList
		}

		console.log(ajaxData)
		/* wx.showToast({
			title: '正在收餐中...',
			icon: 'loading'
		}) */
		wx.showLoading({
			title:'正在收餐中...'
		})
		request.fetch({
			url: api.shopRecvRecords,
			data: ajaxData,
		}).then(res => {
			console.log('店铺收餐', res);
			if (res.data) {
				wx.hideLoading();
				wx.showToast({
					title: '收餐完成',
					icon: 'success'
				})
				wx.removeStorageSync('selectGoodArr');
				setTimeout(function() {
					wx.switchTab({
						url: '/pages/shop-list/shop-list'
					})
				}, 2000)
			}

		})

	},
	cancleRevGoods: function() { //取消收餐
		wx.removeStorageSync('shopId');
		wx.navigateBack()
	}
})
