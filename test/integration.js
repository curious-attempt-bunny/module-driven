var test         = require('tape');
var moduleDriven = require('..');
var fs           = require('fs');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


test('apply example', function(t) {
  moduleDriven('../example', '../tmp', {context: {name: 'foo', description: 'bar'}}, function() {
    t.ok(fs.existsSync('../tmp/package.json'), 'Expected mdtmpl extension to be stripped');
    t.equal(JSON.parse(fs.readFileSync('../tmp/package.json')).name, 'foo');
    t.ok(fs.existsSync('../tmp/.gitignore'), 'Expected non template file to be present');
    t.ok(fs.existsSync('../tmp/test'), 'Expected directory to be present');
    t.end();

    deleteFolderRecursive('../tmp');
  });
});
