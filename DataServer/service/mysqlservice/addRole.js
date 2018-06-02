const query = require('./query');
const Q = require('q');

module.exports = {
	isUser: email => {
		let defered = Q.defer();
		query(`select id from users where email = '${email}'`, (err, result , fields) => {
			if(err)
				defered.reject(err);
			if(result.length > 0)
				defered.resolve(result[0].id);
			defered.resolve(false);
		});
		return defered.promise;
	},
	addShopKeeper: userId => {
		let defered = Q.defer();
		const sql = 'insert into user_role (userid, typeid) values (?, ?)';
		query(sql, [userId, 2], (err, results, fields) => {
			if(err)
				defered.reject(err);
			defered.resolve(true);
		});
		return defered.promise;
	},
	addTruckKeeper: userId => {
		let defered = Q.defer();
		const sql = 'insert into user_role (userid, typeid) values (?, ?)';
		query(sql, [userId, 3], (err, results, fields) => {
			if(err)
				defered.reject(err);
			defered.resolve(true);
		});
		return defered.promise;
	},
	addAdmin: userId => {
		let defered = Q.defer();
		const typeId = 1;
		const sql = 'insert into user_role (userid, typeid) values (?, ?)';
		const params = [userId, typeId];
		query(sql, params, (err, results, fields) => {
			if(err)
				defered.reject(err);
			defered.resolve(true);
		});
		return defered.promise;
	}
}