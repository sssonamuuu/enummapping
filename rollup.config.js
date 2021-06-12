import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { uglify } from 'rollup-plugin-uglify' 
import pkg from './package.json';

const output = [];

for (const type of ['cjs', 'umd']) {
  for (const env of ['development', 'production']) {
    const item = type === 'cjs' ? { exports: 'default' } : { name: 'enummapping' };

    item.plugins = [];
    if (env === 'production') {
      item.plugins.push(uglify());
    }

    item.format = type;

    item.file = `dist/${pkg.name}.${type}${env === 'production' ? '.min' : ''}.js`;

    item.banner = `/** @license ${pkg.name} v${pkg.version}\n` +
    ` * ${item.name}\n` +
    ` * \n` +
    ` * Copyright (c) ${pkg.author}\n` +
    ` * \n` +
    ` * This source code is licensed under the MIT license found in the\n` +
    ` * LICENSE file in the root directory of this source tree.\n` +
    ` */`;

    output.push(item);
  }
}

export default {
  input: './src/index.ts',
  output,
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions: ['.ts']
    }),
    resolve(), 
    commonjs(),
    typescript()
  ],
};