module.exports = {
    entry: './src/index.jsx',

    output: {
        filename: 'bundle.js',
        path: './public',
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                //loaders: ['babel-loader']
                loader: 'babel',
                query: {
                    presets:['react','es2015','stage-3']
                }
            }
        ]
    },

    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },

    devtool: 'eval-source-map',
    
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};