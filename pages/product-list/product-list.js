// pages/category/category.js

const app = getApp()
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    goodsWrap: [],
    categorySelected: "",
    goodsToView: "",
    categoryToView: "",
    image_url:api.image_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    console.log(app.globalData.userlogin)
	  if(app.globalData.userlogin == ''){
	    wx.redirectTo({
	  	  url:'/pages/login/login'
	    })
	    return false;
	  }
    this.initData();
  },
  initData() {

    let that = this;
    wx.showNavigationBarLoading();
    request.fetch({
      url:api.getProductClassList
    }).then(function(res) {

      var categories = [];
      for (var i = 0; i < res.value.length; i++) {

        let item = res.value[i];

        item.scrollId = "s" + item.id;
        categories.push(item);
        if (i == 0) {
          that.setData({
            categorySelected: item.scrollId,
          })
        }
      }
      that.setData({
        categories: categories,

      });
      console.log(categories);
      that.getGoodsList(0);
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });

  },
  getGoodsList: function(categoryId, append) {

    let that = this;

    request.fetch({
      url:api.getProductList,
      data:{}
    }).then(function(res) {
      let goodsWrap = [];

      that.data.categories.forEach((o, index) => {
        let wrap = {};
        wrap.id = o.id;
        wrap.scrollId = "s" + o.id;
        wrap.name = o.name;
        let goods = [];

        wrap.goods = goods;
        res.value.forEach((item, i) => {
          if (item.classId == wrap.id) {
            goods.push(item)
          }
        })

        goodsWrap.push(wrap);
      })

      that.setData({
        goodsWrap: goodsWrap,
      });
      console.log(goodsWrap);
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  onCategoryClick: function(e) {
    let id = e.currentTarget.dataset.id;
    this.categoryClick = true;
    this.setData({
      goodsToView: id,
      categorySelected: id,
    })

  },
  scroll: function(e) {

    if (this.categoryClick){
      this.categoryClick = false;
      return;
    }

    let scrollTop = e.detail.scrollTop;

    let that = this;

    let offset = 0;
    let isBreak = false;

    for (let g = 0; g < this.data.goodsWrap.length; g++) {

      let goodWrap = this.data.goodsWrap[g];

      offset += 30;

      if (scrollTop <= offset) {

        if (this.data.categoryToView != goodWrap.scrollId) {
          this.setData({
            categorySelected: goodWrap.scrollId,
            categoryToView: goodWrap.scrollId,
          })
        }

        break;
      }


      for (let i = 0; i < goodWrap.goods.length; i++) {

        offset += 91;

        if (scrollTop <= offset) {

          if (this.data.categoryToView != goodWrap.scrollId) {
            this.setData({
              categorySelected: goodWrap.scrollId,
              categoryToView: goodWrap.scrollId,
            })
          }

          isBreak = true;
          break;
        }
      }

      if (isBreak){
        break;
      }


    }

  
  }
})