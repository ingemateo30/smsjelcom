class LabsMobileModelCountryPrice {
  /**
  * Constructor.
  *
  * @param string  price user price
  */
  constructor (country) {
    this._country = country
  }

  /**
   * Set the value of price
   *
   * @returns price parameter
   */
  set country (country) {
    this._country = country
    return country
  }

  /**
   * Get the price parameter.
   *
   * @returns price parameter
   */
  get country () {
    return this._country
  }

  toString () {
    return '[Countries=' + this._country + ']'
  }
}

module.exports = LabsMobileModelCountryPrice
