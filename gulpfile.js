var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    path        = require('path'),
    browserSync = require('browser-sync'),
    through2    = require('through2'),
    reload      = browserSync.reload,
    browserify  = require('browserify'),
    del         = require('del'),
    argv        = require('yargs').argv,
    nodemon = require('gulp-nodemon'),
    babel = require('gulp-babel'),
    jsx = require('gulp-jsx'),
    jadeLocals;

function shallowMixin (destination) {
    var sources = [];
    for (var i = 1, ii = arguments.length; i < ii; i += 1) {
        sources.push(arguments[i]);
    }

    sources.forEach(function (source) {
        if (typeof source !== 'object') {
            throw new Error({
                message: 'Source not an object',
                badSource: source
            });
        }
    });
    destination = typeof destination === 'object' ?
        destination : {initialValue: destination};

    sources.forEach(function (source) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                destination[prop] = source[prop]
            }
        }
    });

    return destination;
}


jadeLocals = shallowMixin({},{});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    open: !!argv.open,
    notify: !!argv.notify,
    proxy: "http://localhost:3000",
    port: 3333
  });
});

gulp.task('compass', function() {
  return gulp.src('./stylesheets/**/*.{scss,sass}')
    .pipe($.plumber())
    .pipe($.compass({
      css: 'public/stylesheets',
      sass: 'stylesheets'
    }))
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('assets-cp', function() {
  return gulp.src('./client/assets/*')
    .pipe(gulp.dest('public/assets'));
});


gulp.task('js:client', function() {
  return gulp.src('client/main.js')
    .pipe($.plumber())
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path, { debug: true })
        .transform(require('babelify'))
        .transform(require('debowerify'))
        .bundle(function (err, res) {
          if (err) { return next(err); }
          file.contents = res;
            next(null, file);
        });
      }))
      .on('error', function (error) {
        console.log(error.stack);
        this.emit('end')
    })
  .pipe( $.rename('app.js'))
  .pipe( gulp.dest('public/scripts/'));
});

gulp.task('js:server', function() {
  return gulp.src(['server/src/main.js', 'react/**', '!react/**/*.scss'])
    // .pipe(jsx({
    //   factory: 'React.createClass'
    // }))
    .pipe(babel({
      plugins: ['transform-react-jsx']
		}))
    // .pipe( $.rename('app.js'))
    .pipe(gulp.dest('server/dist'));

  // return gulp.src('server/src/main.js')
  //   .pipe($.plumber())
  //   .pipe(through2.obj(function (file, enc, next) {
  //     browserify(file.path, { debug: true })
  //       .transform(require('babelify'))
  //       .transform(require('debowerify'))
  //       .bundle(function (err, res) {
  //         if (err) { return next(err); }
  //         file.contents = res;
  //           next(null, file);
  //       });
  //     }))
  //     .on('error', function (error) {
  //       console.log(error.stack);
  //       this.emit('end')
  //   })
  // .pipe( $.rename('app.js'))
  // .pipe( gulp.dest('server/dist/'));
});

gulp.task('js:pdfjs-worker', function() {
  return gulp.src('node_modules/pdfjs-dist/build/pdf.worker.js')
    .pipe($.plumber())
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path, { debug: true })
        .transform(require('babelify'))
        .transform(require('debowerify'))
        .bundle(function (err, res) {
          if (err) { return next(err); }
          file.contents = res;
            next(null, file);
        });
      }))
      .on('error', function (error) {
        console.log(error.stack);
        this.emit('end')
    })
  .pipe( $.rename('pdfjs.worker.js'))
  .pipe( gulp.dest('public/scripts/'));
});


gulp.task('clean', function(cb) {
  del(['./server/dist', './public/scripts', './public/stylesheets'], cb);
});

gulp.task('images', function() {
  return gulp.src('./client/images/**/*')
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./public/assets/images'))
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: './bin/www'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});


// gulp.task('templates', function() {
//   return gulp.src('src/jade/**')
//     .pipe($.plumber())
//     .pipe($.jade({
//       pretty: true,
//       locals: jadeLocals
//     }))
//     .pipe( gulp.dest('dist/') )
// });



gulp.task('build', ['compass', 'js:server', 'js:client', 'images', 'assets-cp']);

gulp.task('serve', ['build', 'browser-sync'], function () {
  gulp.watch(
    ['stylesheets/**/*.{scss,sass}', '**/*.{scss,sass}'],
    ['compass', reload]
  );
  gulp.watch(
    [
      '*.js',
      '**/*.js',
      '**/**/*.js',
      '**/**/**/*.js',
      '!node_modules'
    ],
    ['js:server', 'js:client', reload]);
  gulp.watch('client/images/**/*',['images', reload]);
  gulp.watch('jade/**',['templates', reload]);
});

gulp.task('default', ['serve']);
