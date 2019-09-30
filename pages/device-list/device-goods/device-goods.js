//index.js
//获取应用实例
const app = getApp();
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;
var util = require('../../../utils/util.js');

Page({
	data: {
		deviceGoodList: [],
		remind: '加载中...'
	},
	onLoad: function(e) {
		if (e.device_id) {
			wx.setStorageSync('deviceId', e.device_id);
		}

	},
	onShow: function() {
		if (wx.getStorageSync('deviceGoodList')) {
			this.getDataFromStorage();
		} else {
			this.getDeviceGoods();
		}
		console.log('deviceGoodList',this.data.deviceGoodList)
	},
	onUnload: function() {
		// this.saveDataToStorage();
	},
	getDeviceGoods: function() {
		var deviceId = Number(wx.getStorageSync('deviceId'));
		var shop_id = app.globalData.userInfo.merchant_id;
		var ajaxData = {
			device_id: deviceId,
			shop_id: shop_id
		}
		console.log(ajaxData)
		request.fetch({
			url: api.deviceGoods,
			data: ajaxData,
			method: 'GET'
		}).then(res => {
			console.log('设备的货道商品', res);
			var data = res.data;
			data.forEach((item, index) => {
				item.goods.thumb_img = app.globalData.imageUrlPath + item.goods.thumb_img
			})
			this.setData({
				deviceGoodList: [{name:'苹果'}],
				remind: ''
			})
		})
	},
	getDataFromStorage:function(){
		var deviceGoodList = JSON.parse(wx.getStorageSync('deviceGoodList'));
		this.setData({
			deviceGoodList: deviceGoodList,
			remind: ''
		})
	},
	saveDataToStorage: function(deviceGoodList) {
		// var deviceGoodList = this.data.deviceGoodList;
		wx.setStorageSync('deviceGoodList', JSON.stringify(deviceGoodList));
		this.bindGoodList(deviceGoodList);
	},
	bindGoodList:function(deviceGoodList){
		this.setData({
			deviceGoodList: deviceGoodList,
			remind: ''
		})
	},
	handleInput: function(e) { //处理输入框的输入
		var name = e.target.dataset.name;
		var id = e.target.dataset.id;
		var value = Number(e.detail.value) < 0 ? 0 : e.detail.value;
		this.changeCurList(name,id,value);
	},
	callChangeCount: function(e) { // 处理数量加减值
		var count = e.detail.count;
		var id = e.currentTarget.dataset.id;
		this.changeCurList('quatity',id,count);
	},
	changeCurList:function(name,id,value){ //绑定现有的列表页面
		var deviceGoodList = this.data.deviceGoodList;
		deviceGoodList.forEach((item, index) => {
			if (item.id === id) {
				item[name] = Number(value);
			}
		})
		this.saveDataToStorage(deviceGoodList);
		console.log('操作之后deviceGoodList', deviceGoodList);
	},
	/*getSelectGoodArr: function() { //获取已经选择的商品列表
		var selectGoodArr = wx.getStorageSync('selectGoodArr');
		if (selectGoodArr) {
			selectGoodArr = JSON.parse(selectGoodArr);
			console.log('selectGoodArr', selectGoodArr);
		}
		this.setData({
			shopGoodList: selectGoodArr,
			remind: ''
		})
	},
	 deleteGood: function(e) { //删除商品
		var id = e.currentTarget.dataset.id;
		this.updateStorageGoodsItem(id);
	},
	updateStorageGoodsCount: function(count, id) {
		this.data.shopGoodList.forEach((item, index) => {
			if (item.id === id) {
				item.count = count
			}
		})
		wx.setStorageSync('selectGoodArr', JSON.stringify(this.data.shopGoodList))
	},
	updateStorageGoodsItem: function(id) { //删除添加的商品
		var selectGoodArr = JSON.parse(wx.getStorageSync('selectGoodArr'));
		selectGoodArr = selectGoodArr.filter((item, index) => {
			return item.id != id;
		})
		wx.setStorageSync('selectGoodArr', JSON.stringify(selectGoodArr));
		this.getSelectGoodArr();
	}, */
	deviceGoods: function() { //补货完成
		var shopId = Number(wx.getStorageSync('shopId'));
		var supply_id = app.globalData.userInfo.id;
		var goodsList = this.data.deviceGoodList;
		if (util.isEmpty(goodsList)) {
			wx.showToast({
				title: '请添加商品',
				duration: 1500,
				icon: 'none'
			})
			return false;
		}
		var filterGoodsLIst = [];
		goodsList.forEach((item,index)=>{
			var obj = {};
			obj['device_id'] = item.device_id;
			obj['scale_no'] = item.scale_no;
			obj['shop_id'] = item.shop_id;
			obj['goods_id'] = item.goods_id;
			obj['price'] = item.price;
			obj['weight'] = item.weight;
			obj['offset'] = item.offset;
			obj['quatity'] = item.quatity;
			obj['best_aisle_stock'] = item.best_aisle_stock;
			filterGoodsLIst.push(obj);
		})
		var ajaxData = {
			supply_id: supply_id,
			// shop_id: shopId,
			batch: filterGoodsLIst
		}

		console.log(ajaxData)
		/* wx.showToast({
			title: '正在补货中...',
			icon: 'loading'
		}) */
		wx.showLoading({
			title:'正在补货中...'
		})
		request.fetch({
			url: api.supplyGoods,
			data: ajaxData,
		}).then(res => {
			console.log('设备补货', res);
			if (res.message == 'success') {
				wx.hideLoading();
				wx.showToast({
					title: '补货完成',
					icon: 'success'
				})
				wx.removeStorageSync('deviceGoodList');
				setTimeout(function() {
					wx.switchTab({
						url: '/pages/device-list/device-list'
					})
				}, 2000)
			}

		})

	},
	cancleRevGoods: function() { //取消补货
		wx.removeStorageSync('deviceId');
		wx.navigateBack()
	}
})
