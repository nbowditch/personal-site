const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 

const DEVELOPMENT = process.env.NODE_ENV == 'dev';
const PRODUCTION = process.env.NODE_ENV == 'prod';

var entry = PRODUCTION
	? 	['./src/index.js']
	: 	[
			'./src/index.js',
			'webpack/hot/dev-server',
			'webpack-dev-server/client?http://localhost:8080'
		];

var plugins = PRODUCTION
	? 	[
			new ExtractTextPlugin('style-[contenthash:10].css'),
			new HtmlWebpackPlugin({
				template: 'index-template.html'
			}),
			new webpack.optimize.UglifyJsPlugin()
		]
	: 	[
			new webpack.HotModuleReplacementPlugin()
		]
plugins.push(
	new webpack.DefinePlugin({
		DEVELOPMENT: JSON.stringify(DEVELOPMENT),
		PRODUCTION: JSON.stringify(PRODUCTION)
	})
);

const cssIdentifier = PRODUCTION ? '[hash:base64:10]' : '[path][name]---[local]';
const cssLoaders = PRODUCTION 
	? 	ExtractTextPlugin.extract({
			loader: 'css-loader?localIdentName=' + cssIdentifier
		})
	: 	['style-loader', 'css-loader?localIdentName=' + cssIdentifier];

module.exports = {
	entry: entry,
	devtool: 'source-map',
	plugins: plugins,
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['babel-loader'],
			exclude: '/node_modules/'
		}, {
			test: /\.(png|jpg|gif)$/,
			loaders: ['url-loader?limit=10000&name=img/[hash:12].[ext]'],
			exclude: '/node_modules/'
		}, {
			test: /\.css$/,
			loaders: cssLoaders,
			exclude: '/node_modules/'
		}]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: PRODUCTION ? '/' : '/dist/',
		filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js'
	}
}