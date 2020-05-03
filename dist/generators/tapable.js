"use strict";

var _injector = require("../injector");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function* createHtmlTagObjectsFromTags(tags) {
  for (var _i = 0, _Object$entries = Object.entries(tags); _i < _Object$entries.length; _i++) {
    const _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          tagName = _Object$entries$_i[0],
          nodes = _Object$entries$_i[1];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (Array.isArray(nodes) ? nodes : [nodes])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const attributes = _step.value;
        yield {
          tagName,
          voidTag: true,
          attributes
        };
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
}

function injectManifestTags(plugin, compilation, htmlPluginData, callback) {
  if (!plugin.htmlPlugin) plugin.htmlPlugin = true;
  (0, _injector.buildResources)(plugin, plugin.options.publicPath || compilation.options.output.publicPath, () => {
    if (plugin.options.inject) {
      let tags = (0, _injector.generateAppleTags)(plugin.options, plugin.assets);
      const themeColorTag = {
        name: 'theme-color',
        content: plugin.options['theme-color'] || plugin.options.theme_color
      };
      if (themeColorTag.content) (0, _injector.applyTag)(tags, 'meta', themeColorTag);
      (0, _injector.applyTag)(tags, 'link', Object.assign({
        rel: 'manifest',
        href: plugin.manifest.url
      }, !!plugin.options.crossorigin && {
        crossorigin: plugin.options.crossorigin
      }));
      tags = (0, _injector.generateMaskIconLink)(tags, plugin.assets);

      if (Array.isArray(htmlPluginData.head)) {
        // looks like html-webpack-plugin < v4
        htmlPluginData.head.push(...createHtmlTagObjectsFromTags(tags));
      } else {
        htmlPluginData.headTags.push(...createHtmlTagObjectsFromTags(tags));
      }
    }

    callback(null, htmlPluginData);
  });
}

function getHook(compiler, compilation) {
  // Using a local installation of the HtmlWebpackPlugin will return
  // invalid hooks, that can’t be tapped into, because they’re never
  // executed. See https://github.com/jantimon/html-webpack-plugin/issues/1091.
  // We could either make things explicit and let users pass the Plugin into
  // our options or retrieve the plugin from the webpack options.
  const HtmlWebpackPlugin = compiler.options.plugins.find(plugin => plugin.constructor.name === 'HtmlWebpackPlugin').constructor;

  if (!HtmlWebpackPlugin) {
    if (process.env.NODE_ENV === 'development') {
      console.log('it seems like you are not using html-webpack-plugin');
    }
  }

  return HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks ? HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups : compilation.hooks.htmlWebpackPluginAlterAssetTags;
}

module.exports = function (plugin, compiler) {
  compiler.hooks.compilation.tap('webpack-pwa-manifest', compilation => {
    const hook = getHook(compiler, compilation);
    if (!hook) return;
    hook.tapAsync('webpack-pwa-manifest', (data, callback) => injectManifestTags(plugin, compilation, data, callback));
  });
  compiler.hooks.emit.tapAsync('webpack-pwa-manifest', (compilation, callback) => {
    if (plugin.htmlPlugin) {
      (0, _injector.injectResources)(compilation, plugin.assets, callback);
    } else {
      (0, _injector.buildResources)(plugin, plugin.options.publicPath || compilation.options.output.publicPath, () => {
        (0, _injector.injectResources)(compilation, plugin.assets, callback);
      });
    }
  });
};