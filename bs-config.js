// browser-sync config for the local dev server (scripts/dev.sh).
//
// usePolling is deliberate: _site/ is written by `docker cp` (the build runs
// in the jekyll-build-pages container), and inotify does not report those
// writes here, so event-based watching never fired a reload.
module.exports = {
    server: { baseDir: "_site" },
    port: Number(process.env.PORT || 4000),
    files: [
        "_site/**/*.html",
        "_site/**/*.css",
        "_site/**/*.xml",
        "_site/**/*.svg",
        "_site/**/*.png",
        "_site/**/*.ico",
    ],
    watchOptions: { usePolling: true, interval: 250 },
    reloadDelay: 200,
    open: false,
    ui: false,
    notify: false,
    logPrefix: "txt",
};
