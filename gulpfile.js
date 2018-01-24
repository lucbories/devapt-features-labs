
'use strict'

var del = require('del')
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var changed = require('gulp-changed')
var livereload = require('gulp-livereload')


var source = require('vinyl-source-stream')
var Buffer = require('vinyl-buffer')
var browserify = require('browserify')



var SRC_ALL_JS = 'src/**/*.js'
// var SRC_INDEX_JS = 'src/index.js'

var DST = 'dist'
var DST_ALL_JS = DST
var DST_INDEX = './dist/js/index.js'
var DST_BROWSER_BUNDLE = 'devapt-features-labs.js'

var DST_MATHJS_WEBWORKER_INDEX = './dist/js/js_features/mathjs/labs_features/mathjs_features.js'
var DST_MATHJS_WEBWORKER_BUNDLE = 'mathjs_features.js'

const BABEL_CONFIG = {
	"presets": [
	  ["@babel/preset-env", { "modules": false, "useBuiltIns":false, "debug":false } ],
	  ["@babel/preset-es2015"]
	],
	"ignore": [],
	"plugins":[
//	  ["@babel/plugin-transform-react-jsx", { "pragma": "h" }]
	]
}


/*
	CLEAN DIST DIRECTORY
*/
gulp.task('clean',
	() => {
		return del(DST + '/js/*')
	}
)


/*
	BUILD ALL SRC/ JS FILES TO DIST/
		with sourcemap files
		build only changed files
*/
gulp.task('build_all_js',
	() => {
		return gulp.src(SRC_ALL_JS)
            .pipe(changed(DST_ALL_JS))
            .pipe(sourcemaps.init())
            .pipe( babel(BABEL_CONFIG) )
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(DST_ALL_JS))
	}
)

gulp.task('watch_all_js',
	() => {
		gulp.watch(SRC_ALL_JS, ['build_all_js'])
		.on('change',
			(path/*, stats*/) => {
				console.log('File ' + path + ' was changed, running watch_all_js...')
			}
		)
		.on('unlink',
			(path/*, stats*/) => {
				console.log('File ' + path + ' was deleted, running watch_all_js...')
			}
		)
	}
)


gulp.task('build_browser_bundle',
	() => {
		return browserify( { entries: DST_INDEX } )
			.external('devapt')
			.external('client_runtime')
			.external('forge-browser')
			.external('ui')
			.require('./dist/js/rendering_plugin.js', { expose:'labs_plugin' } )
			.require('@babel/polyfill', { expose:"@babel/polyfill" })
			.bundle()
			.pipe( source(DST_BROWSER_BUNDLE) )
			.pipe( new Buffer() )
			.pipe(sourcemaps.write('.'))
			.pipe( gulp.dest(DST) )
			.pipe( livereload() )
	}
)




gulp.task('build_mathjs_webworker_bundle',
	() => {
		return browserify( { entries: DST_MATHJS_WEBWORKER_INDEX } )
			.external('devapt')
			.external('client_runtime')
			.external('forge-browser')
			.external('ui')
			.require(DST_MATHJS_WEBWORKER_INDEX, { expose:'mathjs_features' } )
			.bundle()
			.pipe( source(DST_MATHJS_WEBWORKER_BUNDLE) )
			.pipe( new Buffer() )
			.pipe(sourcemaps.write('.'))
			.pipe( gulp.dest(DST) )
			.pipe( livereload() )
	}
)


/*
	DEFINE MAIN GULP TASKS
*/
gulp.task('default', gulp.series('build_all_js', 'build_browser_bundle', 'build_mathjs_webworker_bundle') )

gulp.task('watch', gulp.series('build_all_js', 'build_browser_bundle', 'watch_all_js') )
