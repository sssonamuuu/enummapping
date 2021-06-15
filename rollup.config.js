import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

/** @type {import('rollup').OutputOptions[]} */
const output = [];

for (const type of ['cjs', 'umd']) {
  for (const env of ['development', 'production']) {
    const filename = `${pkg.name}${env === 'production' ? '.min' : ''}.js`;

    /** @type {import('rollup').OutputOptions} */
    const item = {
      plugins: [],
      format: type,
      file: `dist/${type}/${filename}`,
      banner: `/** @license ${pkg.name} v${pkg.version}\n` +
        ` * ${filename}\n` +
        ` * \n` +
        ` * Copyright (c) ${pkg.author}\n` +
        ` * \n` +
        ` * This source code is licensed under the MIT license found in the\n` +
        ` * LICENSE file in the root directory of this source tree.\n` +
        ` */`,
    };

    if (env === 'production') {
      item.plugins.push(terser({ ie8: true }));
    }

    if (type === 'cjs') {
      item.exports = 'default';
    } else if (type === 'umd') {
      item.name = pkg.name;
    }

    output.push(item);
  }
}

/** @type {import('rollup').RollupOptions[]} */
const options = [{
  input: './src/index.ts',
  output,
  plugins: [
    babel({
      exclude: [/\/node_modules\//],
      babelHelpers: 'runtime',
      extensions: ['.ts'],
    }),
    resolve(),
    commonjs(),
    typescript(),
  ],
}];

export default options;
