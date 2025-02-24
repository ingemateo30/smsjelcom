const LabsMobileClient = require('../src/LabsMobileClient')
const ParametersException = require('../src/Exception/ParametersException')
const RestException = require('../src/Exception/RestException')

/**
  *This test is an asynchronous function that queries the number of credits available using the LabsMobile library. //
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test get credits Ok', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const clientLabsMobile = new LabsMobileClient(username, token)
    const response = await clientLabsMobile.getCredit()
    expect(response.code).toBe(0)
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
*/
test('test token invalid', async () => {
  try {
    const username = 'myusername'
    const token = 'XXXXXXXXXXXX'
    const clientLabsMobile = new LabsMobileClient(username, token)
    await clientLabsMobile.getCredit()
  } catch (error) {
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
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test usernmae invalid', async () => {
  try {
    const username = 'XXXXXXXXXXXX'
    const token = 'mytoken'
    const clientLabsMobile = new LabsMobileClient(username, token)
    await clientLabsMobile.getCredit()
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
