exports.middlewareGlobal = (req, res, next) => {
    res.locals.umaVariavelGlobal = 'Este é o valor da variavel local.'
    next()
}

exports.outroMidlleware = (req, res, next) => {
    console.log('Outro midlle')
    next()
}

exports.checkCsrfError = (err, req, res, next)=> {
    if(err && err.code === 'EBADCSRFTOKEN') {
        return res.render('404')
    }
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}