module.exports = {
  entry: './test.js',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
  // you can now require('file') instead of require('file.coffee')
  extensions: ['', '.js', '.json', '.coffee']
  }
};
