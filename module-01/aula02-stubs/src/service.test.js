const Service = require('./service')
const assert = require('assert')
const { createSandbox } = require('sinon')
const sinon = createSandbox()

const BASE_URL_1 = 'https://swapi.dev/api/planets/1/'
const BASE_URL_2 = 'https://swapi.dev/api/planets/2/'

const mocks = {
  alderaan: require('../mocks/alderaan.json'),
  tatooine: require('../mocks/tatooine.json')
}

;(async () => {
  {

    /**
     * This approach makes a real request
     * 
     * const service = new Service()
     * const data = await service.makeRequest(BASE_URL_1)
     */

    const service = new Service()
    const stub = sinon.stub(
      service,
      service.makeRequest.name
    )

    stub
      .withArgs(BASE_URL_1)
      .resolves(mocks.tatooine)

    stub
      .withArgs(BASE_URL_2)
      .resolves(mocks.alderaan)

    {

     const expected = {
      name: "Tatooine",
      surfaceWater: "1",
      appearedIn: 5
     }

     const result = await service.getPlanets(BASE_URL_1)
     assert.deepEqual(result, expected)

    }

    {

     const expected = {
      name: "Alderaan",
      surfaceWater: "40",
      appearedIn: 2
     }

     const result = await service.getPlanets(BASE_URL_2)
     assert.deepEqual(result, expected)

    }
    
  }
})()

