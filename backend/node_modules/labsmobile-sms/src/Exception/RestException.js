const LabsMobileException = require('./LabsMobileException')

class RestException extends LabsMobileException {
  /**
  * Constructor.
  *
  * @param string  message user message
  * @param string  status user status
  */
  constructor (message, status) {
    super(message)
    this._message = message
    this._status = status
  }

  /**
   * Set the value of message
   *
   * @returns message parameter
   */
  set message (message) {
    this._message = message
    return message
  }

  /**
   * Get the message parameter.
   *
   * @returns message parameter
   */
  get message () {
    return this._message
  }

  /**
   * Set the value of status
   *
   * @returns status parameter
   */
  set status (status) {
    this._status = status
    return status
  }

  /**
   * Get the status parameter.
   *
   * @returns status parameter
   */
  get status () {
    return this._status
  }

  toString () {
    return 'Message=' + this._message + ', status=' + this._status
  }
}

module.exports = RestException
