var gulp = require('gulp'),
    useref = require('gulp-useref'),
    wiredep = require('wiredep').stream,
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    compass = require('gulp-compass'),
    pug = require('gulp-pug'),
    sftp = require('gulp-sftp'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber');

/* SOURCES --------------------------------------------------------------------
---------------------------------------------------------------------------- */
var sources = {
    html: {
        src: 'app/*.html',
        dist: 'app/'
    },
    css: {dist: 'app/css'},
    js: {dist: 'app/js'},
    pug: {
        src: 'app/pug/*.pug',
        watch: 'app/pug/**/*.pug',
        dist: 'app/'
    },
    sass: {
        src: 'app/sass/*.sass',
        watch: 'app/sass/**/*.sass',
        dist: 'app/sass'
    },
    bower: {src: 'app/bower_components'}
};

/* DEVELOPMENT GULP TASKS ------------------------------------------------------
 ---------------------------------------------------------------------------- */

/* PUG ---------------------------------------------------------------------- */
gulp.task('pug', function () {
  gulp.src(sources.pug.src)
      .pipe(plumber())
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest(sources.pug.dist))
      .pipe(connect.reload());
});

/* COMPASS ------------------------------------------------------------------ */
gulp.task('compass', function () {
  gulp.src(sources.sass.watch)
      .pipe(plumber())
      .pipe(compass({
          sass: sources.sass.dist,
          css: sources.css.dist,
          js: sources.js.dist
      }))
      .pipe(gulp.dest(sources.css.dist))
      .pipe(connect.reload());
});

/* BOWER --------------------------------------------------------------------- */
gulp.task('bower', function () {
    gulp.src(sources.html.src)
        .pipe(wiredep({
            directory: sources.bower.src
        }))
        .pipe(gulp.dest('app'));
});

/* CONNECT ------------------------------------------------------------------- */
gulp.task('connect', function () {
    connect.server({
        root: 'app',
        port: 3000,
        livereload: true
    });
});

/* PRODUCTION GULP TASKS ------------------------------------------------------
 ---------------------------------------------------------------------------- */

/* SFTP --------------------------------------------------------------------- */
gulp.task('sftp', function(){
    gulp.src("dist/**/*")
        .pipe(sftp({
            host: "",
            user: "",
            pass: "",
            remotePath: ""
        }));
});

/* CLEAN -------------------------------------------------------------------- */
gulp.task('clean', function(){
    gulp.src('dist', {read: false})
        .pipe(clean());
});

/* BUILD -------------------------------------------------------------------- */
gulp.task('build',["clean"], function(){

    return gulp.src(sources.html.src)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

/* DEFAULT AND GULP WATCHER ----------------------------------------------------
 ---------------------------------------------------------------------------- */
gulp.task('watch', function () {
    // gulp.watch('bower.json', ["bower"]);
    gulp.watch(sources.sass.watch, ['compass']);
    gulp.watch(sources.pug.watch, ["pug"]);
});

gulp.task('default', ['connect', 'pug', 'compass', 'watch']);