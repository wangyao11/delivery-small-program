/* 将微信的api封装成promise形式 */

function wxApi(functionName,obj){
	return new Promise((resolve,reject)=>{
		wx[functionName]({
			...obj,
			success:res=>resolve(res),
			fail:res=>reject(res)
		})
	})
}

module.exports = { wxApi } 