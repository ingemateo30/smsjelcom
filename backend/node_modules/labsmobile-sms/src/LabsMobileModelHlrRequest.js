class LabsMobileModelHlrRequest {
  /**
  * Constructor.
  *
  * @param string  numbers user numbers
  */
  constructor (numbers) {
    this._numbers = numbers
  }

  /**
   * Set the value of numbers
   *
   * @returns numbers parameter
   */
  set numbers (numbers) {
    this._country = numbers
    return numbers
  }

  /**
   * Get the numbers parameter.
   *
   * @returns numbers parameter
   */
  get numbers () {
    return this._numbers
  }

  toString () {
    return '[telephone numbers=' + this._numbers + ']'
  }
}

module.exports = LabsMobileModelHlrRequest
