import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import terser from '@rollup/plugin-terser';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    //打包文件目录
    outDir: 'dist',
    //压缩
    //minify: false,
    rollupOptions: {
      plugins: [terser()],
      external: ['vue', 'btc-connect'],
      output: {
        name: 'BtcConnectVue',
        exports: 'named',
        globals: {
          vue: 'Vue',
          'btc-connect': 'BtcConnect',
        },
      },
    },
    lib: {
      entry: resolve(__dirname, 'packages', 'index.ts'),
      name: 'BtcConnectVue',
      fileName: 'btc-connect-vue',
    },
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),

    dts({
      tsconfigPath: 'tsconfig.app.json',
      // copyDtsFiles: true,
      // outDir: ['dist'],
      // compilerOptions: {
      //   declarationMap: false,
      // },
      include: ['packages/**/*'],
    }),
  ],
});
