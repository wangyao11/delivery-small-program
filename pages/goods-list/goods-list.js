//index.js
//获取应用实例
const app = getApp()
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;
var util = require('../../utils/util.js');

Page({
  data: {
    goodsList: [],
	remind:'加载中...'
  },
  onLoad: function (e) {
    // console.log(e);
	this.getGoodsList();
  },
  getGoodsList:function(){
	  var merchant_id = app.globalData.userInfo.merchant_id;
	  var ajaxData = {
		  is_on_sale:1,
		  merchant_id:merchant_id
	  }
	  
	  request.fetch(
		{
			url:api.goods,
			data:ajaxData,
			method:'GET'
		}
	  ).then(res=>{
		  console.log('goods',res);
		  
		  var result = [],hash = {};
		  var goodsIds = [];
		  if(wx.getStorageSync('selectGoodArr')){
			  var selectGoodsArr = JSON.parse(wx.getStorageSync('selectGoodArr'));
			  selectGoodsArr.forEach((item,index)=>{
			  	goodsIds.push(item.id)		  
			  })
			  console.log('selectGoodsArr',selectGoodsArr)
		  }
		  
		  console.log('goodsIds',goodsIds)
		  
		  var goodsList = res.data;
		  var filterGoodsList = goodsList.filter((item,index)=>{
			  return goodsIds.indexOf(item.id) == -1
		  })
		   filterGoodsList.forEach((item,index)=>{
		  	item.thumb_img = app.globalData.imageUrlPath + item.thumb_img ;
			item.count = 1;
		  })
		  this.setData({
			  goodsList:filterGoodsList,
			  remind:''
		  })
	  })
  },
  // 点击选择
  chooseGood:function(e){
	  var item = e.currentTarget.dataset.item;
	  var selectList = (wx.getStorageSync('selectGoodArr')) ? wx.getStorageSync('selectGoodArr'):[];
	  if(!util.isEmpty(selectList)){
		  selectList = JSON.parse(selectList);
	  }
	  selectList.push(item);
	  var selectGoodArr = JSON.stringify(selectList);
	  wx.setStorageSync('selectGoodArr',selectGoodArr);
	  
	  wx.navigateBack({
		  delta:-1
	  })
	  
	  
  }
})