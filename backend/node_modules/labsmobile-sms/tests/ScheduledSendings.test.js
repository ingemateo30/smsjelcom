const LabsMobileClient = require('../src/LabsMobileClient')
const LabsMobileModelScheduledSendings = require('../src/LabsMobileModelScheduledSendings')
const ParametersException = require('../src/Exception/ParametersException')
const RestException = require('../src/Exception/RestException')

/**
  * This test is an asynchronous feature that sends a scheduled SMS message using the LabsMobile library.
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * @param {string} subid - Message ID
  * @param {string} cmd - The possibles values are cancel and send
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test scheduled sendings successfully sent Ok', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const subid = 'mysubid'
    const cmd = 'send'
    const clientLabsMobile = new LabsMobileClient(username, token)
    const scheduledSendings = new LabsMobileModelScheduledSendings(subid, cmd)
    const response = await clientLabsMobile.scheduledSendings(scheduledSendings)
    console.log(response)
    expect(response.code).toBe(0)
    expect(response.message).toContain('Scheduled messages successfully sent.')
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
  * This test is an asynchronous function that cancels a scheduled message using the LabsMobile library.
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * @param {string} subid - Message ID
  * @param {string} cmd - The possibles values are cancel and send
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test scheduled sendings cancelled Ok', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const subid = 'mysubid'
    const cmd = 'cancel'
    const clientLabsMobile = new LabsMobileClient(username, token)
    const scheduledSendings = new LabsMobileModelScheduledSendings(subid, cmd)
    const response = await clientLabsMobile.scheduledSendings(scheduledSendings)
    console.log(response)
    expect(response.code).toBe(0)
    expect(response.message).toContain('Scheduled messages successfully cancelled.')
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
  * This test is an asynchronous function that attempts to submit with an invalid "subid" using the LabsMobile library.
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * @param {string} subid - Message ID
  * @param {string} cmd - The possibles values are cancel and send
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test subid invalid', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const subid = 'XXXXXXXXXXXX'
    const cmd = 'send'
    const clientLabsMobile = new LabsMobileClient(username, token)
    const scheduledSendings = new LabsMobileModelScheduledSendings(subid, cmd)
    const response = await clientLabsMobile.scheduledSendings(scheduledSendings)
    console.log(response)
  } catch (error) {
    expect(error.status).toBe(52)
    expect(error.message).toContain('Scheduled messages not found.')
    if (error instanceof ParametersException) {
      console.log(error.message)
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`)
    } else { throw new Error('Error: ' + error) }
  }
})
