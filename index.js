var tweezers   = require('tweezers');
var walker     = require('walker');
var path       = require('path');
var mkdirp     = require('mkdirp');
var fs         = require('fs');
var handlebars = require('handlebars');
var readline   = require('readline');
var Stream     = require('stream');

module.exports = function(templateDirectory, outputParentDirectory) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var pathFor = function(source) {
    return path.join(outputParentDirectory, source.substring(templateDirectory.length));
  };
  var context = {};
  var files = [];
  walker(templateDirectory)
    .on('dir', function(directory) {
      console.log(directory, pathFor(directory));
      mkdirp(pathFor(directory), function(err) { if (err) throw err; });
    })
    .on('file', function(file) {
      files.push(file);
    })
    .on('end', function() {
      processFiles(files);
    });  

  var processFiles = function(files) {
    if (files.length == 0) {
      rl.close();
      return;
    }

    var file = files.shift();

    var content = fs.readFileSync(file);
    var outputFile = pathFor(file);
    var output = content;

    if (!/\.mdtmpl$/.test(file)) {
      fs.writeFileSync(outputFile, output);
      processFiles(files);
      return;
    }
    
    outputFile = outputFile.substring(0, outputFile.length - ".mdtmpl".length);
    var stringContent = content.toString();
    var args = tweezers(stringContent);

    var populateContext = function(keys) {
      if (keys.length == 0) {
        var template = handlebars.compile(stringContent);
        output = template(context);
        fs.writeFileSync(outputFile, output);
        processFiles(files);
        return;
      }

      var key = keys.shift();
      if (context[key]) {
        populateContext(keys);
        return;
      }

      rl.question(key+": ", function(value) {
        context[key] = value;
        populateContext(keys);
      });
    };
    populateContext(Object.keys(args));
  };
}
