gulp.task("typedoc", function() {
    return gulp
        .src(["*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "My project title"
        }))
    ;
});
