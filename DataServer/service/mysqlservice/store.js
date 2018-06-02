const query = require('./query');
const Q = require('q');

module.exports = {
	getPosition: uid => {
		let defered = Q.defer();
		query(`SELECT lon, lat FROM store where uid = ${uid}`, (err, results, fields) => {
			if(err)
				defered.reject(err);
			defered.resolve(results);
		})
		return defered.promise;
	},
	getname: position => {
		let defered = Q.defer();
		const sql = `select name from store where lon = ${position.lon} and lat = ${position.lat}`;
		query(sql, (err, result, field) => {
			if(err) defered.reject(err);
			defered.resolve(result);
		});
		return defered.promise;
	}
}