const { Op } = require('sequelize')

const {findOneContractById, findAllContracts} = require('../services/contracts')
const {tryit} = require('../helpers/tryit')

const getContractById = async (models, contractId, args) => {
  const {Contract} = models

  const [error, contract] = await tryit(findOneContractById(Contract, contractId, args))

  if (error) throw new Error(error)

  return contract
}

const getOpenContracts = async (models, args) => {
  const {Contract} = models
  args.query = {status: {[Op.ne]: 'terminated'}}

  const [error, contracts] = await tryit(findAllContracts(Contract, args))

  if (error) throw new Error(error)

  return contracts
}

module.exports = {getContractById, getOpenContracts}
