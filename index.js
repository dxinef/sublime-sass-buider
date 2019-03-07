const path = require('path');
const promisify = require('util').promisify;
const execSync = require('child_process').execSync;
const writeFile = promisify(require("fs").writeFile);

const NPM_PREFIX = execSync('npm prefix -g').toString().trim();
const GLOBAL_MODULE_DIR = path.join(NPM_PREFIX, 'node_modules');

function requireGlobalModule(file) {
  return require(path.join(GLOBAL_MODULE_DIR, file));
}

const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sassParser = promisify(requireGlobalModule('node-sass').render);

// argv
var args = process.argv.slice(2);
var options = {
  inputfile: args[0],
  outputfile: args[1],
  minifyType: args.indexOf("--nano") > -1 ? 'nano' : args.indexOf("--compress") > -1 ? 'compressed' : 'expanded',
  sourceMap: args.indexOf("--sourcemap") > -1
};
if (!options.inputfile) {
  console.log('no input file');
  return;
}

// node-sass render
(async function (options) {
  let sassResult = await sassParser({
    file: options.inputfile,
    outFile: options.outputfile,
    outputStyle : options.minifyType == 'compressed' ? 'compressed' : 'expanded',
    sourceMap : options.sourceMap
  });

  let createMap = options.sourceMap ? sassResult.map.toString("utf8") : false;

  let postcssPlugins = (() => {
    let arr = [autoprefixer()];
    if (options.minifyType == 'nano') arr.push(cssnano({safe: true}));
    return arr;
  })();

  let postcssResult = await postcss(postcssPlugins).process(sassResult.css, {
      from : options.inputfile,
      to: options.outputfile,
      map : options.sourceMap ? {
            inline: false,
            sourcesContent: false,
            prev: createMap
          } : false
    });

  writeFile(options.outputfile, postcssResult.css, "utf8");
  console.log("output \"", options.outputfile, "\" success");
  if(createMap) {
    writeFile(options.outputfile + ".map", postcssResult.map, "utf8");
    console.log("output \"", options.outputfile + ".map", "\" success");
  }

})(options);

