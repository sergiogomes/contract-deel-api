const {extractProfileQuery} = require('../helpers/extractProfileQuery')

const findOneJobById = async (model, jobId, args = {}) => {
  const {profile, query, association} = args
  const clauses = {
    ...query,
    id: jobId,
  }
  association.where = {
    ...association.where,
    ...extractProfileQuery(profile)
  }
  const contract = await model.findOne({where: clauses, include: [association]})
  
  return contract
}

const findAllJobs = async (model, args = {}) => {
  const {profile, query, association} = args
  association.where = {
    ...association.where,
    ...extractProfileQuery(profile)
  }
  const jobs = await model.findAll({where: query, include: [association]})
  
  return jobs
}

const editOneJobById = async (model, jobId, newData) => {
  const resp = await model.update(newData, {where: {id: jobId}});

  return resp
}

module.exports = {findOneJobById, findAllJobs, editOneJobById}
