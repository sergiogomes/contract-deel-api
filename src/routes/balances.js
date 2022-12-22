const express = require('express')

const {getProfile} = require('../middleware/getProfile')
const {depositsMoney} = require('../controllers/balances')
const {tryit} = require('../helpers/tryit')

const router = express.Router()

/**
* @url /balances/deposit/:userId
* @description Deposits money into the the the balance of a client
*/
router.post('/deposit/:userId', getProfile, async (req, res) => {
  const args = {profile: req.profile.dataValues, body: req.body}
  const [error, balance] = await tryit(depositsMoney(req.app.get('models'), req.params.userId, args))

  if (error) res.status(404).end(error.stack)

  res.json('The money was deposited successfully')
})

module.exports = router
