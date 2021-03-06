const arg = require('arg');
const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// arg handling
const args = arg({
    '--entry': String,
    '--out-dir': String,
    '--production': Boolean,
    '--watch': Boolean,

    '-e': '--entry',
    '-o': '--out-dir',
    '-p': '--production',
    '-w': '--watch',
});
const entryFile = path.resolve(__dirname, args['--entry'] || 'src/index.ts');
const outDir = path.resolve(__dirname, args['--out-dir'] || 'public');
const prod = !!args['--production'];
const watch = !!args['--watch'];


// build helpers
const log = (...strs) => console.log.apply(console.log,['[make]'].concat(strs));


// build website
(async () => {
    log(
        'Started with options:',
        '\n  Entry File: ' + entryFile,
        '\n  Out Dir: ' + outDir,
        '\n  Prod: ' + prod.toString(),
        '\n  Watch: ' + watch.toString());

    log('Create public folder if missing and make sure it is empty');
    fs.emptyDirSync(outDir);


    log('Build app');
    await new Promise((res, rej) => {
        const compiler = webpack({
            mode: prod ? 'production' : 'development',
            devtool: prod ? undefined : 'source-map',
            entry: entryFile,
            target: 'web',
            output: {
                path: outDir,
                filename: 'bundle.js'
            },
            resolve: {
                alias: {},
                extensions: ['.ts', '.tsx'],
                modules: ['node_modules'],
            },
            module: {
                rules: [
                    {// pug files
                        test: /\.(pug|jade)$/i,
                        use: [
                            "file-loader?name=[name].html",
                            "extract-loader",
                            "html-loader",
                            "pug-html-loader",
                        ]
                    },
                    {// global scss files, todo: inject critical css directly using style-loader
                        test: /\.s[ac]ss$/i,
                        use: [
                            { loader: 'file-loader?name=[name].css' },
                            { loader: 'extract-loader' },
                            { loader: 'css-loader?-url' },
                            { loader: 'sass-loader' },
                        ],
                    },
                    {// typescript
                        test: /\.tsx?$/i,
                        loader: 'ts-loader',
                        options: {
                            allowTsInNodeModules: true,
                        }
                    },
                ],
            },
            plugins: [
                new CopyPlugin([
                    { from: 'assets', to: '.' },
                ]),
                new ProgressBarPlugin(),
            ],
        });

        const handler = (err, stats) => { // Stats Object
            if (err || stats.hasErrors()) {
                rej({err, further: stats.compilation.errors});
                return;
            }

            process.stdout.write(stats.toString() + '\n');
            res();
        };

        if (watch) {
            log('Start watcher...');
            compiler.watch({}, handler);
        }
        else {
            log('Start compilation...');
            compiler.run(handler);
        }
    });
})().catch(console.error).finally(() => log('FINISHED'));
