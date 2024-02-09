import path from 'node:path';
import { context } from 'esbuild';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
const buildOptions = {
    entryPoints: [path.join(process.cwd(), 'src/app.tsx')],
    bundle: true,
    outfile: path.join(process.cwd(), 'dist/app.js'),
    minify: true,
    sourcemap: true,
    target: ['esnext'],
    tsconfig: path.join(process.cwd(), 'src/tsconfig.json'),
    plugins: [
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
