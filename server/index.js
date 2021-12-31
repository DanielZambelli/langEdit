require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const basicAuth = require('express-basic-auth')
const Projects = require('./projects')
const routeController = require('./controller')

// configs
const authPublic = basicAuth({ users: { [process.env.PUBLIC_APP_USER]: process.env.PUBLIC_APP_PASS }, challenge: true })
const authClient = basicAuth({ users: { [process.env.PUBLIC_CLIENT_USER]: process.env.PUBLIC_CLIENT_PASS }, challenge: true })
app.use(cors())
app.use(express.json())

// public api
app.use('/public/*', authPublic)
app.get('/public/api/project/:id', routeController((params) => Projects.findOne({ where: { id: params.id } })))

// client api
app.use('/client/*', authClient)
app.get('/client/api/projects', routeController(() => Projects.findAll( { order: [['id','ASC']] } )))
app.put('/client/api/project', routeController(({ project: { id, body }}) => Projects.findOne({ where: { id } }).then(p => { p.body = { ...p.body, ...body }; return p.save(); })))
app.post('/client/api/project', routeController(({ project: { body }}) => Projects.create({body})))

// serve web app
app.use(express.static(__dirname+'/build/'))
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname+'/../build/index.html')))

// init server
app.listen(process.env.PORT, () => console.log('>> server started'))
