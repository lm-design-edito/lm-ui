import path from 'node:path'
import { promises as fs } from 'node:fs'
import fse from 'fs-extra'
import chokidar from 'chokidar'
import * as sass from 'sass'
import esbuild from 'esbuild'
import { debounce } from 'throttle-debounce'
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin'
import inlineImageModule from 'esbuild-plugin-inline-image'
import listSubpaths from '@design-edito/tools/utils/node/list-subpaths/index.js'
import readWriteFile from '@design-edito/tools/utils/node/read-write-file/index.js'

const inlineImagePulgin = inlineImageModule as unknown as typeof inlineImageModule.default

// Bundle src to dist/demo
const buildOptions: esbuild.BuildOptions = {
  format: 'esm',
  entryPoints: [path.join(process.cwd(), 'src/app/index.tsx')],
  bundle: true,
  outfile: path.join(process.cwd(), 'dist/demo/app.js'),
  minify: true,
  sourcemap: true,
  target: ['esnext'],
  tsconfig: path.join(process.cwd(), 'src/tsconfig.json'),
  logLevel: 'info',
  plugins: [
    inlineImagePulgin({ limit: -1 }),
    sassPlugin({ filter: /\.module\.scss$/, type: 'css', transform: postcssModules({}) }),
    sassPlugin({ filter: /.scss$/, type: 'css' })
  ]
}

const ctx = await esbuild.context(buildOptions)
await ctx.watch()
console.log('watching...')

// Bundle index.html to dist/index.html
const demoIndexSrcPath = path.join(process.cwd(), 'index.html')
const demoIndexDstPath = path.join(process.cwd(), 'dist/index.html')
const demoIndexWatcher = chokidar.watch(demoIndexSrcPath, { persistent: true })
const demoIndexBundler = async () => {
  try {
    console.log('Building index.html...')
    await fs.mkdir(path.dirname(demoIndexDstPath), { recursive: true })
    const content = await fs.readFile(demoIndexSrcPath)
    await fs.writeFile(demoIndexDstPath, content)
    console.log('Built index.html')
  } catch (err) {
    console.error('Something went wrong while bundling index.html to dist/index.html')
    console.error(err)
    process.exit(1)
  }
}
demoIndexBundler().then(() => demoIndexWatcher
  .on('change', demoIndexBundler))

// Bundle public/fonts to dist/fonts
const fontsSrcPath = path.join(process.cwd(), 'public/fonts')
const fontsDstPath = path.join(process.cwd(), 'dist/fonts')
const fontsWatcher = chokidar.watch(fontsSrcPath, { persistent: true })
const fontsBundler = async () => {
  try {
    console.log('Building fonts...')
    await fs.rm(fontsDstPath, { recursive: true, force: true })
    await fse.copy(fontsSrcPath, fontsDstPath, { overwrite: true })
    console.log('Built fonts.')
  } catch (err) {
    console.error('Something went wrong while bundling public/fonts/* to dist/fonts/*')
    console.error(err)
    process.exit(1)
  }
}
fontsBundler().then(() => fontsWatcher
  .on('add', fontsBundler)
  .on('addDir', fontsBundler)
  .on('change', fontsBundler)
  .on('unlink', fontsBundler)
  .on('unlinkDir', fontsBundler))

// Bundle public/icons to dist/icons
const iconsSrcPath = path.join(process.cwd(), 'public/icons')
const iconsSrcRegistryPath = path.join(iconsSrcPath, 'registry.json')
const iconsSrcAssetsPath = path.join(iconsSrcPath, 'assets')
const iconsDstPath = path.join(process.cwd(), 'dist/icons')
const iconsDstRegistryPath = path.join(iconsDstPath, 'registry.json')
const iconsDstAssetsPath = path.join(iconsDstPath, 'assets')
const iconsWatcher = chokidar.watch(iconsSrcPath, { persistent: true })
const iconsBundler = async () => {
  console.log('Building icons...')
  try {
    await fs.rm(iconsDstPath, { recursive: true, force: true })
    await fse.mkdir(iconsDstPath, { recursive: true })
    await fse.copy(iconsSrcRegistryPath, iconsDstRegistryPath, { overwrite: true })
    await readWriteFile(iconsDstRegistryPath, content => {
      const stringContent = typeof content === 'string' ? content : content.toString()
      const editedStringContent = JSON.stringify(JSON.parse(stringContent))
      return typeof content === 'string'
        ? editedStringContent
        : Buffer.from(editedStringContent, 'utf-8')
    }, { encoding: 'utf-8' })
    await fse.copy(iconsSrcAssetsPath, iconsDstAssetsPath, { overwrite: true })
    console.log('Built icons.')
  } catch (err) {
    console.error('Something went wrong while bundling public/icons/* to dist/icons/*')
    console.error(err)
    process.exit(1)
  }
}
iconsBundler().then(() => iconsWatcher
  .on('add', iconsBundler)
  .on('addDir', iconsBundler)
  .on('change', iconsBundler)
  .on('unlink', iconsBundler)
  .on('unlinkDir', iconsBundler))

// Bundle public/styles to dist/styles
const stylesSrcPath = path.join(process.cwd(), 'public/styles')
const stylesDstPath = path.join(process.cwd(), 'dist/styles')
const stylesWatcher = chokidar.watch(stylesSrcPath, { persistent: true })
const singleStyleBundler = async (src: string, dest: string) => {
  try {
    const result = sass.compile(src, { style: 'compressed' })
    await fse.ensureDir(path.dirname(dest))
    await fs.writeFile(dest, result.css)
  } catch (err) {
    console.error(`Something went wrong while bundling ${src}`)
    console.error(err)
    process.exit(1)
  }
}
const stylesBundler = async () => {
  console.log('Building styles...')
  const scssFiles = await listSubpaths(stylesSrcPath, {
    directories: false,
    symlinks: false,
    dedupeSimlinksContents: true,
    filter: filePath => filePath.endsWith('.scss')
  })
  await Promise.all(scssFiles.map(async filePath => {
    const relToSrcPath = path.relative(stylesSrcPath, filePath)
    const dstFile = path.join(stylesDstPath, relToSrcPath.replace('.scss', '.css'))
    await singleStyleBundler(filePath, dstFile)
  }))
  console.log('Built styles.')
}

const debouncedStylesBundler = debounce(200, stylesBundler, { atBegin: false })

debouncedStylesBundler()
stylesWatcher
  .on('add', debouncedStylesBundler)
  .on('change', debouncedStylesBundler)
  .on('unlink', debouncedStylesBundler)
