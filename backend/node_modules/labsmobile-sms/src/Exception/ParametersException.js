const LabsMobileException = require('./LabsMobileException')

class ParametersException extends LabsMobileException {
  /**
  * Constructor.
  *
  * @param string  message user message
  */
  constructor (message) {
    super(message, undefined)
    this._message = message
  }

  /**
   * Set the value of message
   *
   * @returns message parameter
   */
  set message (message) {
    this._message = message
  }

  /**
   * Get the message parameter.
   *
   * @returns message parameter
   */
  get message () {
    return this._message
  }

  toString () {
    return 'Message=' + this._message
  }
}

module.exports = ParametersException
