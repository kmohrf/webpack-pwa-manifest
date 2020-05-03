"use strict";

var _injector = require("../injector");

module.exports = function (that, compiler) {
  compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
      if (!that.htmlPlugin) that.htmlPlugin = true;
      (0, _injector.buildResources)(that, that.options.publicPath || compilation.options.output.publicPath, () => {
        if (that.options.inject) {
          let tags = (0, _injector.generateAppleTags)(that.options, that.assets);
          const themeColorTag = {
            name: 'theme-color',
            content: that.options['theme-color'] || that.options.theme_color
          };
          if (themeColorTag.content) (0, _injector.applyTag)(tags, 'meta', themeColorTag);
          (0, _injector.applyTag)(tags, 'link', Object.assign({
            rel: 'manifest',
            href: that.manifest.url
          }, !!that.options.crossorigin && {
            crossorigin: that.options.crossorigin
          }));
          tags = (0, _injector.generateMaskIconLink)(tags, that.assets);
          htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, `${(0, _injector.generateHtmlTags)(tags)}</head>`);
        }

        callback(null, htmlPluginData);
      });
    });
  });
  compiler.plugin('emit', (compilation, callback) => {
    if (that.htmlPlugin) {
      (0, _injector.injectResources)(compilation, that.assets, callback);
    } else {
      (0, _injector.buildResources)(that, that.options.publicPath || compilation.options.output.publicPath, () => {
        (0, _injector.injectResources)(compilation, that.assets, callback);
      });
    }
  });
};