const express = require('express')
const bodyParser = require('body-parser')

const {sequelize} = require('./model')
// const adminRoutes = require('./routes/admin')
const balanceRoutes = require('./routes/balances')
const contractRoutes = require('./routes/contracts')
const jobRoutes = require('./routes/jobs')

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

// api routes
// app.use('/admin', adminRoutes)
app.use('/balances', balanceRoutes)
app.use('/contracts', contractRoutes)
app.use('/jobs', jobRoutes)

module.exports = app;
