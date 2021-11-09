// pages/goods/goods.js
const app = getApp()
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;

Page({
    data: {
        toView: '0',
        totalCount: 0, // 总商品数
        carArray: [],
        fold: true,
        cartShow: 'none',
        status: 0,
        deliveryId: 0,
        categories: [],
        goodsWrap: [],
        dateTime: '',
        image_url: api.image_url,
        productIndex: 0,
        productParentIndex: 0,
        productCount: 0,
        updateCountFocus: false
    },
    selectMenu: function(e) {
        var index = e.currentTarget.dataset.itemIndex;
        let id = e.currentTarget.dataset.id;
        this.setData({
            toView: id
        })
        console.log(this.data.toView);
    },
    updateCount: function(e) {
        this.setData({
            updateCountFocus: true,
            productIndex: e.currentTarget.dataset.itemIndex,
            productParentIndex: e.currentTarget.dataset.parentindex
        })
        console.log(111)
    },
    //移除商品
    decreaseCart: function(e) {
        var index = e.currentTarget.dataset.itemIndex;
        var parentIndex = e.currentTarget.dataset.parentindex;
        this.data.goodsWrap[parentIndex].goods[index].count--;
        var mark = 'a' + index + 'b' + parentIndex
        var num = this.data.goodsWrap[parentIndex].goods[index].count;
        var name = this.data.goodsWrap[parentIndex].goods[index].name;
        var unit = this.data.goodsWrap[parentIndex].goods[index].type;
        var obj = { unit: unit, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex };
        var carArray1 = [];
        for (let i = 0; i < this.data.carArray.length; i++) {
            let item = this.data.carArray[i];
            if (item.mark == mark) {
                if (num > 0) {
                    carArray1.push(obj)
                }
            } else {
                carArray1.push(item);
            }
        }
        this.setData({
            carArray: carArray1,
            goodsWrap: this.data.goodsWrap
        })
        this.calTotalCount()
            //关闭弹起
        var count1 = 0
        for (let i = 0; i < carArray1.length; i++) {
            if (carArray1[i].num == 0) {
                count1++;
            }
        }
        //console.log(count1)
        if (count1 == carArray1.length) {
            if (num == 0) {
                this.setData({
                    cartShow: 'none'
                })
            }
        }
        var productId = this.data.goodsWrap[parentIndex].goods[index].id;
        this.addProductToDelivery(productId, num)
    },
    decreaseShopCart: function(e) {
        this.decreaseCart(e);
    },
    //添加到购物车
    addCart(e) {
        var index = e.currentTarget.dataset.itemIndex;
        var parentIndex = e.currentTarget.dataset.parentindex;
        this.data.goodsWrap[parentIndex].goods[index].count++;
        var mark = 'a' + index + 'b' + parentIndex
        var num = this.data.goodsWrap[parentIndex].goods[index].count;
        var name = this.data.goodsWrap[parentIndex].goods[index].name;
        var unit = this.data.goodsWrap[parentIndex].goods[index].type;
        var obj = { unit: unit, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex };
        var carArray1 = this.data.carArray.filter(item => item.mark != mark)
        if (num == 1) {
            carArray1.push(obj)
        } else {
            var carArray1 = [];
            for (let i = 0; i < this.data.carArray.length; i++) {
                let item = this.data.carArray[i];
                if (item.mark == mark) {
                    if (num > 0) {
                        carArray1.push(obj)
                    }
                } else {
                    carArray1.push(item);
                }
            }
        }
        this.setData({
            carArray: carArray1,
            goodsWrap: this.data.goodsWrap
        })
        this.calTotalCount();
        var productId = this.data.goodsWrap[parentIndex].goods[index].id;
        this.addProductToDelivery(productId, num)
    },
    addShopCart: function(e) {
        this.addCart(e);
    },
    //计算總數量
    calTotalCount: function() {
        var carArray = this.data.carArray;
        var totalCount = 0;
        for (var i = 0; i < carArray.length; i++) {
            if (carArray[i].num > 0) {
                totalCount += 1;
            }
        }
        this.setData({
            totalCount: totalCount,
        });
    },
    //彈起購物車
    toggleList: function() {
        if (!this.data.totalCount) {
            return;
        }
        this.setData({
            fold: !this.data.fold,
        })
        var fold = this.data.fold
            //console.log(this.data.fold);
        this.cartShow(fold)
    },
    cartShow: function(fold) {
        console.log(fold);
        if (fold == false) {
            this.setData({
                cartShow: 'block',
            })
        } else {
            this.setData({
                cartShow: 'none',
            })
        }
        console.log(this.data.cartShow);
    },
    tabChange: function(e) {
        var showtype = e.target.dataset.type;
        this.setData({
            status: showtype,
        });
    },
    onLoad: function(options) {
        this.setData({
            deliveryId: options.deliveryId,
            dateTime: options.dateTime
        })
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        var date = new Date();
        console.log(date);
        var nowDate = new Date(this.data.dateTime);
        console.log(nowDate);
        //(当前时间加12小时，超过12点后不能修改配送单，时区问题加8小时)
        var dateTime = date.getTime() + 3600 * 1000 * 22;
        var nowDateTime = nowDate.getTime();
        if (dateTime > nowDateTime) {
            wx.reLaunch({
                url: '/pages/device-list/device-list'
            })
        }
        if (app.globalData.userlogin == '') {
            wx.redirectTo({
                url: '/pages/login/login'
            })
            return false;
        }
        this.initData();
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    initData() {

        let that = this;
        wx.showNavigationBarLoading();
        request.fetch({
            url: api.getProductClassList
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
        let deliveryId = this.data.deliveryId;
        let userId = app.globalData.userId;
        request.fetch({
            url: api.getProductList,
            data: {
                deliveryItemId: deliveryId,
                userId: userId
            }
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
                        if (item.count > 0) {
                            that.addToCart(item, goods.length - 1, index)
                        }
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
    addToCart: function(product, index, parentIndex) {
        var mark = 'a' + index + 'b' + parentIndex
        var carArray1 = this.data.carArray.filter(item => item.mark != mark)
        var obj = { unit: product.type, num: product.count, mark: mark, name: product.name, index: index, parentIndex: parentIndex };
        carArray1.push(obj)
        console.log(carArray1);
        this.setData({
            carArray: carArray1
        })
        this.calTotalCount();
    },
    addProductToDelivery: function(productId, count) {
        let deliveryId = this.data.deliveryId;
        let userId = app.globalData.userId;
        request.fetch({
            url: api.addProductToDelivery,
            data: {
                deliveryItemId: deliveryId,
                userId: userId,
                productId: productId,
                count: count
            }
        }).then(function(res) {

        });
    },
    setValue: function(e) {
        this.setData({
            productCount: e.detail.value
        })
    },
    cancel: function() {
        var that = this
        that.setData({
            updateCountFocus: false,
        })
    },
    confirmAcceptance: function() {
        var productCount = this.data.productCount;
        var index = this.data.productIndex;
        var parentIndex = this.data.productParentIndex;
        this.data.goodsWrap[parentIndex].goods[index].count = productCount;
        var mark = 'a' + index + 'b' + parentIndex
        var num = this.data.goodsWrap[parentIndex].goods[index].count;
        var name = this.data.goodsWrap[parentIndex].goods[index].name;
        var unit = this.data.goodsWrap[parentIndex].goods[index].type;
        var obj = { unit: unit, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex };
        var carArray1 = [];
        for (let i = 0; i < this.data.carArray.length; i++) {
            let item = this.data.carArray[i];
            if (item.mark == mark) {
                if (num > 0) {
                    carArray1.push(obj)
                }
            } else {
                carArray1.push(item);
            }
        }
        this.setData({
            carArray: carArray1,
            goodsWrap: this.data.goodsWrap
        })
        this.calTotalCount()
            //关闭弹起
        var count1 = 0
        for (let i = 0; i < carArray1.length; i++) {
            if (carArray1[i].num == 0) {
                count1++;
            }
        }
        //console.log(count1)
        if (count1 == carArray1.length) {
            if (num == 0) {
                this.setData({
                    cartShow: 'none'
                })
            }
        }
        var productId = this.data.goodsWrap[parentIndex].goods[index].id;
        this.addProductToDelivery(productId, num)
        this.setData({
            updateCountFocus: false,
        })
    },
    preventTouchMove: function() {
        return;
    }
})