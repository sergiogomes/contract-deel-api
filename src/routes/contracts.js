const express = require('express')

const {getProfile} = require('../middleware/getProfile')
const {getContractById, getOpenContracts} = require('../controllers/contracts')
const {tryit} = require('../helpers/tryit')

const router = express.Router()

/**
* @url /contracts/:id
* @returns contract by id
*/
router.get('/:id', getProfile, async (req, res) => {
  const args = {profile: req.profile.dataValues}
  const [error, contract] = await tryit(getContractById(req.app.get('models'), req.params.id, args))
  
  if (error) return res.status(404).end(error.stack)
  
  res.json(contract)
})

/**
* @url /contracts
* @returns non terminated contracts
*/
router.get('/', getProfile, async (req, res) => {
  const args = {profile: req.profile.dataValues}
  const [error, contracts] = await tryit(getOpenContracts(req.app.get('models'), args))

  if (error) return res.status(404).end(error.stack)

  res.json(contracts)
})

module.exports = router
