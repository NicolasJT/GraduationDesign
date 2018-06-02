const store = require('../mysqlservice/store')
const stock = require('../mysqlservice/stock')
const lat = 0.073248;
const lon = 0.090010;
sortIdV = (a, b) => {
	return b.totalVolume - a.totalVolume;
}
findUsefulTruck = trucks => {
	for(let i=0; i< trucks.length; i++){
		if(trucks[i].isUse === 0)
			return trucks[i];
	}
}
setUsed = (useTruck, trucks) => {
	trucks.forEach(item => {
		if(item === useTruck){
			item.isUse = 1;
		}
	})
	return trucks;
}
//双子楼31.770881,117.2041756,17 老区31.844129,117.2941862
withIn = (pos1, pos2) => {
	if(pos1 === pos2)
		return false;
	let derLon = pos1.lon - pos2.lon;
	derLon = derLon > 0 ? derLon : -derLon;
	let derLat = pos1.lat - pos2.lat;
	derLat = derLat > 0 ? derLat : -derLat;
	if(derLon < lon && derLat < lat){
		return true;
	}
	return false;
}
findUsefulSet = (totalDemand, dert, pos) => {
	let result = [];
	totalDemand.forEach(item => {
		if(item.totalVolume < dert && withIn(item.position, pos))
			result.push(item);
		return result.sort(sortIdV);
	})
}
relation = (surp, totalDemand) => {
	let res = [];
	totalDemand.forEach(item =>{
		if(withIn(surp.position, item.position)){
			if(item.totalVolume > 0){
				res.push(item);
			}
		}
	})
	return res;
}
setZero = (totalDemand, i) => {
	totalDemand.forEach(item => {
		if(item === i){
			item.volume = 0;
		}
	})
	return totalDemand;
}
module.exports = {
	calculateDistribute: (trucks, lab) => {
		let totalDemand = [];
		lab.forEach(item => {
			const uid = item.uid;
			const order = item.order;
			const position = item.position;
			let totalVolume = 0;
			order.forEach(iorder => {
				totalVolume = totalVolume + iorder.volume * iorder.count;
			});
			totalDemand.push({
				uid: uid,
				position: position,
				totalVolume: totalVolume
			})
		});
		totalDemand.sort(sortIdV);
		let result = [];
		totalDemand.forEach(item => {
			console.log('<<<<<<', item);
			let usefulTruck = findUsefulTruck(trucks);
			//console.log('8888', usefulTruck);
			if(usefulTruck){
				let dert = item.totalVolume - usefulTruck.volume;
				while(dert > 0){
					result.push({truck: usefulTruck, position: item.position});
					trucks = setUsed(usefulTruck, trucks);
					item.totalVolume = dert;
					usefulTruck = findUsefulTruck(trucks);
					if(usefulTruck){
						dert = item.totalVolume - usefulTruck.volume;
					}else{
						console.log('no truck to use!');
						dert = 0;
					}
				}
				if(dert < 0){

					let userfulSet = findUsefulSet(totalDemand, -dert, item.position);
					if(userfulSet !== undefined){
						console.log('******this part is running', userfulSet);
						userfulSet.forEach(iset => {
							console.log('userfulSet\n', userfulSet);
							let space = dert + iset.totalVolume;
							if(space < 0){
								result.push({truck: usefulTruck, position: item.position});
								iset.totalVolume = 0;
								dert = space;
							}else{
								space = space - iset.totalVolume;
							}
						})
					}
				}
			}else{
				console.log('--no truck to use!');
			}
		})
		totalDemand.forEach(surp => {
			if(surp.totalVolume > 0){
				let usefulTruck = findUsefulTruck(trucks);
				trucks = setUsed(usefulTruck, trucks);

				let spaceSurp = usefulTruck.volume - surp.totalVolume;
				surp.totalVolume = 0;
				result.push({truck: usefulTruck, position: surp.position})
				let set = relation(surp, totalDemand);
				if(set !== undefined && set.length > 0){
					console.log('-----------------\n');
					console.log('get set!', set);
					console.log('space', spaceSurp);
					set.forEach(i => {
						if(spaceSurp > i.totalVolume){
							console.log('-_-===================');
							spaceSurp = spaceSurp - i.volume;
							totalDemand = setZero(totalDemand, i);
							result.push({truck: usefulTruck, position: i.position});
						}
					})
				}
			}
		})
		trucks.forEach(item => {
			console.log('>>>>>>', item);
		})
		result.forEach(item => {
			console.log('result\n', item);
		})
		console.log('-------------------------\n');
		totalDemand.forEach(item => console.log(item));
		return result;
	}
}