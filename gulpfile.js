"use strict";
const designSystemName="ds-moc";
// ============================
const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp'),
    mozjpeg = require('imagemin-mozjpeg'),
    pngquant = require('imagemin-pngquant'),
    webp = require('gulp-webp'),
    imagemin = require('gulp-imagemin'),
    twig = require('gulp-twig'),
    gulpData = require('gulp-data'),
    browserSync = require('browser-sync').create(), // create a browser sync instance.
    fs = require('fs'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    glob = require('glob'),
    del = require('del'),
    //====================
    // utilites 
    pathsConfig = {
        src: 'src/',
        dist: 'dist/',
        assets: 'dist/assets/',
        build: 'build/',
        index: 'index.html'
    };

// =======================================================================
const componentsPaths = glob.sync(pathsConfig.compSrc + '/*/');
// =======================================================================
sass.compiler = require('node-sass');

// 
function sassCompile() {
    return src([pathsConfig.src + 'css/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError)) // Converts Sass to CSS with gulp-sass
        .pipe(sourcemaps.write())
        .pipe(dest(pathsConfig.assets + 'css/'));
}

function images() {
    return src(pathsConfig.src + 'images/**/*')
        .pipe(imagemin([
            pngquant({
                quality: [0.9, 0.9]
            }),
            mozjpeg({
                quality: 30
            }),
            imagemin.svgo()
        ]))
        .pipe(dest(pathsConfig.assets + 'images'))
        .pipe(webp({
            quality: 10
        }))
        .pipe(dest(pathsConfig.assets + 'images'));
}

function fonts() {
    return src(pathsConfig.src + 'fonts/**/*')
        .pipe(dest(pathsConfig.assets + 'fonts'));
}

function jsCompile() {

    return src(pathsConfig.src + 'js/**/*')
        .pipe(concat('scripts.js'))
        .pipe(dest(pathsConfig.assets + 'js'));
}

function twigCompile() {
    return src([pathsConfig.src + 'html/*.twig', pathsConfig.src + 'html/views/*.twig'])
        .pipe(gulpData(function (file) {
            return JSON.parse(fs.readFileSync(pathsConfig.src + 'data/content.db.json'));
        }))
        .pipe(twig())
        .pipe(dest(pathsConfig.dist));
}

// #####################################################################################

function clean_dist() {
    return del(['dist']);
}

function reloadServer(done) {
    browserSync.reload();
    done();
}

//  ==========================================================================
 
exports.serve = function serve() {
    browserSync.init({
        files: ["dist/**/*.*", "node_modules/" + designSystemName + "/**/*.*"],
        port: 3200,
        startPath: pathsConfig.index,
        server: {
            baseDir: 'dist',
            routes: {
                '/node_modules': './node_modules'
            }
        }
    });
    watch([pathsConfig.src + 'scss/**/*.scss'], series(sassCompile, reloadServer));
    watch(pathsConfig.src + 'images/**/*.*', series(images, reloadServer));
    watch(pathsConfig.src + 'fonts/**/*.*', series(fonts, reloadServer));
    watch(pathsConfig.src + 'js/**/*.*', series(jsCompile, reloadServer));
    // HTML For SRC watch 
    watch([pathsConfig.src + '**/*.twig'], series(twigCompile, reloadServer));
};

// exports.build = series(clean_dist, parallel( sassCompile, images, fonts, jsCompile, exports.portal, exports.components))
exports.compile = parallel(sassCompile, images, fonts, jsCompile, twigCompile);
exports.default = series(clean_dist, exports.compile, exports.serve)