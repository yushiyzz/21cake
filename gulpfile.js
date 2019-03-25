//导入所需插件
const gulp = require('gulp'),
	  uglify = require('gulp-uglify'),
	  rename = require('gulp-rename'),
	  concat = require('gulp-concat');

//发布任务	  
gulp.task('js',function(){
	gulp.src('./js/*.js')
	.pipe(uglify())
	.pipe(rename({"suffix" : ".min"}))
	.pipe(gulp.dest('./dist'))
})

gulp.task('default',function(){
	gulp.watch(['./js/*.js'],[js]);
})
