const path = require("path");

module.exports = (isProduction) => ({
    entry: "./src/client/js/app.js",
    mode: isProduction ? "production" : "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js",
    },
    devtool: isProduction ? false : "source-map",
    module: {
        rules: getRules(isProduction),
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
});

function getRules(isProduction) {
    return [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        ["@babel/preset-env", { targets: "defaults" }],
                        "@babel/preset-react",
                    ],
                },
            },
        },
    ];
}
