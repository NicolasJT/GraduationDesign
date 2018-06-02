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
module.exports = query;