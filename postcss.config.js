module.exports = {
  syntax: require('postcss-scss'),
  plugins: [
    require('postcss-import')({
      path: __dirname + '/assets/css',
     }),
    require('postcss-nested'),
    require('autoprefixer'),
    require('cssnano')({ reduceIdents: false })
  ]
}
