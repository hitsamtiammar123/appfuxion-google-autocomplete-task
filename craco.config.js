const path = require('path');

module.exports = {
  webpack: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'layouts': path.resolve(__dirname, 'src/layouts'),
      'store': path.resolve(__dirname, 'src/redux'),
      'dialogs': path.resolve(__dirname, 'src/dialogs'),
      'constants': path.resolve(__dirname, 'src/constants'),
    },
  },
};
