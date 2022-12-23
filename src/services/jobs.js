const {extractProfileQuery} = require('../helpers/extractProfileQuery')
const {tryit} = require('../helpers/tryit')

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
  const [error, job] = await tryit(model.findOne({where: clauses, include: [association]}))

  if (error) throw new Error(error)
  
  return job
}

const findOneJob = async (model, args = {}) => {
  const {profile, query, association, group, attributes, order} = args
  const clauses = {
    ...query,
  }
  association.where = {
    ...association.where,
    ...extractProfileQuery(profile)
  }
  const [error, job] = await tryit(model.findOne({where: clauses, include: [association], group, attributes, order}))

  if (error) throw new Error(error)
  
  return job
}

const findAllJobs = async (model, args = {}) => {
  const {profile, query, association, group, attributes, order, limit} = args
  association.where = {
    ...association.where,
    ...extractProfileQuery(profile)
  }
  const [error, jobs] = await tryit(model.findAll({where: query, include: [association], group, attributes, order, limit}))

  if (error) throw new Error(error)
  
  return jobs
}

const editOneJobById = async (model, jobId, newData) => {
  const [error, resp] = await tryit(model.update(newData, {where: {id: jobId}}))

  if (error) throw new Error(error)

  return resp
}

module.exports = {findOneJob, findOneJobById, findAllJobs, editOneJobById}
