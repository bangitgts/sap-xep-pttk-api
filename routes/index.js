const accountRouter = require('./accout.route');

function route(app) {
    app.use('/account', accountRouter)
}

module.exports = route;