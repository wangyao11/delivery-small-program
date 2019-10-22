/** 
 * 小程序配置接口文件 
 */
const api = {
	// base_url:'http://47.99.169.112:8501',
  base_url:'https://api.yfbrothers.cn',
  image_url:'https://api.yfbrothers.cn/images/',
	login:'/wechat/user/login',
	getProductClassList:'/wechat/product/getClasslist',
	getProductList:'/wechat/product/list',
	getDeliveryItems:'/wechat/deliveryItem/list',
  getDeliveryItemByOld: '/wechat/deliveryItem/oldList',
	addProductToDelivery:'/wechat/deliveryUserProduct/add',
  listByDeviceItemId:'/wechat/deliveryUserProduct/listByDeviceItemId',
	userInfo:'/api/userInfo',
	listShopsBySuppierId:'/api/listShopsBySuppierId', //根据补货员获取列表店铺
	shopRecvRecords:'/api/shopRecvRecords', //店铺收餐
	shopRecvRecords:'/api/shopRecvRecords', //店铺收餐列表
	goods:'/api/goods', //商品列表
	listDevicesBySuppierId:'/api/listDevicesBySuppierId',//根据补货员获取列表设备
	deviceGoods:'/api/deviceGoods', //查询设备的货道商品配置
	supplyGoods:'/api/supplyGoods', //设备补货
	deviceSupplyRecords:'/api/deviceSupplyRecords', //查询补货记录
	exceptionAddrArr:['/api/auth'] //不用token的地址

}

module.exports = { api }
