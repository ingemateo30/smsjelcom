const axios = require('axios')
const winston = require('winston')
const ParametersException = require('./Exception/ParametersException')
const LabsMobileException = require('./Exception/LabsMobileException')
const RestException = require('./Exception/RestException')

class LabsMobileClient {
  /**
  * Constructor.
  *
  * @param string  token user token
  * @param string  username user username
  */

  constructor (username, token) {
    this._username = username
    this._token = token
    this._urlBase = 'https://api.labsmobile.com'
    const logConfiguration = {
      transports: [
        new winston.transports.File({
          filename: 'LabsMobile.log',
          level: 'debug'
        })
      ],
      exitOnError: false,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'DD-MMM-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${[info.timestamp]} ${info.level} - ${info.message}`)
      )
    }
    this._logger = winston.createLogger(logConfiguration)
  }

  /**
   * Set the value of token
   *
   * @returns token parameter
   */
  set token (token) {
    this._token = token
    return token
  }

  /**
   * Get the token parameter.
   *
   * @returns token parameter
   */
  get token () {
    return this._token
  }

  /**
   * Set the value of username
   *
   * @returns username parameter
   */
  set username (username) {
    this._username = username
    return username
  }

  /**
   * Get the username parameter.
   *
   * @returns username parameter
   */
  get username () {
    return this._username
  }

  async sendSms (body) {
    const bodySms = {}
    const logger = this._logger
    logger.info('LabsMobile send SMS: ' + body.toString())
    try {
      if (!this._username) {
        logger.error('Error: Username is required')
        throw new ParametersException('Error: Username is required')
      }
      if (!this._token) {
        logger.error('Error: Token is required')
        throw new ParametersException('Error: Token is required')
      }
      if (body._msisdn && body._msisdn.length > 0) {
        bodySms.recipient = body._msisdn.map(_msisdn => ({ msisdn: _msisdn }))
      }
      if (body._message !== null && body._message !== '') {
        bodySms.message = body._message
      }
      if (body._tpoa !== null && body._tpoa !== '') {
        bodySms.tpoa = body._tpoa
      }
      if (body._subid !== null && body._subid !== '') {
        bodySms.subid = body._subid
      }
      if (body._label !== null && body._label !== '') {
        bodySms.label = body._label
      }
      if (body._test !== null && body._test !== '') {
        bodySms.test = body._test
      }
      if (body._ackurl !== null && body._ackurl !== '') {
        bodySms.ackurl = body._ackurl
      }
      if (body._shortlink !== null && body._shortlink !== '') {
        bodySms.shortlink = body._shortlink
      }
      if (body._clickurl !== null && body._clickurl !== '') {
        bodySms.clickurl = body._clickurl
      }
      if (body._scheduled !== null && body._scheduled !== '') {
        bodySms.scheduled = body._scheduled
      }
      if (body._long !== null && body._long !== '') {
        bodySms.long = body._long
      }
      if (body._crt !== null && body._crt !== '') {
        bodySms.crt = body._crt
      }
      if (body._crtId !== null && body._crtId !== '') {
        bodySms.crt_id = body._crtId
      }
      if (body._crtName !== null && body._crtName !== '') {
        bodySms.crt_name = body._crtName
      }
      if (body._ucs2 !== null && body._ucs2 !== '') {
        bodySms.ucs2 = body._ucs2
      }
      if (body._nofilter !== null && body._nofilter !== '') {
        bodySms.nofilter = body._nofilter
      }
      if (body._parameters !== null && body._parameters !== '') {
        bodySms.parameters = body._parameters
      }
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this._urlBase}/json/send`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${this._username}:${this._token}`)
        },
        data: bodySms
      }
      const response = await axios.request(config)
      if (response.data.code !== '0') {
        logger.error(`Error: ${response.data.code} - ${response.data.message} `)
        throw new RestException(response.data.message, response.data.code)
      } else {
        return response.data
      }
    } catch (error) {
      if (error instanceof LabsMobileException) {
        throw error
      } else {
        console.log(error.stack)
        logger.error('ERROR: Unexpected error ', error)
      }
    }
  }

  async getCredit () {
    const logger = this._logger
    logger.info('LabsMobile get credits SMS')
    try {
      if (!this._username) {
        logger.error('Error: Username is required')
        throw new ParametersException('Error: Username is required')
      }
      if (!this._token) {
        logger.error('Error: Token is required')
        throw new ParametersException('Error: Token is required')
      }
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${this._urlBase}/json/balance`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${this._username}:${this._token}`)
        }
      }
      const response = await axios.request(config)
      if (response.data.code !== 0) {
        logger.error(`Error: ${response.data.code} - ${response.data.message} `)
        throw new RestException(response.data.message, response.data.code)
      } else {
        return response.data
      }
    } catch (error) {
      if (error instanceof LabsMobileException) {
        throw error
      } else {
        console.log(error.stack)
        logger.error('ERROR: Unexpected error ', error)
      }
    }
  }

  async getpricesCountry (body) {
    const countries = body._country
    const logger = this._logger
    logger.info('LabsMobile get SMS prices by contry' + body.toString())
    try {
      if (!this._username) {
        logger.error('Error: Username is required')
        throw new ParametersException('Error: Username is required')
      }
      if (!this._token) {
        logger.error('Error: Token is required')
        throw new ParametersException('Error: Token is required')
      }
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this._urlBase}/json/prices`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${this._username}:${this._token}`)
        },
        data: {
          countries
        }
      }
      const response = await axios.request(config)
      if (response.data.code !== undefined && response.data.code !== 0) {
        logger.error(`Error: ${response.data.code} - ${response.data.message} `)
        throw new RestException(response.data.message, response.data.code)
      } else {
        return response.data
      }
    } catch (error) {
      if (error instanceof LabsMobileException) {
        throw error
      } else {
        console.log(error.stack)
        logger.error('ERROR: Unexpected error ', error)
      }
    }
  }

  async scheduledSendings (body) {
    const subid = body._subid
    const cmd = body._cmd
    const logger = this._logger
    logger.info('LabsMobile manage scheduled sendings' + body.toString())
    try {
      if (!this._username) {
        logger.error('Error: Username is required')
        throw new ParametersException('Error: Username is required')
      }
      if (!this._token) {
        logger.error('Error: Token is required')
        throw new ParametersException('Error: Token is required')
      }
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this._urlBase}/json/scheduled`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${this._username}:${this._token}`)
        },
        data: {
          subid,
          cmd
        }
      }
      const response = await axios.request(config)
      if (response.data.code !== 0) {
        logger.error(`Error: ${response.data.code} - ${response.data.message} `)
        throw new RestException(response.data.message, response.data.code)
      } else {
        return response.data
      }
    } catch (error) {
      if (error instanceof LabsMobileException) {
        throw error
      } else {
        console.log(error.stack)
        logger.error('ERROR: Unexpected error ', error)
      }
    }
  }

  async hlrRequest (body) {
    const numbers = body._numbers
    const logger = this._logger
    logger.info('LabsMobile HLR Request' + body.toString())
    try {
      if (!this._username) {
        logger.error('Error: Username is required')
        throw new ParametersException('Error: Username is required')
      }
      if (!this._token) {
        logger.error('Error: Token is required')
        throw new ParametersException('Error: Token is required')
      }
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${this._urlBase}/hlr/?numbers=` + numbers,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${this._username}:${this._token}`)
        }
      }
      const response = await axios.request(config)
      return response.data
    } catch (error) {
      if (error instanceof LabsMobileException) {
        throw error
      } else {
        logger.error('ERROR: Unexpected error ', error)
        throw new RestException(error.response.data.error, error.response.status)
      }
    }
  }
}

module.exports = LabsMobileClient
