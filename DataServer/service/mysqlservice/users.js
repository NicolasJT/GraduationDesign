const query = require('./query');
const Q = require('q');
const bcrypt = require('bcryptjs');
const addRole = require('./addRole');
module.exports = {
	addUser: async userData => {
		let defered = Q.defer();
		userId = await addRole.isUser(userData.email);
		if(!userId){
			var salt = bcrypt.genSaltSync(10);
			var passwordHash = bcrypt.hashSync(userData.password, salt);
			let time = new Date();
			const insertData = [userData.email, userData.password, userData.nickname, time];
			const userInfo = {
				email: userData.email,
				displayname: userData.nickname
			}
			const sql1 = 'INSERT INTO users ( email, password, displayname, date_created) values (?,?,?,?)';
			query(sql1, insertData, (err, results, fields) => {
				if(err)
					defered.reject(err);
			})
		}
		userId = await addRole.isUser(userData.email);
		if(userId){
			console.log('userId', userId);
			let type;
			if(userData.shopKeeper){
				type = 2;
			}
			if(userData.truckKeeper)
				type = 3;
			if(userData.admin){
				type = 1;
			}
			const sql2 = 'insert into user_role (userid, typeid) values (?, ?)';
			const params = [userId, type];
			query(sql2, params, (err, result, field) => {
				if(err)
					defered.reject(err)
			});
			defered.resolve(userId);
		}
		return defered.promise;
	},
	userTest: async userData => {
		let defered = Q.defer();
		const sql = `SELECT users.id, roles.rolename 
		from users, roles, user_role 
		where users.email = '${userData.email}' and 
		users.password = '${userData.password}' and 
		users.id = user_role.userid and 
		user_role.typeid = roles.roletype`;
		const params = [userData.email, userData.password];
		query(sql, (err, result, field) => {
			if(err)
				defered.reject(err);
			if(result.length > 0)
				defered.resolve(result[0]);
			defered.resolve(false);
		});
		return defered.promise;
	}
}