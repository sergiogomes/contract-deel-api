const {extractProfileQuery} = require('../helpers/extractProfileQuery')
const {tryit} = require('../helpers/tryit')

const findOneContractById = async (model, contractId, args = {}) => {
  const {profile, query} = args
  const clauses = {
    ...extractProfileQuery(profile),
    ...query,
    id: contractId,
  }
  const [error, contract] = await tryit(model.findOne({where: clauses}))

  if (error) throw new Error(error)
  
  return contract
}

const findAllContracts = async (model, args = {}) => {
  const {profile, query} = args
  const clauses = {
    ...extractProfileQuery(profile),
    ...query,
  }
  const [error, contracts] = await tryit(model.findAll({where: clauses}))

  if (error) throw new Error(error)
  
  return contracts
}

module.exports = {findOneContractById, findAllContracts}
