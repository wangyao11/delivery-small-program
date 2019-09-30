Component({
	properties: {
		count: {
			type: Number,
			observer: "onShow",
			value: 1
		}
	},
	data: {

	},
	methods: {
		/* 逻辑事件 */
		setNewCount: function(count) {
			let _count = this.data.count;
			if (count != _count) {
				let _data = {};
				_data.count = count;
				if (this.data.code) _data.code = this.data.code;
				this.triggerEvent('callChangeCount', _data);
				this.setData({
					count: count
				})
			}
		},
		/* 页面交互 点击加减 */
		tapBtn: function(evt) {
			const _tar = evt.currentTarget.dataset.tar;
			let _count = this.data.count;
			if (_tar == 'plus') {
				_count++;
			} else {
				if (_count > 1) {
					_count--;
				}
			}
			/* let minusStatus = false;
			if(_count > 1){
				minusStatus = true;
			}else {
				minusStatus = false;
			}
			this.setData({
				minusStatus:minusStatus
			}) */
			this.setNewCount(_count)

		},
		/* input框失去焦点 */
		blurHandle: function(evt) {
			let _value = evt.detail.value;
			let _count = _value;
			if (_count < 1) _count = 1;
			this.setNewCount(_count);
		},
		/* 输入 */
		inputHandle: function(evt) {
			let _value = evt.detail.value;
			this.setData({
				count: _value
			})
		}
	}
})
