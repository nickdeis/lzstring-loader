var lzstr = require("lz-string");

var zippers = {
	base64:{
		compress(content){
			return lzstr.compressToBase64(content);
		},
		decompress(compressed){
			return `lzstr.decompressFromBase64(${compressed})`;
		}
	}
}

const DECOMPRESS = "lzstr.decompressFromBase64";
var compressContent = function(content){
	return lzstr.compressToBase64(content);
}

var stringify = function(content){
	var t = typeof content;
	switch(t){
		case "object":return JSON.stringify(content);
		case "string":return content;
		case "function":return content.toString();
	}
}

var resolveContent = function(self,content,type){
	var val = self.inputValue || content;
	if(Array.isArray(val)) return stringify(val[0]);
	else return stringify(val);
}

var getLastLoader = function(self){
	var lastLoader = self.loaders[self.loaderIndex+1];
	if(!lastLoader) return false;
	if(!lastLoader.path) return false;
	var path = lastLoader.path.split("\\");
	var lastloader = path[path.length-2];
	if(!lastloader) return false;
	return lastloader;
}

var getParaType = function(query){
	if(!query) return false;
	if(!(query[0] === "?"))return false;
	var params = query.replace("?","").split("&");
	if(!params[0]) return false;
	return params;
}

var resolveType = function(self){
	var qtype = getParaType(self.query);
	switch(qtype){
		case "json": return "json";
		case "style": return "style";
	}
	var lastloader = getLastLoader(self);
	switch(lastloader){
		case "json-loader": return "json";
		case "style-loader": return "style";
	}
	return "string";
}



var inlines = {
	json(uncompressed){
		return `JSON.parse(${uncompressed})`;
	},
	string(uncompressed){
		return `${uncompressed}`;
	}
}



var inliner = function(compressed,type){
	var inline = inlines[type] || inlines["string"];
	var resolved = inline(`${DECOMPRESS}("${compressed}")`);
	return `
	var lzstr = require("lz-string");
	module.exports = ${resolved};
	`;
}

module.exports = function(content) {
	var self = this;
	self.cacheable && self.cacheable();
	var type = resolveType(self);
	var content = resolveContent(self,content,type);
	var compressed = compressContent(content);
	self.value = [compressed];
	var inlined = inliner(compressed,type);
	return inlined;
}
