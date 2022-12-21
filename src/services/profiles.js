
const findOneProfileById = async (model, profileId) => {
  const profile = await model.findOne({where: {id: profileId}})
  
  return profile
}

const editOneProfileById = async (model, profileId, newData) => {
  const resp = await model.update(newData, {where: {id: profileId}});

  return resp
}

module.exports = {findOneProfileById, editOneProfileById}
