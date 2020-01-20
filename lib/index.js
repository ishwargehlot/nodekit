/**
 * Nodekit is a app generator for Express-based aplications.
 * Easily user set structure in a json file and pass path for the file as command line argument
*/

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var fs = require('fs'),
    exec = require('child_process').execSync,
    /* path is actively used, so I made Python like name */
    os = { path: require('path') },
    pluralize = require('./pluralize'),
    generateRoutes = require('./routes'),
    config = require('./config'),
    files = require('./files');
// templates = require('./templates');

var $WORKING_DIR = process.cwd(),
    $SKIP_VIEWS = false,
    $SKIP_ASSETS = false,
    $SCAFFOLD = false,
    $APP = os.path.join($WORKING_DIR, 'app'),
    // $ASSETS = os.path.join($APP, 'assets'),
    $CONTROLLERS = os.path.join($APP, 'controllers'),
    $MODELS = os.path.join($APP, 'models'),
    // $VIEWS = os.path.join($APP, 'views'),
    $VERSION = '1.0.0',
    // $PREPROCESSORS = {
    //     views: 'pug',
    //     stylesheets: 'css',
    //     javascripts: 'js'
    // },
    $SCHEMA_TYPES = ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'ObjectId', 'Array'];

var skipViewsItems = ['assets', 'views', 'vendor', 'public'];

/**
 * Parses command line arguments and if they are correct, call required action.
 *
 * @method main
 */
function main() {
    var argv = process.argv;
    var $WORKING_DIR = process.cwd();
    console.log("argv =sdfsdf==>", $WORKING_DIR);
}

main();