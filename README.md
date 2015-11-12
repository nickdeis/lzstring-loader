# lzstring-loader
lz-string for webpack

Compresses a string and then decompresses it on in the bundle.

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

### TODO

Add support for all lzstring encodings via query params
eg:
```javascript
var string = require("lzstring?utf16!./a.txt");
```
