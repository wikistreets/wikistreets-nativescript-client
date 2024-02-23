const sveltePreprocess = require('svelte-preprocess')
const svelteNativePreprocessor = require('svelte-native-preprocessor')

module.exports = {
  compilerOptions: {
    namespace: 'foreign',
  },
  preprocess: [
    svelteNativePreprocessor() /*, other preprocesser eg sveltePreprocessor() here */,
    sveltePreprocess({
      typescript: {
        compilerOptions: {
          target: 'es2020',
        },
      },
    }),
  ],
}
