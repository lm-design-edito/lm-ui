import path from 'node:path';
import { promises as fs } from 'node:fs';
import fse from 'fs-extra';
import chokidar from 'chokidar';
import * as sass from 'sass';
import { context } from 'esbuild';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
import inlineImageModule from 'esbuild-plugin-inline-image';
const inlineImagePulgin = inlineImageModule;
// Bundle src to dist/demo
const buildOptions = {
    format: 'esm',
    entryPoints: [path.join(process.cwd(), 'src/app.tsx')],
    bundle: true,
    outfile: path.join(process.cwd(), 'dist/demo/app.js'),
    minify: true,
    sourcemap: true,
    target: ['esnext'],
    tsconfig: path.join(process.cwd(), 'src/tsconfig.json'),
    plugins: [
        inlineImagePulgin({
            limit: -1
        }),
        sassPlugin({
            filter: /\.module\.scss$/,
            type: 'css',
            transform: postcssModules({})
        })
    ]
};
const ctx = await context(buildOptions);
await ctx.watch();
console.log('watching...');
// Bundle index.html to dist/index.html
const demoIndexSrcPath = path.join(process.cwd(), 'index.html');
const demoIndexDstPath = path.join(process.cwd(), 'dist/index.html');
const demoIndexWatcher = chokidar.watch(demoIndexSrcPath, { persistent: true });
const demoIndexBundler = async () => {
    try {
        await fs.mkdir(path.dirname(demoIndexDstPath), { recursive: true });
        const content = await fs.readFile(demoIndexSrcPath);
        await fs.writeFile(demoIndexDstPath, content);
    }
    catch (err) {
        console.error('Something went wrong while bundling index.html to dist/index.html');
        console.error(err);
        process.exit(1);
    }
};
demoIndexBundler().then(() => demoIndexWatcher
    .on('change', demoIndexBundler));
// Bundle public/fonts to dist/fonts
const fontsSrcPath = path.join(process.cwd(), 'public/fonts');
const fontsDstPath = path.join(process.cwd(), 'dist/fonts');
const fontsWatcher = chokidar.watch(fontsSrcPath, { persistent: true });
const fontsBundler = async () => {
    try {
        await fs.rm(fontsDstPath, { recursive: true, force: true });
        await fse.copy(fontsSrcPath, fontsDstPath, { overwrite: true });
    }
    catch (err) {
        console.error('Something went wrong while bundling public/fonts/* to dist/fonts/*');
        console.error(err);
        process.exit(1);
    }
};
fontsBundler().then(() => fontsWatcher
    .on('add', fontsBundler)
    .on('addDir', fontsBundler)
    .on('change', fontsBundler)
    .on('unlink', fontsBundler)
    .on('unlinkDir', fontsBundler));
// Bundle public/icons to dist/icons
const iconsSrcPath = path.join(process.cwd(), 'public/icons');
const iconsDstPath = path.join(process.cwd(), 'dist/icons');
const iconsWatcher = chokidar.watch(iconsSrcPath, { persistent: true });
const iconsBundler = async () => {
    try {
        await fs.rm(iconsDstPath, { recursive: true, force: true });
        await fse.copy(iconsSrcPath, iconsDstPath, { overwrite: true });
    }
    catch (err) {
        console.error('Something went wrong while bundling public/icons/* to dist/icons/*');
        console.error(err);
        process.exit(1);
    }
};
iconsBundler().then(() => iconsWatcher
    .on('add', iconsBundler)
    .on('addDir', iconsBundler)
    .on('change', iconsBundler)
    .on('unlink', iconsBundler)
    .on('unlinkDir', iconsBundler));
// Bundle public/styles to dist/styles
const stylesSrcPath = path.join(process.cwd(), 'public/styles');
const stylesDstPath = path.join(process.cwd(), 'dist/styles');
const stylesWatcher = chokidar.watch(stylesSrcPath, { persistent: true });
const singleStyleBundler = async (src, dest) => {
    try {
        const result = sass.compile(src, { style: 'compressed' });
        await fse.ensureDir(path.dirname(dest));
        await fs.writeFile(dest, result.css);
    }
    catch (err) {
        console.error(`Something went wrong while bundling ${src}`);
        console.error(err);
        process.exit(1);
    }
};
const stylesBundler = async () => {
    const files = await fs.readdir(stylesSrcPath);
    await Promise.all(files.map(async (file) => {
        if (file.endsWith('.scss')) {
            const srcFile = path.join(stylesSrcPath, file);
            const dstFile = path.join(stylesDstPath, file.replace('.scss', '.css'));
            await singleStyleBundler(srcFile, dstFile);
        }
    }));
};
stylesBundler().then(() => stylesWatcher
    .on('add', stylesBundler)
    .on('change', stylesBundler)
    .on('unlink', stylesBundler));
