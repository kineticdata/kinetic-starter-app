module.exports = {
  webpack: {
    configure: webpackConfig => {
      // Fix for strict EcmaScript Module error, not fixed in the latest React Scripts (5.0.1 at the time of this
      // comment) without ejecting and making this change. FYI: This is the only reason for Craco to be used.
      // https://github.com/webpack/webpack/issues/11636
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });

      // Fix for CJS files not being treated as JavaScript files
      // https://github.com/facebook/create-react-app/issues/11889#issuecomment-1114928008
      const fileLoaderRule = getFileLoaderRule(webpackConfig.module.rules);
      if (!fileLoaderRule) {
        throw new Error("File loader not found");
      }
      fileLoaderRule.exclude.push(/\.cjs$/);

      return webpackConfig;
    },
  },
};

function getFileLoaderRule(rules) {
  for (const rule of rules) {
    if ("oneOf" in rule) {
      const found = getFileLoaderRule(rule.oneOf);
      if (found) {
        return found;
      }
    } else if (rule.test === undefined && rule.type === 'asset/resource') {
      return rule;
    }
  }
}