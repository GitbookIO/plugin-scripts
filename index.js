var _ = require('lodash');
var path = require('path');
var tmp = require('tmp');
var fs = require('fs');

// Small hack for gitbook < 3.0.0
// where the function is called multiple times
var result;

function getAssets() {
    if (!result) {
        var book = this;
        var tmpobj = tmp.dirSync();
        var files = this.config.get('pluginsConfig.scripts.files', []);
        var jsfiles = [];

        files.forEach(function(file) {
            book.log.debug.ln('copying script', file);
            var origin = book.resolve(file);
            var filename = Date.now() + '-' + path.basename(origin);
            var output = path.resolve(tmpobj.name, filename);

            var content = fs.readFileSync(origin);
            fs.writeFileSync(output, content);

            jsfiles.push(filename);
        });

        result = {
            assets: tmpobj.name,
            js: jsfiles
        };
    }

    return  _.cloneDeep(result);
}

module.exports = {
    website: getAssets
};
