const sass = require('sass')
const fs = require('fs')
const pkg = require('./package.json')

// Configs
const configs = {
    name: `${pkg.name}`,
    files: ['main.scss'],
    pathIn: 'src/scss',
    pathOut: 'docs/css',
    indentType: 'tab',
    indentWidth: 1,
    minify: true,
    sourceMap: true,
}

// Banner
const banner = `/*! ${configs.name ? configs.name : pkg.name} v${
    pkg.version
} | (c) ${new Date().getFullYear()} ${pkg.author.name} | ${
    pkg.license
} License | ${pkg.repository.url} */`

const getOptions = function (file, filename, minify) {
    return {
        file: `${configs.pathIn}/${file}`,
        outFile: `${configs.pathOut}/${filename}`,
        sourceMap: configs.sourceMap,
        sourceMapContents: configs.sourceMap,
        indentType: configs.indentType,
        indentWidth: configs.indentWidth,
        outputStyle: minify ? 'compressed' : 'expanded',
    }
}

const writeFile = function (pathOut, fileName, fileData, printBanner = true) {
    // Create the directory path
    fs.mkdir(pathOut, { recursive: true }, function (err) {
        // If there's an error, throw it
        if (err) throw err

        // Write the file to the path
        fs.writeFile(`${pathOut}/${fileName}`, fileData, function (err) {
            if (err) throw err

            const data = fs.readFileSync(`${pathOut}/${fileName}`)
            const fd = fs.openSync(`${pathOut}/${fileName}`, 'w+')
            const insert = printBanner ? new Buffer.from(banner + '\n') : ''
            fs.writeSync(fd, insert, 0, insert.length, 0)
            fs.writeSync(fd, data, 0, data.length, insert.length)
            fs.close(fd, function (err) {
                if (err) throw err
                console.log(`Compiled ${pathOut}/${fileName}`)
            })
        })
    })
}

const parseSass = function (file, minify) {
    const filename = `${file.slice(0, file.length - 5)}${
        minify ? '.min' : ''
    }.css`
    sass.render(getOptions(file, filename, minify), function (err, result) {
        // If there's an error, throw it
        if (err) throw err

        // Write the file
        writeFile(configs.pathOut, filename, result.css)

        if (configs.sourceMap && !configs.sourceMapEmbed) {
            // Write external sourcemap
            writeFile(configs.pathOut, filename + '.map', result.map, false)
        }
    })
}

configs.files.forEach(function (file) {
    parseSass(file)
    if (configs.minify) {
        parseSass(file, true)
    }
})
