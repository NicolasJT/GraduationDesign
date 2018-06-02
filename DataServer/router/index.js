const router = require('koa-router')();
const homeController = require('../controller');

module.exports = app => {
	router.get('/management', homeController.management);
	router.post('/rbac', homeController.rbac);
	router.post('/postManagementObj', homeController.postManagementObj);
	router.post('/delman', homeController.delMan);
	router.get('/stock', homeController.stockAll);
	router.post('/adduser', homeController.addUser);
	router.post('/usertest', homeController.userTest);
	router.post('/subdemand', homeController.subDemand);
	router.get('/distribute', homeController.distribute);
	app.use(router.routes(),router.allowedMethods());
}