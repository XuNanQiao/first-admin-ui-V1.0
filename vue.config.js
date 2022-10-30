const webpack = require('webpack')

module.exports = {
    lintOnSave: false, // false 关闭; true 编译警告不中止运行 ;default 浏览器报错 ; error 编译器报错 终止运行
    productionSourceMap: false,
    publicPath: '/',
    chainWebpack: config => {
        config.plugin('provide').use(webpack.ProvidePlugin,[{
            'window.Quill':'quill/dist/quill.js',
            'Quill':'quill/dist/quill.js',
        }])
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-plugin-px2rem')({
                        rootValue:192,      // 新版本的是这个值
                        mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
                        minPixelValue: 3 //设置要替换的最小像素值(3px会被转rem)。 默认 0
                    }),
                ]
            }
        }
    },
    devServer: {
        proxy: process.env.NODE_ENV === 'development' ? {
            [process.env.VUE_APP_BASE_PATH]: {
                target: 'http://120.53.243.46:8765/',
                changeOrigin: true,
                pathRewrite: {
                    [`^${process.env.VUE_APP_BASE_PATH}`]: [process.env.VUE_APP_BAAS_PATH]
                },
            }
        }:{
            [process.env.VUE_APP_BASE_PATH]: {
              //  target: "http://120.53.243.46:8123/",
                changeOrigin: true,
                pathRewrite: {
                    [`^/${process.env.VUE_APP_BASE_PATH}`]: [process.env.VUE_APP_BAAS_PATH]
                },
            }
        }
    }
}