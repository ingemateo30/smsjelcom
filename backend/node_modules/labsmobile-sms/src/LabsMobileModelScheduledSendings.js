class LabsMobileModelScheduledSendings {
  /**
  * Constructor.
  *
  * @param string  subid user subid
  * @param string  cmd user cmd
  */
  constructor (subid, cmd) {
    this._subid = subid
    this._cmd = cmd
  }

  /**
   * Set the value of subid
   *
   * @returns subid parameter
   */
  set subid (subid) {
    this._subid = subid
    return subid
  }

  /**
   * Get the subid parameter.
   *
   * @returns subid parameter
   */
  get subid () {
    return this._subid
  }

  /**
   * Set the value of subid
   *
   * @returns subid parameter
   */
  set cmd (cmd) {
    this._cmd = cmd
    return cmd
  }

  /**
   * Get the subid parameter.
   *
   * @returns subid parameter
   */
  get cmd () {
    return this._cmd
  }

  toString () {
    return '[subid=' + this._subid + ', cmd=' + this._cmd + ']'
  }
}

module.exports = LabsMobileModelScheduledSendings
