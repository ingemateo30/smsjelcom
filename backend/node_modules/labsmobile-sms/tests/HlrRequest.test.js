const LabsMobileClient = require('../src/LabsMobileClient')
const LabsMobileModelHlrRequest = require('../src/LabsMobileModelHlrRequest')
const ParametersException = require('../src/Exception/ParametersException')
const RestException = require('../src/Exception/RestException')

/**
  * This test is an asynchronous function that is responsible for validating whether a phone number is active using the LabsMobile library.
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * @param {int} numbers - Numbers
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test hlr request Ok', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const numbers = []
    const clientLabsMobile = new LabsMobileClient(username, token)
    const hlr = new LabsMobileModelHlrRequest(numbers)
    const response = await clientLabsMobile.hlrRequest(hlr)
    expect(response.result).toBe('ok')
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
  * This test is an asynchronous function that is responsible for validating in case the credentials are not correct using the LabsMobile library.
  * This test require the variables:
  * @param {int} numbers - Numbers
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test invalid credentials', async () => {
  try {
    const username = 'XXXXXXXXXXXX'
    const token = 'XXXXXXXXXXXX'
    const numbers = []
    const clientLabsMobile = new LabsMobileClient(username, token)
    const hlr = new LabsMobileModelHlrRequest(numbers)
    const response = await clientLabsMobile.hlrRequest(hlr)
    console.log(response)
  } catch (error) {
    expect(error.status).toBe(500)
    expect(error.message).toContain('invalidauth')
    if (error instanceof ParametersException) {
      console.log(error.message)
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`)
    } else { throw new Error('Error: ' + error) }
  }
})
