const fs = require('file-system');
const path = require('path');

function HelloWorldPlugin(options) {
    // Setup the plugin instance with options...
    console.log(options);
    this.namedChunksTemp = options.namedChunksTemp;
}

HelloWorldPlugin.prototype.apply = function (compiler) {
    var self = this;

    // Setup callback for accessing a compilation:
    // compiler.plugin("compilation", function (compilation) {

    //     console.log(compilation);

    //     // Now setup callbacks for accessing compilation steps:
    //     // compilation.plugin("optimize", function () {
    //     //     console.log("Assets are being optimized.");
    //     // });
    //     // compilation.plugin("after-optimize-modules", function (modules) {
    //     //     console.log(modules);
    //     // });
    //     // compilation.plugin("after-hash", function (modules) {
    //     //     console.log(modules);
    //     // });
    // });

    // compiler.plugin('emit', function (compilation) {
    //     console.log(compilation);
    // });

    // compiler.plugin('after-emit', function (compilation) {
    //     console.log('Hello World!');
    //     /**
    //      * 资源输出到目录完成后，获取资源文件信息
    //      */
    //     // console.log(compilation.namedChunks);
    //     var namedChunks = [];
    //     for (var k in compilation.namedChunks) {
    //         var chunk = compilation.namedChunks[k];
    //         if (chunk) {
    //             namedChunks.push({
    //                 name: k,
    //                 file: chunk.name + '-' + chunk.renderedHash + '.js'
    //             });
    //         }
    //     }
    //     console.log('namedChunks:', namedChunks);
    //     console.log('namedChunksTemp:', self.namedChunksTemp);

    //     /**
    //      * 对比前后namedChunks数组，筛选出有变化的项，并保存到diffs数组中
    //      */
    //     var diffs = [];
    //     if (self.namedChunksTemp.length) {
    //         var temp = self.namedChunksTemp;
    //         namedChunks.map(function (value, index, array) {
    //             // 若临时chunk文件名不等于最新chunk文件名，则加入diffs
    //             if (temp[index].name === value.name && temp[index].file !== value.file) {
    //                 diffs.push(value);
    //             }
    //         });
    //     } else {
    //         diffs = namedChunks;
    //     }
    //     console.log('diffs:', diffs);
    //     // 最后，更新全局临时chunks数组
    //     self.namedChunksTemp = namedChunks;
    //     // console.log('namedChunksTemp:', self.namedChunksTemp);
    //     // console.log(stats.compilation)
    // });

    compiler.plugin('done', function (stats) {
        // console.log(stats);
        // console.log(stats.compilation.namedChunks);
        console.log('\n\r=================================================================');
        console.log('编译完成\n\r');
        /**
         * 资源输出到目录完成后，获取资源文件信息
         */
        var cNamedChunks = stats.compilation.namedChunks; // 本次编译后的原始chunks对象
        var namedChunks = []; // 本次编译后的chunks自定义数组
        // console.log(cNamedChunks);
        for (var k in cNamedChunks) {
            var chunk = cNamedChunks[k];
            if (chunk) {
                namedChunks.push({
                    name: k,
                    hash: chunk.renderedHash,
                    // file: chunk.name + '-' + chunk.renderedHash + '.js'
                    file: chunk.files[0]
                });
            }
        }

        console.log('namedChunks:', namedChunks);
        console.log('namedChunksTemp:', self.namedChunksTemp);

        /**
         * 对比前后namedChunks数组，筛选出有变化的项，并保存到diffs数组中
         */
        var diffs = [];
        if (self.namedChunksTemp.length) {
            var temp = self.namedChunksTemp;
            namedChunks.map(function (value, index, array) {
                // 若临时chunk文件名不等于最新chunk文件名，则加入diffs
                if (temp[index].name === value.name && temp[index].file !== value.file) {
                    diffs.push(value);
                }
            });
        } else {
            diffs = namedChunks;
        }
        console.log('diffs:', diffs);

        // 最后，更新全局临时chunks数组
        self.namedChunksTemp = namedChunks;
        console.log('=================================================================\n\r');

        // 遍历视图模板文件并更新（如果需要的话）
        fs.recurse(path.join(__dirname, 'views'), function (filepath, relative, filename) {
            if (filename) {
                // it's file 
                // console.log(filepath);
                // console.log(relative);
                // console.log(filename);
                fs.readFile(filepath, 'utf8', function (err, data) {
                    if (err) throw err;

                    // 匹配文件中的脚本标签
                    var regexp = /script\(src\=[\"\'](.*\.js)[\"\']\)/gim;
                    var script; // 匹配结果
                    var changed = false; // 是否需要更新

                    while (script = regexp.exec(data)) {
                        if (script) {
                            var src = script[1]; // 匹配到的script标签src字符串
                            if (src.charAt(0) === '/') {
                                src = src.slice(1);
                            }
                            // 比对diffs中的文件，若包含src，则更新该值
                            diffs.map(function (value, index, array) {
                                // console.log(src); // javascripts/index-9e53b7bb98172fb6be7c.js
                                // console.log(value.hash); // 71e1fe8f3f3d7a545588
                                // console.log(value.file); // javascripts/index-71e1fe8f3f3d7a545588.js

                                // 获取无hash值的chunk文件名
                                var fileParsed = value.file.split('-');
                                // javascripts/index-71e1fe8f3f3d7a545588.js -> javascripts/index-
                                var fileWithoutHash;
                                // 若是入口模块，则去掉hash+.js后缀（命名规则必须与webpack.config.js配置一致）
                                if (value.file.indexOf('.chunk.js') === -1) {
                                    fileWithoutHash = value.file.replace(value.hash + '.js', '');
                                }
                                // 若是分片模块，则去掉hash+.chunk.js后缀（命名规则必须与webpack.config.js配置一致）
                                else {
                                    fileWithoutHash = value.file.replace(value.hash + '.chunk.js', '');
                                }
                                // console.log(fileWithoutHash); // javascripts/index-

                                // 当视图模板中的脚本src包含fileWithoutHash，且src全路径与file互不相等，说明该脚本有更新，则对该值进行更新
                                if (src.indexOf(fileWithoutHash) !== -1 && (src !== value.file)) {
                                    // javascripts/index-9e53b7bb98172fb6be7c.js -> javascripts/index-71e1fe8f3f3d7a545588.js
                                    data = data.replace(src, value.file);
                                    console.log(src, '->', value.file);
                                    changed = true;
                                }
                            });
                        }
                    }

                    // 若编译后的chunks有变更，则更新视图模板文件
                    if (changed) {
                        fs.writeFile(filepath, data, function (err) {
                            if (err) throw err;
                        });
                    }
                });
            } else {
                // it's folder 
            }
        });

        // fs.readdir(path.join(__dirname, 'views'), function (err, files) {
        //     if (err) throw err;
        //     console.log(files);
        // });

        // fs.readFile(path.join(__dirname, 'views', 'index.pug'), 'utf8', function (err, data) {
        //     if (err) throw err;
        //     console.log(typeof data);

        // });
    });
};

module.exports = HelloWorldPlugin;