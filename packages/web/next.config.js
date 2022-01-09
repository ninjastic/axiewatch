/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['@axiewatch/design-system']);

module.exports = withPlugins([withTM]);
