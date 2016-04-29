var globalModulesPath = process.env.APPDATA + "\\npm\\node_modules\\";

var fs = require("fs");
var path = require("path");

var sassParser = require(globalModulesPath + "node-sass");
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');

// argv
var args = process.argv.slice(2);
var options = {
    inputfile : args[0],
    outputfile : args[1],
    outputStyle : args.indexOf("--compresse") > -1 ? "compressed" : "expanded",
    sourceMap : args.indexOf("--sourceMap") > -1 ? true : false
}


// node-sass render
sassParser.render({
        file: options.inputfile,
        outFile: options.outputfile,
        outputStyle : options.outputStyle,
        sourceMap : options.sourceMap
        //[, options..]
    }, 
    (err, result) => {
        if(err) console.error("error:", err);
        var css = result.css,
            map = options.sourceMap ? result.map.toString("utf8") : false;

        var postcssOpt = {
            from : options.inputfile,
            to: options.outputfile,
            map : options.sourceMap ? {
                    inline: false,
                    sourcesContent: false,
                    prev: map
                } : false
        }
        // postcss process
        postcss([autoprefixer]).process(css, postcssOpt).then((postcssResult)=>{
                fs.writeFile(options.outputfile, postcssResult.css, "utf8");
                console.log("output \"", options.inputfile, "\" success");
                if(map) {
                    fs.writeFile(options.outputfile + ".map", postcssResult.map, "utf8");
                    console.log("output \"", options.outputfile + ".map", "\" success");
                }
            }
        );
        
    }
);