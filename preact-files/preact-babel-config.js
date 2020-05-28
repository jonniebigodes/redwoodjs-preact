module.exports = {
  extends: '../babel.config.js',
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h',
      },
    ],
    [
      '@emotion/babel-plugin-jsx-pragmatic',
      {
        module: 'preact',
        import: 'h',
        export: 'h',
      },
    ],
  ],
}
