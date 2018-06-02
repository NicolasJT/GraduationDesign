const query = require('./query');
const Q = require('q');

module.exports = {
	getAll: () => {
		let defered = Q.defer();
		query('SELECT * FROM vehicle.stock;', (err, results, fields) => {
			if(err)
				defered.reject(err);
			defered.resolve(results);
		})
		return defered.promise;
	},
	getVolume: name => {
		let defered = Q.defer();
		const sql = `SELECT volume FROM vehicle.stock where name = '${name}'`;
		query(sql, (err, results, fields) => {
			if(err)
				defered.reject(err);
			defered.resolve(results);
		})
		return defered.promise;
	}
}