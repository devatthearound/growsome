const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js', // 엔트리 포인트
  output: {
    filename: 'bundle.js', // 출력 파일 이름
    path: path.resolve(__dirname, 'dist'), // 출력 경로
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
  experiments: {
    asyncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Babel을 사용하여 ES6+ 코드를 변환
        }
      },
      {
        test: /\.wasm$/,
        type: "webassembly/async",
      },
    ]
  },
  mode: 'development', // 개발 모드
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, '');
      resource.request = mod;
    }),
  ]
};
