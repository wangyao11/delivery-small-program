//app.js
App({
	d:{
		appId:"", //小程序appid
		appKey:"", //小程序密钥
		indexchase:false, //设置首页刷新
		frontColor:"#333333", //标题栏前景颜色
		one:false,
		bf_color:"#fd8003",
		h_color:"#fd8003",
		ceshiUrl:'http://47.99.169.112:8501', //测试地址
		titlee:'', //页面标题
		bgcolor:'#fbfafa'//标题栏背景颜色
	},
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
	
	
    /* // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    }) */
	
	
  },
  onShow:function(){
    console.log('app.js --- onShow');
  },
  //控制登录
  userlogin:function(){
	  if(this.globalData.userlogin == ''){
		  wx.redirectTo({
			  url:'/pages/login/login'
		  })
	  }else {
		  console.log(this.globalData.userInfo)
	  }
  },
  globalData: {
    userInfo: wx.getStorageSync('userInfo'),
    userlogin:wx.getStorageSync('userlogin'),
    userId:wx.getStorageSync('userId'),
	  wxUserInfo:wx.getStorageSync('wxUserInfo'),
    imageUrlPath:'https://api.yfbrothers.cn/images/'
  },
  redirect: function (url, param) {
    wx.navigateTo({
      url: '/pages/' + url + '?' + param
    })
  },
  showModal: function (that) {
    var animation = wx.createAnimation({
      duration: 200
    })
    animation.opacity(0).rotateX(-100).step();
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      that.setData({
        animationData: animation
      });
    }.bind(that), 200)
  },
  showToast: function (that, title) {
    var toast = {};
    toast.toastTitle = title;
    that.setData({
      toast: toast
    })
    var animation = wx.createAnimation({
      duration: 100
    })
    animation.opacity(0).rotateY(-100).step();
    toast.toastStatus = true;
    toast.toastAnimationData = animation.export()
    that.setData({
      toast: toast
    })
    setTimeout(function () {
      animation.opacity(1).rotateY(0).step();
      toast.toastAnimationData = animation
      that.setData({
        toast: toast
      });
    }.bind(that), 100)
    // 定时器关闭 
    setTimeout(function () {
      toast.toastStatus = false
      that.setData({
        toast: toast
      });
    }.bind(that), 2000);
  }
})