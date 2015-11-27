var lzstr = require("lz-string"),
querystring = require("querystring");

var zippers = {
	base64:{
		compress(content){
			return lzstr.compressToBase64(content);
		},
		decompress(compressed){
			return `lzstr.decompressFromBase64("${compressed}")`;
		}
	},
	utf16:{
		compress(content){
			return lzstr.compressToUTF16(content);
		},
		decompress(compressed){
			return `lzstr.decompressFromUTF16("${compressed}")`;
		}
	},
	"webkit-utf16":{
		compress(content){
			return lzstr.compress(content);
		},
		decompress(compressed){
			return `lzstr.decompress("${compressed}")`;
		}
	},
	"uri":{
		compress(content){
			return lzstr.compressToEncodedURIComponent(content);
		},
		decompress(compressed){
			return `lzstr.decompressFromEncodedURIComponent("${compressed}")`;
		}
	},
	"uint8":{
		compress(content){
			return lzstr.compressToUint8Array(content);
		},
		decompress(compressed){
			return `lzstr.decompressFromUint8Array("${compressed}")`;
		}
	}
}

const DECOMPRESS = "lzstr.decompressFromBase64";
var compressContent = function(content,params){
	if(params && params.to && zippers[params.to]){
		return zippers[params.to].compress(content);
	}
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

var parseQuery = function(query){
	if(!query) return false;
	var params = querystring.parse(query.replace("?",""));
	return params;
}

var resolveType = function(self){
	var lastloader = getLastLoader(self);
	switch(lastloader){
		case "json-loader": return "json";
		case "style-loader": return "style";
	}
	return "string";
}



var transformers = {
	json(uncompressed){
		return `JSON.parse(${uncompressed})`;
	},
	string(uncompressed){
		return `${uncompressed}`;
	}
}

var inlineDecompress = function(compressed,params){
	if(params && params.to && zippers[params.to]){
		return zippers[params.to].decompress(compressed);
	}
	return zippers.base64.decompress(compressed);
}

var inliner = function(compressed,type,params){
	var transformer = transformers[type] || transformers["string"];
	var resolved = transformer(inlineDecompress(compressed,params));
	return `
	var lzstr = require("lz-string");
	module.exports = ${resolved};
	`;
}

module.exports = function(content) {
	var self = this;
	self.cacheable && self.cacheable();
	var params = parseQuery(self.query);
	var type = resolveType(self);
	var content = resolveContent(self,content,type);
	var compressed = compressContent(content,params);
	self.value = [compressed];
	var inlined = inliner(compressed,type,params);
	return inlined;
}
