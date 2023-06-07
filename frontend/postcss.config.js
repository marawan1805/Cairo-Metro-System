module.exports = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      ident: 'postcss',
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}
