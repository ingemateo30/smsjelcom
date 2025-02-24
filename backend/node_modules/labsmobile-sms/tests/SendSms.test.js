const LabsMobileClient = require('../src/LabsMobileClient')
const LabsMobileModelTextMessage = require('../src/LabsMobileModelTextMessage')
const ParametersException = require('../src/Exception/ParametersException')
const RestException = require('../src/Exception/RestException')

/**
  * This test is an asynchronous function that sends an SMS message using the LabsMobile library.
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * @param {string} message - Content of text message
  * @param {string} phone - Phones for send text messaget
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test send SMS Ok', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const message = 'Test SMS'
    const phone = ['34XXXXXXXXX']
    const clientLabsMobile = new LabsMobileClient(username, token)
    const bodySms = new LabsMobileModelTextMessage(phone, message)
    const response = await clientLabsMobile.sendSms(bodySms)
    expect(response.code).toBe('0')
    expect(response.message).toContain('Message has been successfully sent.')
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
  * This test is an asynchronous function that verifies the handling of a scenario in which an attempt is made to send an SMS message with the message content empty
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * @param {string} phone - Phones for send text messaget
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test variable message empty', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const message = ''
    const phone = ['34XXXXXXXXX']
    const clientLabsMobile = new LabsMobileClient(username, token)
    const bodySms = new LabsMobileModelTextMessage(phone, message)
    const test = 1 //
    bodySms.test = test //
    await clientLabsMobile.sendSms(bodySms)
  } catch (error) {
    expect(error.status).toBe('20')
    expect(error.message).toContain('The message element must be present in the request')
    if (error instanceof ParametersException) {
      console.log(error.message)
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`)
    } else { throw new Error('Error: ' + error) }
  }
})

/**
  * This test is an asynchronous function that evaluates the handling of a scenario in which an attempt is made to send an SMS message without specifying recipients
  * This test require the variables:
  * @param {string} username - Username the of account LabsMobile
  * @param {string} token - Token the of account LabsMobile
  * @param {string} message - Content of text message
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test variable phone empty', async () => {
  try {
    const username = 'myusername'
    const token = 'mytoken'
    const message = 'Test SMS'
    const phone = ['']
    const clientLabsMobile = new LabsMobileClient(username, token)
    const bodySms = new LabsMobileModelTextMessage(phone, message)
    const test = 1 //
    bodySms.test = test //
    await clientLabsMobile.sendSms(bodySms)
  } catch (error) {
    expect(error.status).toBe('23')
    expect(error.message).toContain('There are no recipients')
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
  * @param {string} message - Content of text message
  * @param {string} phone - Phones for send text messaget
*/
test('test token invalid', async () => {
  try {
    const username = 'myusername'
    const token = 'XXXXXXXXXXXX'
    const message = 'Test SMS'
    const phone = ['34XXXXXXXXX']
    const clientLabsMobile = new LabsMobileClient(username, token)
    const bodySms = new LabsMobileModelTextMessage(phone, message)
    const test = 1 //
    bodySms.test = test //
    await clientLabsMobile.sendSms(bodySms)
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
  * @param {string} message - Content of text message
  * @param {string} phone - Phones for send text messaget
  * To generate your account token you must go to the API configuration option within the WebSMS platform
  * @see https://websms.labsmobile.com/SY0204/api
*/
test('test usernmae invalid', async () => {
  try {
    const username = 'XXXXXXXXXXXX'
    const token = 'mytoken'
    const message = 'Test SMS'
    const phone = ['34XXXXXXXXX']
    const clientLabsMobile = new LabsMobileClient(username, token)
    const bodySms = new LabsMobileModelTextMessage(phone, message)
    const test = 1 //
    bodySms.test = test //
    await clientLabsMobile.sendSms(bodySms)
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
