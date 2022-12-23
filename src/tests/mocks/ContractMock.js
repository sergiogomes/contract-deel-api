const SequelizeMock = require('sequelize-mock')


const STATUS = ['new', 'in_progress', 'terminated']
const IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
var groceries = [
  'milk',
  'coriander',
  'cucumber',
  'eggplant'
  ]
  let mygroceries = groceries[Math.floor(Math.random() * groceries.length)]

const dbMock = new SequelizeMock()
const ContractMock = dbMock.define('contract', {
  id: 1,
  terms: 'bla bla bla',
  status: 'terminated',
  ClientId: 1,
  ContractorId: 5
})

ContractMock.$queryInterface.$useHandler((query, queryOptions) => {
  if (query === 'findAll') {
    const limit = queryOptions[0].limit || 10;
    const result = [];

    for (let x = 0; x < limit; x++) {
      result.push(ContractMock.build({
        id: x,
        status: STATUS[Math.floor(Math.random() * STATUS.length)],
        ClientId: IDS[Math.floor(Math.random() * IDS.length)],
        ContractorId: IDS[Math.floor(Math.random() * IDS.length)],
      }))
    }
    
    return result;
  }

  if (query === 'findOne') {
    const id = queryOptions[0].where.id || 10;
    return ContractMock.build({
      id,
      status: STATUS[Math.floor(Math.random() * STATUS.length)],
      ClientId: IDS[Math.floor(Math.random() * IDS.length)],
      ContractorId: IDS[Math.floor(Math.random() * IDS.length)],
    })
  }
})

module.exports = {ContractMock}
