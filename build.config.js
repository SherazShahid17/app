/* jslint camelcase: false */

/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    build_dir: 'build',
    compile_dir: 'dist',
    test_dir: 'test',
    sass_dir: 'assets/scss',

    app_base: 'src/app',
    sofa_base: 'node_modules/sofa-base',

    /**
     * Port on which the app is running
     */
    app_port: 9000,

    /**
     * Server port on which the app local server is running
     */
    server_port: 9001,

    /**
     * Server host on which the app local server is running
     */
    server_host: 'localhost',

    /**
     * This specifies the folder in `data/` for the specific shop you want to
     * build the app.
     */
    shop_data_dir: 'static',

    /*
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `modules/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, `app_tpl` contains template
     * files for our app's code. `html` is just our main HTML file, `scss` is
     * our main stylesheet, and `unit` and `e2e` contains our app's unit and
     * e2e ests.
     */
    app_files: {
        js: [
            '<%= app_base %>/**/*.js',
            '!<%= app_files.jsunit %>',
            '!<%= app_files.jse2e %>',
            '!<%= app_files.jse2epage %>'
        ],
        jsunit: ['<%= app_base %>/**/*.unit.spec.js'],
        jse2e: ['<%= app_base %>/**/*.e2e.spec.js'],
        jse2epage: ['<%= app_base %>/**/*.e2e.page.js'],
        jse2esuites: [
            {
                name: 'app',
                src: ['<%= app_base %>/*.e2e.*.js'],
            },
            {
                name: 'search',
                src: ['<%= app_base %>/search/*.e2e.*.js'],
            },
            {
                name: 'cart',
                src: ['<%= app_base %>/cart/*.e2e.*.js'],
            },
            {
                name: 'categories',
                src: ['<%= app_base %>/categories/*.e2e.*.js'],
            },
            {
                name: 'products',
                src: ['<%= app_base %>/products/*.e2e.*.js'],
            },
            {
                name: 'product',
                src: ['<%= app_base %>/product/*.e2e.*.js']
            }
        ],

        app_tpl: ['<%= app_base %>/**/*.tpl.html'],

        html: ['index.html'],
        scss: ['<%= app_base %>/**/*.scss']
    },

    tpl: {
        /**
         * This option defines the destination where for the html2js task.
         * In other words, this is the file that gets generated, containing
         * all module definitions for templates.
         */
        js_file: '<%= build_dir %>/templates/templates.js',
        /**
         * Sofa files have a separate task since they need different options
         * (coming from a different location)
         */
        sofa_file: '<%= build_dir %>/templates/sofa-templates.js',

        /**
         * Defines the name of the angular module that gets generated by
         * html2js.
         */
        module_name: 'templates',

        module_name_sofa_templates: 'sofa-templates'
    },

    /**
     * `test_files` are included in the testing process. We need `angular-mocks`
     * to run our test so we define it here.
     */
    test_files: {
        js: [
            'bower_components/angular-mocks/angular-mocks.js'
        ]
    },

    /**
     * We separate these data files from `vendor_files` because we have to embed
     * them as additional files. They are only used for development purposes,
     * because the backend generates these files on the file and embed them
     * inline.
     */
    data_files: {
        config: [
            '<%= build_dir %>/data/<%= shop_data_dir %>/cc.config.js',
        ],
        lang: [
            '<%= build_dir %>/data/<%= shop_data_dir %>/cc.lang.js'
        ],
        inject: [
            '<%= build_dir %>/data/<%= shop_data_dir %>/cc.inject.js',
        ],
    },
    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     */
    vendor_files: {
        js: [
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/hammerjs/hammer.js',
            'vendor/ui-router/angular-ui-router.js',
            'vendor/ui-modal/*.js',
            'vendor/snap/snap.js',
            'vendor/snap/angular-snap.js',
            'node_modules/sofa-core/dist/*.js',
            'node_modules/sofa-storages/dist/sofa.storages.js',
            'node_modules/sofa-logging-service/dist/sofa.loggingService.js',
            'node_modules/sofa-url-parser-service/dist/sofa.urlParserService.js',
            'node_modules/sofa-url-construction-service/dist/sofa.urlConstructionService.js',
            'node_modules/sofa-search-service/dist/sofa.searchService.js',
            'node_modules/sofa-tracking/dist/sofa.tracking.js',
            'node_modules/sofa-user-service/dist/sofa.userService.js',
            'node_modules/sofa-basket-service/dist/sofa.basketService.js',
            'node_modules/sofa-wishlist-service/dist/*.js',
            'node_modules/sofa-image-resizer-service/dist/sofa.imageResizerService.js',
            'node_modules/sofa-pages-service/dist/sofa.pagesService.js',
            'node_modules/sofa-checkout-service/dist/sofa.checkoutService.js',
            'node_modules/sofa-couch-service/dist/sofa.couchService.js',
            'node_modules/sofa-coupon-service/dist/sofa.couponService.js',
            'node_modules/sofa-state-resolver-service/dist/*.js',
            'node_modules/sofa-base/src/core/**/*.js',
            'node_modules/sofa-base/src/decorators/**/*.js',
            'node_modules/sofa-base/src/filter/**/*.js',
            'node_modules/angular-sofa-checkbox/dist/sofaCheckBox.js',

            'node_modules/sofa-base/src/services/**/*.js',
            'node_modules/sofa-hash-service/dist/*.js',
            'node_modules/sofa-device-service/dist/*.js',
            // TODO: remove after those are correctly componentized
            'vendor/sofa*.js',
            // Hand-picking the directives
            'node_modules/angular-sofa-address/dist/*.js',
            'node_modules/angular-sofa-variant-selector/dist/*.js',
            'node_modules/angular-sofa-select-box/dist/*.js',
            'node_modules/angular-sofa-name/dist/*.js',
            'node_modules/angular-sofa-price/dist/*.js',
            // Do NOT include the minified versions
            '!node_modules/angular-sofa-*/dist/*min.js',
            '!node_modules/sofa-*/dist/*min.js',

            'node_modules/sofa-base/src/directives/sofaZippy/*.js',
            'node_modules/sofa-base/src/directives/sofaTouchSlider/*.js',
            'node_modules/sofa-base/src/directives/sofaInject/*.js',
            'node_modules/sofa-base/src/directives/sofaInclude/*.js',
            'node_modules/sofa-base/src/directives/sofaImageZoom/*.js',
            'node_modules/sofa-base/src/directives/sofaImageAspectRatio/*.js',
            'node_modules/sofa-base/src/directives/sofaFullPageView/*.js',
            'node_modules/sofa-base/src/directives/sofaForms/**/*.js',
            'node_modules/sofa-base/src/directives/sofaFooterLinks/*.js',
            'node_modules/sofa-base/src/directives/sofaCategoryTreeView/*.js',
            'node_modules/sofa-base/src/directives/sofaGoBackControl/*.js',
            'node_modules/sofa-base/src/directives/sofaLoadingSpinner/*.js',
            'node_modules/sofa-base/src/directives/sofaDateField/*.js',
            // TODO: rename to sofa
            'node_modules/sofa-base/src/directives/ccTemplateCode/*.js'

            'node_modules/angular-sofa-lazy-validation/dist/sofaLazyValidation.js'
        ],
        tpl: [
            // Hand-picking the directives
            'node_modules/sofa-base/src/directives/sofaZippy/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaTouchSlider/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaImageZoom/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaFullPageView/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaForms/**/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaFooterLinks/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaCategoryTreeView/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaGoBackControl/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaLoadingSpinner/*.tpl.html',
            'node_modules/sofa-base/src/directives/sofaDateField/*.tpl.html'
        ],
        css: [],
        scss: [
            'vendor/snap/angular-snap.scss',
            'vendor/ui-modal/bootstrap-dialog.scss'
        ]
    }
};
