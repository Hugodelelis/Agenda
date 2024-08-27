exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    next()
}

exports.outroMidlleware = (req, res, next) => {
    console.log('Outro midlle')
    next()
}

exports.checkCsrfError = (err, req, res, next)=> {
    if(err) {
        return res.render('404')
    }

    next()
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    
    next()
}