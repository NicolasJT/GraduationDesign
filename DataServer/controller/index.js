const fs = require('fs');
const service = require('../service');

module.exports = {
	management: async(ctx, next) => {
		let managementData = await service.management.getAll();
		let data = [];
		managementData.map(val => {
			let perData = {
				key: val.id,
				number: {
					value: val.number
				},
				driver: {
					editable: false,
					value: val.driver
				},
				tel: {
					editable: false,
					value: val.tel
				},
				volume: {
					editable: false,
					value: val.volume
				}
			}
			data.push(perData);
		});
		ctx.send(data);
	},
	rbac: async(ctx, next) => {
		const uid = ctx.request.body.id;
		console.log('uid', uid);
		let adminData = await service.rbac.getAdmin(uid);
		const model = adminData[0];
		const permissions = [];
		for(let i=0; i<adminData.length; i++){
			permissions.push(adminData[i].url);
		}
		const data = {
			uid: uid,
			permissions: permissions,
			role: model.rolename,
			roletype: model.roletype,
			username: model.displayname
		}
		ctx.send(data);
	},
	//update management
	postManagementObj: async(ctx, next) => {
		let temp = ctx.request.body;let updateManagement = null;
		const id = temp.key;
		const params = [temp.number.value, temp.driver.value, temp.tel.value, temp.volume.value, temp.key];
		try{
			let tag = await service.management.isOne(id);
			if(tag){
				updateManagement = await service.management.updateMan(params);
			}else{
				updateManagement = await service.management.addOne(params);
			}			
		}catch(e){
			console.log(e);
		}
		if(updateManagement !== null)
			ctx.send(updateManagement);
		console.log(updateManagement);
	},
	delMan: async(ctx, next) => {
		let temp = ctx.request.body; let res;
		try{
			res = await service.management.del(temp);
		}catch(e){
			console.log(e);
		}
		ctx.send(res);
		console.log(res);
	},
	stockAll: async(ctx, next) => {
		const allStock = await service.stock.getAll();
		ctx.send(allStock);
	},
	addUser: async(ctx, next) => {
		let temp = ctx.request.body;
		console.log('here');
		const res = await service.users.addUser(temp);
		console.log('res', res);
		ctx.send(res);
	},
	userTest: async(ctx, next) => {
		let userData = ctx.request.body;
		const userInfo = await service.users.userTest(userData);
		ctx.send(userInfo);
	},
	subDemand: async(ctx, next) => {
		let demandData = ctx.request.body;

		let tag = await service.demand.test();
		let createResult;
		if(tag)
			createResult = await service.demand.addDemand();
		let res = await service.demand.insertDemand(demandData);
		ctx.send(res);
	},
	distribute: async(ctx, next) => {
		let managementData = await service.management.getAll();
		let trucks = [];
		managementData.map(item => {
			let perData = {
				number: item.number,
				volume: item.volume,
				isUse: item.use
			}
			trucks.push(perData);
		});
		let demand = await service.demand.getTodayDemand();
		let uid = demand[0].uid;
		let pos = {
			lon: demand[0].lon,
			lat: demand[0].lat
		}
		let lab = [];
		let order = [];
		demand.forEach(item => {
			if(uid !== item.uid){
				lab.push({uid: uid, position: pos, order: order});
				order = [];
				uid = item.uid;
				pos = {
					lon: item.lon,
					lat: item.lat
				}
			}
			order.push({name: item.name, count: item.count, volume: item.volume});
		});
		lab.push({uid: uid, position: pos, order: order});
		const result = service.distribute.calculateDistribute(trucks, lab);
		let res = [];
		for(let i=0; i<result.length; i++){
			let storename = await service.store.getname(result[i].position);
			let obj = {
				car: result[i].truck,
				pos: result[i].position,
				storename: storename 
			}
			console.log(obj);
			res.push(obj);
		}
		ctx.send(res);
	}
}