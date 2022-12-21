const {extractProfileQuery} = require('../helpers/extractProfileQuery')

const findOneContractById = async (model, contractId, args = {}) => {
  const {profile, query} = args
  const clauses = {
    ...extractProfileQuery(profile),
    ...query,
    id: contractId,
  }
  const contract = await model.findOne({where: clauses})
  
  return contract
}

const findAllContracts = async (model, args = {}) => {
  const {profile, query} = args
  const clauses = {
    ...extractProfileQuery(profile),
    ...query,
  }
  const contracts = await model.findAll({where: clauses})
  
  return contracts
}

module.exports = {findOneContractById, findAllContracts}
