const LabsMobileClient = require('../src/LabsMobileClient')
const LabsMobileModelCountryPrice = require('../src/LabsMobileModelCountryPrice')
const ParametersException = require('../src/Exception/ParametersException')
const RestException = require('../src/Exception/RestException')

/**
  *This test is an asynchronous function that queries the number of credits available using the LabsMobile library. //
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * @param {string} countries - Array of countries
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test get credits Ok', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const countries = ['CO', 'ES']
    const clientLabsMobile = new LabsMobileClient(username, token)
    const countriesPrice = new LabsMobileModelCountryPrice(countries)
    const response = await clientLabsMobile.getpricesCountry(countriesPrice)
    console.log(response)
    Object.keys(response).forEach(countryCode => {
      expect(response).toHaveProperty(countryCode)
      expect(response[countryCode]).toHaveProperty('isocode')
      expect(response[countryCode]).toHaveProperty('prefix')
      expect(response[countryCode]).toHaveProperty('name')
      expect(response[countryCode]).toHaveProperty('credits')
      expect(response[countryCode].isocode).toBeDefined()
      expect(response[countryCode].prefix).toBeDefined()
      expect(response[countryCode].name).toBeDefined()
      expect(response[countryCode].credits).toBeDefined()
    })
  } catch (error) {
    expect(error).toMatch('error')
    if (error instanceof ParametersException) {
      console.log(error.message)
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`)
    } else { throw new Error('Error: ' + error) }
  }
})

/**
  * This test is an asynchronous function that evaluates the handling of a scenario in which an attempt is made to send an SMS message with invalid credentials.
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} countries - Array of countries
*/
test('test token invalid', async () => {
  try {
    const username = 'myusername'
    const token = 'XXXXXXXXXXXX'
    const countries = ['CO', 'ES']
    const clientLabsMobile = new LabsMobileClient(username, token)
    const countriesPrice = new LabsMobileModelCountryPrice(countries)
    const response = await clientLabsMobile.getpricesCountry(countriesPrice)
    console.log(response)
  } catch (error) {
    console.log(error)
    expect(error.status).toBe('401')
    expect(error.message).toContain('Unauthorized')
    if (error instanceof ParametersException) {
      console.log(error.message)
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`)
    } else { throw new Error('Error: ' + error) }
  }
})

/**
  * This test is an asynchronous function that evaluates the handling of a scenario in which an attempt is made to send an SMS message with invalid credentials.
  * This test require the variables:
  * @param {string} token - Token the of account LabsMobile
  * @param {string} countries - Array of countries
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test usernmae invalid', async () => {
  try {
    const username = 'XXXXXXXXXXXX'
    const token = 'mytoken'
    const countries = ['CO', 'ES']
    const clientLabsMobile = new LabsMobileClient(username, token)
    const countriesPrice = new LabsMobileModelCountryPrice(countries)
    const response = await clientLabsMobile.getpricesCountry(countriesPrice)
    console.log(response)
  } catch (error) {
    expect(error.status).toBe('403')
    expect(error.message).toContain('Forbidden')
    if (error instanceof ParametersException) {
      console.log(error.message)
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`)
    } else { throw new Error('Error: ' + error) }
  }
})
