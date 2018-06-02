const query = require('./query');
const Q = require('q');

module.exports = {
	getAdmin: uid => {
		const adminSql = `select permission.url, users.displayname, roles.rolename, roles.roletype from
					users, roles, permission, user_role, role_permission 
					where 
					permission.id = role_permission.permissionid and 
					role_permission.roleid = roles.id and
                    users.id = user_role.userid and
					user_role.userid = ${uid}`;
		let defered = Q.defer();
		query(adminSql, (err, results, fields) => {
			if(err)
				defered.reject(err);
			defered.resolve(results);
		});
		return defered.promise;
	} 
}