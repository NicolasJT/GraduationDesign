const query = require('./query');
const Q = require('q');
const createConnection = require('./createConnection');

module.exports = {	
	test: () => {
		let defered = Q.defer();
		const date = new Date();
		const baseName = date.toLocaleDateString().replace('-', '_').replace('-', '_');
		const UserDemand = `USER_DEMAND_${baseName}`;

		const existUserDemand = `SELECT TABLE_NAME 
			FROM INFORMATION_SCHEMA.TABLES
			WHERE TABLE_TYPE = 'BASE TABLE' AND 
			TABLE_SCHEMA='vehicle' and 
			table_name = '${UserDemand}'`;
		query(existUserDemand, (err, result, field) => {
			if(err) defered.reject(err);
			if(result.length === 0)
				defered.resolve(true);
			defered.resolve(false);
		});
		return defered.promise;
	},
	addDemand: () => {
		let defered = Q.defer();
		const date = new Date();
		const baseName = date.toLocaleDateString().replace('-', '_').replace('-', '_');
		const UserDemand = `USER_DEMAND_${baseName}`;
		
		const createUserDemand = `CREATE TABLE ${UserDemand} (
	  		id INT NOT NULL AUTO_INCREMENT,
	  		uid INT NOT NULL,
	  		name VARCHAR(255) NOT NULL,
	  		count INT NOT NULL,
	  		PRIMARY KEY (id))
			ENGINE = InnoDB
			DEFAULT CHARACTER SET = utf8;`;
		
		query(createUserDemand, (err, result, field) => {
			if(err) defered.reject(err);
			defered.resolve(true);
		})	
		return defered.promise;
	},
	insertDemand: demandData => {
		let defered = Q.defer();
		const date = new Date();
		const baseName = date.toLocaleDateString().replace('-', '_').replace('-', '_');
		const UserDemand = `USER_DEMAND_${baseName}`;

		const uid = demandData.id;
		const demand = demandData.demand;
		let values = [];
		demand.forEach(item => {
			const data = [uid, item.name, item.count];
			values.push(data);
		})
		let insertSql = `insert into ${UserDemand}(uid, name, count) values ?;`;
		var conn = createConnection();
		conn.query(insertSql, [values], (err, result, field) => {
			if(err) defered.reject(err);
			defered.resolve('sub suc!');
		});
		return defered.promise;
	},
	getTodayDemand: () => {
		let defered = Q.defer();
		const date = new Date();
		const baseName = date.toLocaleDateString().replace('-', '_').replace('-', '_');
		const UserDemand = `USER_DEMAND_${baseName}`;
		const sql = `select ${UserDemand}.uid,
					${UserDemand}.name,
					${UserDemand}.count,
					stock.volume,
					store.lon,
					store.lat
					from ${UserDemand}, stock, store
					where ${UserDemand}.name = stock.name and
					${UserDemand}.uid = store.uid
					order by ${UserDemand}.uid`;
		query(sql, (err, result, field) => {
			if(err) defered.reject(err);
			defered.resolve(result);
		});
		return defered.promise;
	}
}