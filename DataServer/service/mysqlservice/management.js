const mysql = require('mysql');
const Q = require('q');
const config = require('./config');

const poolConn = mysql.createPool(config);
let query = (sql, params) => {
	let defered = Q.defer();
	poolConn.getConnection( (err, conn) => {
		if(err){
			defered.reject({
                errCode: err.sqlState,
                errMag: err.code
            });
		}else{
			let query = conn.query(sql, params, (err, results, fields) => {
				if(err){
					defered.reject({
						errCode: err.sqlState,
						errMsg: err.code
					})
				}else{
					defered.resolve({
						error: err,
						results: results,
						fields: fields					
					})
				}
			});
			conn.release();
		}
	})
	return defered.promise;
}
module.exports = {
	getAll: () => {
		let defered = Q.defer();
		query('select * from management', (err, results, fields) => {
			if(err){
				defered.reject(err);
			}else{
				defered.resolve(results);
			}
		});
		return defered.promise;
	},
	updateMan: params => {
		let defered = Q.defer();
		query(`UPDATE vehicle.management SET number = '${params[0]}', driver = '${params[1]}', tel = '${params[2]}', volume = '${params[3]}' WHERE id = ${params[4]}`,
			    (err, results, fields) => {
					if(err)
						defered.reject(err);
					defered.resolve('updated!');
				});
		return defered.promise;
	},
	isOne: id => {
		let defered = Q.defer();
		query(`select * from management where id = ${id}`, (err, result, field) => {
			if(err)
				defered.reject(err)
			if(result.length > 0)
				defered.resolve(true);
			defered.resolve(false);
		});
		return defered.promise;
	},
	addOne: params => {
		let defered = Q.defer();
		query(`INSERT INTO management (number, driver, tel, volume) VALUES ('${params[0]}', '${params[1]}', '${params[2]}', ${params[3]});`,
			(err, result, field) => {
				if(err)
					defered.reject(err);
				defered.resolve('added!');
			});
		return defered.promise;
	},
	del: params => {
		let defered = Q.defer();
		query(`delete from management where id in (${params})`, (err, result, field) => {
			if(err)
				defered.reject(err);
			defered.resolve('deleted!');
		});
		return defered.promise;
	}
}