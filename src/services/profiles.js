const {tryit} = require('../helpers/tryit')

const findOneProfileById = async (model, profileId) => {
  const [error, profile] = await tryit(model.findOne({where: {id: profileId}}))

  if (error) {
    throw new Error(error)
  }
  
  return profile
}

const editOneProfileById = async (model, profileId, newData) => {
  const [error, resp] = await tryit(model.update(newData, {where: {id: profileId}}))

  if (error) {
    throw new Error(error)
  }

  return resp
}

module.exports = {findOneProfileById, editOneProfileById}
