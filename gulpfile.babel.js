const gulp = require('gulp');
const babel = require('gulp-babel');
const spawn = require('child_process').spawn;
let node;

const paths = {
  scripts: ["server.js", "./src/**/*.js"]
};

gulp.task("build", function() {
  return gulp.src(paths.scripts)
      .pipe(babel())
      .pipe(gulp.dest("build"));
});

gulp.task('server', ['build'], function() {
  // https://gist.github.com/webdesserts/5632955#file-gulpfile-js-L9
  if (node) node.kill()
  node = spawn('node', ['server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
      if (code === 8) {
          gulp.log('Error detected, waiting for changes...');
      }
  });

  // clean up if an error goes unhandled.
  process.on('exit', function() {
      if (node) node.kill()
  });
})

gulp.task('default', ['server'], function() {
    gulp.watch(paths.scripts, ['server']);
})