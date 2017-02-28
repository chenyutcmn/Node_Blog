exports.isEmpty = function(obj){
	for(var key in obj){
		if(obj[key]) return false;
	}
	return true;
}