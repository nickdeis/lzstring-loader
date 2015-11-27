var assert = require("assert");

//require("style!lzstring!raw!./a.css");
//require("style!../index.js!raw!./a.css");

const TXT = "A text file";

const json = {
  "a":true,
  "b":1
};



const IWORK = "I work!";

describe("Test basic functionality",function(){
  it("Text file",function(){
    assert.equal(require("../index.js!./a.txt"),TXT);
  });
  it("JSON object",function(){
    assert.deepEqual(require("../index.js!json!./a.json"),json);
  });
  it("Script",function(){
    require("script!./a.js");
    assert.equal(doIwork(),IWORK);
  });
});

describe("Test query params",function(){
  it("UTF16",function(){
    assert.equal(require("../index.js?to=utf16!./a.txt"),TXT);
  });

});
