Component({
	options: {
		multipleSlots: true, //在组件定义时的选项中启用多slot支持
	},
	/* 组件的属性列表 */
	properties: {
		title:{	//弹窗标题
			type:String,
			value:'提示' //默认值
		},
		logo:{  //项目logo
			type:String,
			value:'logo.jpg'
		},		
		dialogText:{	//提示内容
			type:String,
			value:'提示内容'
		},		
		authorizeItem:{	// 授权选项
			type:String,
			value:'授权选项'
		},		
		confirmText:{ //弹窗确认按钮文字
			type:String,
			value:'去登录'
		},		
		rejectText:{ //弹窗拒绝按钮文字
			type:String,
			value:'拒绝'
		},
		isShow:{
			type:Boolean,
			value:false
		}
	},
	/* 组件内私有数据 */
	data: {
		// isShow:false //弹窗显示控制
	},
	/* 组件内公有方法列表 */
	methods: {
		hideDialog:function(){ //隐藏弹窗
			this.setData({
				isShow:!this.data.isShow
			})
		},
		rejectEvent:function(){
			/* this.setData({
				logo:'warnIcon.png',
				dialogText:'尚未登录，将无法正常使用该程序',
				confirmText:'立即登录'
			}) */
			this.setData({
				isShow:false
			})
		},
		/* triggerEvent组件之间的通信 */
		confirmEvent:function(){
			this.triggerEvent('confirmEvent');
		},
		getUserInfo:function(e){
			// this.triggerEvent('getUserInfo');
			var that = this;
			console.log('getWxUserInfo',e.detail)
			if(e.detail.userInfo){  //用户按了允许授权按钮,将数据保存到缓存中
				that.setData({
					isShow:false
				})
				wx.showLoading({
					title:'正在授权中...'
				})
				wx.setStorageSync('wxUserInfo',e.detail.userInfo);
				setTimeout(function(){
					wx.showToast({
						title:'授权成功',
						icon:'success',
						duration:1500
					});
					that.triggerEvent('onload');
				},1500)
				
			}else { //用户按了拒绝授权按钮,
				/* this.setData({
					logo:'warnIcon.png',
					authorizeItem:'需要获取到您的公开信息(昵称、头像等)，请到小程序的设置中打开用户信息授权',
					confirmText:'去设置',
					title:'信息授权提示',
					rejectText:'取消'
				}) */
				that.setData({
					isShow:false
				})
			}
		}
	}
})
