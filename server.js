require('dotenv').config() // variaveis de ambiente no .env que não podem ser exibidas

// inicio do express
const express = require('express')
const app = express()

// mongoose mondelagem de dados
const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        app.emit('pronto')
    })
    .catch(e => console.log(e))

const session = require('express-session') // salvar sessão na bd(cookies)
const MongoStore = require('connect-mongo') // garantir salavamento da sessão na bd
const flash = require('connect-flash') // flash messages
const routes = require('./routes') // link das rotas da app
const path = require('path') // facilitador de caminhos path
const helmet = require('helmet') // recomendação de proteção do express
const csrf = require('csurf') // token de proteção para forms
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware') // linkando os middlewares da app

app.use(helmet()) // usando o helmet
app.use(express.urlencoded({ extended: true })) // permite a postagem de forms para dentro do app
app.use(express.json()) // faz a passagem de json parao app

app.use(express.static(path.resolve(__dirname, 'public'))) //conteudo estático ex. imgs, css, js

// configs de sessão
const sessionOptions = session({
    secret: 'asdkasjdkasdjkjas asd fjs a6()',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})

app.use(sessionOptions) // usando as sessões
app.use(flash()) // usando flash messages

// views
app.set('views', path.resolve(__dirname, 'src', 'views')) // usando os views
app.set('view engine', 'ejs'); // engine para renderizar o html

app.use(csrf()) // usando token csrf

// Nossos próprios middlewares
app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)

app.use(routes) // usando as rotas na app

// garantindo que a connect do bd antes do inicio da app
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000')
        console.log('Servidor executando na porta 3000')
    })
})

