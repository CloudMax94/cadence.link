module.exports = {
  syntax: require('postcss-scss'),
  plugins: [
    require('postcss-import')({
      path: __dirname + '/assets/css',
    }),
    require('precss')(),
    require('autoprefixer'),
    require('cssnano')({ reduceIdents: false })
  ]
}
