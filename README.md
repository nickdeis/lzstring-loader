# lzstring-loader
lz-string for webpack

Compresses a string and then decompresses it at runtime
Ideal for large JSONs and large CSS files

## Usage

Plain old string
```javascript
var string = require("lzstring!./a.txt");
```
JSON (with json-loader)
```javascript
var json = require("lzstring!json!./a.json");
```

CSS (with style-loader)
```javascript
require("style!lzstring!./a.css");
```

Use other lzstring methods with the query param **to**
```javascript
require("style!lzstring?to=utf16!./a.css");
```

### Query params

#### to

The **default** is (compress/decompress)(To/From)Base64

* **base64:** (compress/decompress)(To/From)Base64
* **utf16:** (compress/decompress)(To/From)UTF16
* **webkit-utf16:** (compress/decompress)
* **uri:** (compress/decompress)(To/From)EncodedURIComponent
* **uint8:** (compress/decompress)(To/From)Uint8Array


## TODO


#### Add support for script-loader

#### Make json-loading a bit more polymorphic

eg:
```javascript
var json = require("json!lzstring!./a.json");
```
