/**
 * Nodekit is a app generator for Express-based aplications.
 * Easily user set structure in a json file and pass path for the file as command line argument
*/

// command list argument [scope] capitalize
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// init configuration and generation files
const fs = require('fs');
const exec = require('child_process').execSync;
const os = { path: require('path') };
const pluralize = require('./pluralize');
const generateRoutes = require('./routes');
const config = require('./config');
const files = require('./files');
// const templates = require('./templates');

// app folder path
const $WORKING_DIR = process.cwd(),
    $SKIP_VIEWS = false,
    $SKIP_ASSETS = false,
    $SCAFFOLD = false,
    $APP = os.path.join($WORKING_DIR, 'app'),
    $ASSETS = os.path.join($APP, 'assets'),
    $CONTROLLERS = os.path.join($APP, 'controllers'),
    $REPOSITORIES = os.path.join($APP, 'repositories'),
    $VALIDATIONS = os.path.join($APP, 'validations'),
    $SERVICES = os.path.join($APP, 'services'),
    $MODELS = os.path.join($APP, 'models'),
    $VIEWS = os.path.join($APP, 'views'),
    $VERSION = '1.0.0',
    $PREPROCESSORS = {
        views: 'ejs',
        stylesheets: 'css',
        javascripts: 'js'
    };

// schema datatypes 
const $SCHEMA_TYPES = ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'ObjectId', 'Array'];
// skip folder when generate api file structure
var skipViewsItems = ['assets', 'views', 'vendor', 'public'];

/**
 * Project structure
 */
var skeleton = {
    files: ['index.js', '.gitignore'],
    app: {
        assets: {
            images: { files: ['.keep'] },
            javascripts: { files: ['application.js'] },
            stylesheets: { files: ['application.css'] }
        },
        controllers: { files: ['.keep'] },
        models: { files: ['.keep'] },
        repositories: { files: ['.keep'] },
        services: { files: ['.keep'] },
        views: {
            layouts: { files: ['application.ejs'] },
            welcome: { files: ['index.ejs'] }
        },
        helpers: { files: ['.keep'] }
    },
    bin: { files: ['.keep'] },
    config: {
        environments: { files: ['development.js', 'test.js', 'production.js'] },
        files: ['application.js', 'environment.js', 'database.js', 'routes.js', 'globals.js']
    },
    db: { files: ['.keep', 'connection.js', 'util.js'] },
    lib: { files: ['.keep'] },
    log: { files: ['.keep'] },
    languages: { files: ['.english.json', 'language.js'] },
    middleware: {
        files: ['.keep']
    },
    public: {
        files: ['404.ejs', '500.ejs', 'favicon.ico', 'robots.txt']
    },
    test: {
        controllers: { files: ['.keep'] },
        models: { files: ['.keep'] },
        helpers: { files: ['.keep'] }
    },
    tmp: { files: ['.keep'] },
    vendor: {
        javascripts: { files: ['.keep'] },
        stylesheets: { files: ['.keep'] }
    }
};

/**
 * Checks if argument is object
 *
 * @method isObject
 * @param {Any} obj value to be checked
 * @return Boolean
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Generates project folders structure
 */
function generateSkeleton(skeleton, path) {
    for (key in skeleton) {
        if (skeleton.hasOwnProperty(key)) {
            if ($SKIP_VIEWS && skipViewsItems.indexOf(key) >= 0) {
                continue;
            }

            if (isObject(skeleton[key])) {
                console.log('Creating folder', os.path.join(path, key));
                fs.mkdirSync(os.path.join(path, key));
                generateSkeleton(skeleton[key], os.path.join(path, key));
            } else if (key === 'files') {
                files.createFiles(skeleton.files, path);
            }
        }
    }
}

function generatePackageJson(projectPath, appName) {
    var packageJson = '{\n' +
        '  "name": "' + appName + '",\n' +
        '  "version": "0.0.1",\n' +
        '  "description": "",\n' +
        '  "main": "index.js",\n' +
        '  "license": "ISC"\n' +
        '}';

    files.createFile(os.path.join(projectPath, 'package.json'), packageJson)
}

function npmInit(projectPath) {

    console.log('#################### Installing Dependencies ######################');
    process.chdir(projectPath);
    console.log('Running: npm install express --save');
    exec('npm install express --save');
    console.log('Running: npm install body-parser --save');
    exec('npm install body-parser --save');
    console.log('Running: npm install mongoose --save');
    exec('npm install mongoose --save');
    console.log('Running: npm install async --save');
    exec('npm install async --save');

    console.log('Running: npm install @babel/runtime --save');
    exec('npm install @babel/runtime --save');

    console.log('Running: npm install bcrypt --save');
    exec('npm install bcrypt --save');

    console.log('Running: npm install bcrypt --save');
    exec('npm install bcrypt --save');

    console.log('Running: npm install cors --save');
    exec('npm install cors --save');

    console.log('Running: npm install dotenv --save');
    exec('npm install dotenv --save');

    console.log('Running: npm install express-useragent --save');
    exec('npm install express-useragent --save');

    console.log('Running: npm install express-validator --save');
    exec('npm install express-validator --save');

    console.log('Running: npm install image-to-base64 --save');
    exec('npm install image-to-base64 --save');

    console.log('Running: npm install image-to-uri --save');
    exec('npm install image-to-uri --save');

    console.log('Running: npm install jsonwebtoken --save');
    exec('npm install jsonwebtoken --save');

    console.log('Running: npm install moment --save');
    exec('npm install moment --save');

    // console.log('Running: npm install request --save');
    // exec('npm install request --save');

    // console.log('Running: npm install request-promise --save');
    // exec('npm install request-promise --save');

    console.log('#################### Installing DevDependencies ######################');

    console.log('Running: npm install -D nodemon --save');
    exec('npm install -D nodemon --save');

    if (!$SKIP_VIEWS) {
        console.log('Running: npm install ejs --save');
        exec('npm install ejs --save');
    }
}

/**
 *
 */
function getControllerContents(name, methods) {
    return templates.render('dynamic/controller', { methods: methods });
}

/**
 * Generates a new controller. If $SKIP_VIEWS is false, generateViews will be executed.
 * Views folder name is first argument of the generateController function, views names the same as
 * methods.
 *
 * ! For now routes would not be generated automatically. This feature is on the road map
 *
 * @method generateController
 * @param {String} name controller name
 * @param {Array} methods a list of methods to be added to the controller
 */
function generateController(name, methods) {
    var pluralName = pluralize(name),
        fullName = pluralName + '_controller.js',
        contents = getControllerContents(pluralName, methods);

    files.createFile(os.path.join($CONTROLLERS, fullName), contents);

    if (!$SKIP_VIEWS && methods) {
        generateViews(pluralName, methods);
    }

    if (!$SKIP_ASSETS) {
        generateAssets(pluralName);
    }

    generateRoutes(pluralName, fullName, methods, $SCAFFOLD);
}

/**
 * Generates javascript and stylesheet files.
 *
 * @method generateAssets
 *
 * @param {String} name name of file as is.
 */
function generateAssets(name) {
    var js = os.path.join($ASSETS, 'javascripts', name + '.' + $PREPROCESSORS.javascripts),
        css = os.path.join($ASSETS, 'stylesheets', name + '.' + $PREPROCESSORS.stylesheets);

    files.createFile(js);
    files.createFile(css);
}

function getDefaultViewContent(viewPath) {
    return "extends ../layouts/application.ejs\n\n" +
        "block content\n" +
        "  p You can find this view template at " + viewPath;
}

/**
 * Generates new views
 *
 * @method generateViews
 *
 * @param {String} dirName a directory for new views
 * @param {Array} methods a list of views to be generated
 */
function generateViews(dirName, views) {
    var viewsPath = os.path.join($VIEWS, dirName),
        view = null;

    /* If views directory does not exist - skip this step */
    if (!fs.existsSync($VIEWS)) {
        return;
    }

    if (!fs.existsSync(os.path.join($VIEWS, dirName))) {
        fs.mkdirSync(os.path.join($VIEWS, dirName));
    }

    for (var i = 0; i < views.length; i++) {
        /* Don't create views in the array if scaffold has been called */
        if ($SCAFFOLD && ['create', 'update', 'delete'].indexOf(views[i]) >= 0) {
            continue;
        }

        view = views[i] + '.' + $PREPROCESSORS.views;

        var content = getDefaultViewContent(os.path.join(viewsPath, view));
        files.createFile(os.path.join(viewsPath, view), content);
    }
}

/**
 * Generates mongoose compatible schema object.
 *
 * @method createMongooseSchema
 *
 * @param {Array} props - an array of model properties. Each item is a string 'name:type:required'
 *                        where only 'name' is required part. If type is omitted, then the default
 *                        value (String) will be used.
 */
function createMongooseSchema(options) {
    var modelName = options.name,
        nameCap = modelName.capitalize(),
        schemaName = nameCap + "Schema",
        propsRaw = options.props,
        props = [],
        splitted = null;

    propsRaw.forEach(function (val, i) {
        splitted = val.split(':');
        var name = splitted[0],
            type = splitted[1],
            required = splitted[2];

        if (splitted.length === 2 && type === 'true') {
            type = null;
            required = 'true';
        }

        if (!type) {
            type = 'String';
        }

        if ($SCHEMA_TYPES.indexOf(type.capitalize()) < 0) {
            console.error('Unknown type', type, 'for', name);
            process.exit(1);
        }

        props.push({ name: name, type: type.capitalize(), required: required });
    });

    return templates.render('dynamic/model', {
        name: modelName, nameCap: nameCap,
        schemaName: schemaName, props: props
    });
}

/**
 * Generates a new model
 *
 * @method generateModel
 *
 * @param {String} name model name
 * @prop {Array} props an array of properties. A property of collon seperated strings.
 * propName:propType:required:defaultValue. Example: login:string:required,
 * created_at:date:required:now
 *
 */
function generateModel(name, props) {
    var schema = createMongooseSchema({ name: name, props: props });

    /* If models directory does not exist - skip this step */
    /* TODO: add logging here */
    if (!fs.existsSync($MODELS)) {
        return;
    }

    files.createFile(os.path.join($MODELS, name + '.js'), schema);
}

function setPreprocessors() {
    var preprocessors = null;

    try {
        preprocessors = require(os.path.join($WORKING_DIR, 'config/application')).preprocessors;
    } catch (e) {
        // console.log("Can't find config/application.js");
    }

    if (!preprocessors) {
        return;
    } else {
        if (preprocessors.views) {
            $PREPROCESSORS.views = preprocessors.views;
        }

        if (preprocessors.stylesheets) {
            $PREPROCESSORS.stylesheets = preprocessors.stylesheets;
        }

        if (preprocessors.javascripts) {
            $PREPROCESSORS.javascripts = preprocessors.javascripts;
        }
    }
}

/**
 * Parses command line arguments and if they are correct, call required action.
 *
 * @method main
 */
function main() {
    var argv = process.argv;

    if (!fs.existsSync($ASSETS)) {
        $SKIP_ASSETS = true;
    }

    setPreprocessors();

    console.log("argv==>", argv);

    // check command line argument is perfect or not
    if (argv.length === 2) {
        console.log('=> Unknown command "' + argv[2] + '"');
        return;
    }

    if (argv[2] === 'new') {
        if (argv.length === 3) {
            console.log("No value provided for required arguments 'app_path'");
            console.log('Usage: nodekit new project_name.');
            console.log('Example: nodekit new blog');

            return
        }
    }

}

main();