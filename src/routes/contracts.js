const express = require('express')
const { Op } = require('sequelize')

const {getProfile} = require('../middleware/getProfile')
const {findOneContractById, findAllContracts} = require('../services/contracts')

const router = express.Router()

/**
* @url /contracts/:id
* @returns contract by id
*/
router.get('/:id', getProfile, async (req, res) => {
  const {Contract} = req.app.get('models')
  const args = {profile: req.profile.dataValues}

  const contract = await findOneContractById(Contract, req.params.id, args)
  if(!contract) return res.status(404).end()
  res.json(contract)
})

/**
* @url /contracts
* @returns non terminated contracts
*/
router.get('/', getProfile, async (req, res) => {
  const {Contract} = req.app.get('models')
  const query = {status: {[Op.ne]: 'terminated'}}
  const args = {
    profile: req.profile.dataValues,
    query,
  }
  
  const contracts = await findAllContracts(Contract, args)
  if(!contracts) return res.status(404).end()
  res.json(contracts)
})

module.exports = router
