# Installation

    $ npm install -g module-driven

# Setup

First create yourself the directory for the template folder.

   $ mkdir -p ~/.config/moduleDriven 

Now populate the folder with the files your template files. Use the .mdtmpl extension for any files you want to parameterize. These files will be treated as handlebars templates.

## Example template file (packages.json.mdtmpl)

    {
      "name": "{{name}}",
      "description": "{{description}}",
      "version": "0.0.1",
      "repository": {
        "url": "git://github.com/curious-attempt-bunny/{{name}}.git"
      },
      "main": "index.js",
      "scripts": {
        "test": "tap test/*.js"
      },
      "dependencies": {
      },
      "devDependencies": {
        "tap": "~0.4.3",
        "tape": "~1.0.2"
      }
    }

I've included my template folder as an [example](https://github.com/curious-attempt-bunny/module-driven/tree/master/example).

# Usage

    moduleDriven my-new-nodejs-module-name
