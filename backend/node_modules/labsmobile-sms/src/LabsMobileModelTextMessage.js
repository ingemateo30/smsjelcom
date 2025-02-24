class LabsMobileModelTextMessage {
  /**
  * Constructor.
  *
  * @param string  msisdn user msisdn
  * @param string  message user message
  */
  constructor (msisdn, message) {
    this._msisdn = msisdn
    this._message = message
    this._tpoa = null
    this._subid = null
    this._label = null
    this._test = null
    this._ackurl = null
    this._shortlink = null
    this._clickurl = null
    this._scheduled = null
    this._long = null
    this._crt = null
    this._crtId = null
    this._crtName = null
    this._ucs2 = null
    this._nofilter = null
    this._parameters = null
  }

  /**
   * Set the value of msisdn
   *
   * @returns msisdn parameter
   */
  set msisdn (msisdn) {
    this._msisdn = msisdn
    return msisdn
  }

  /**
   * Get the msisdn parameter.
   *
   * @returns msisdn parameter
   */
  get msisdn () {
    return this._msisdn
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
   * Set the value of tpoa
   *
   * @returns tpoa parameter
   */
  set tpoa (tpoa) {
    this._tpoa = tpoa
    return tpoa
  }

  /**
   * Get the tpoa parameter.
   *
   * @returns tpoa parameter
   */
  get tpoa () {
    return this._tpoa
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
   * Set the value of label
   *
   * @returns label parameter
   */
  set label (label) {
    this._label = label
    return label
  }

  /**
   * Get the label parameter.
   *
   * @returns label parameter
   */
  get label () {
    return this._label
  }

  /**
   * Set the value of test
   *
   * @returns test parameter
   */
  set test (test) {
    this._test = test
    return test
  }

  /**
   * Get the test parameter.
   *
   * @returns test parameter
   */
  get test () {
    return this._test
  }

  /**
   * Set the value of ackurl
   *
   * @returns ackurl parameter
   */
  set ackurl (ackurl) {
    this._ackurl = ackurl
    return ackurl
  }

  /**
     * Get the ackurl parameter.
     *
     * @returns ackurl parameter
     */
  get ackurl () {
    return this._ackurl
  }

  /**
   * Set the value of shortlink
   *
   * @returns shortlink parameter
   */
  set shortlink (shortlink) {
    this._shortlink = shortlink
    return shortlink
  }

  /**
     * Get the shortlink parameter.
     *
     * @returns shortlink parameter
     */
  get shortlink () {
    return this._shortlink
  }

  /**
   * Set the value of clickurl
   *
   * @returns clickurl parameter
   */
  set clickurl (clickurl) {
    this._clickurl = clickurl
    return clickurl
  }

  /**
     * Get the clickurl parameter.
     *
     * @returns clickurl parameter
     */
  get clickurl () {
    return this._clickurl
  }

  /**
   * Set the value of scheduled
   *
   * @returns scheduled parameter
   */
  set scheduled (scheduled) {
    this._scheduled = scheduled
    return scheduled
  }

  /**
     * Get the scheduled parameter.
     *
     * @returns scheduled parameter
     */
  get scheduled () {
    return this._scheduled
  }

  /**
   * Set the value of long
   *
   * @returns long parameter
   */
  set long (long) {
    this._long = long
    return long
  }

  /**
     * Get the long parameter.
     *
     * @returns long parameter
     */
  get long () {
    return this._long
  }

  /**
   * Set the value of crt
   *
   * @returns crt parameter
   */
  set crt (crt) {
    this._crt = crt
    return crt
  }

  /**
     * Get the crt parameter.
     *
     * @returns crt parameter
     */
  get crt () {
    return this._crt
  }

  /**
   * Set the value of crtId
   *
   * @returns crtId parameter
   */
  set crtId (crtId) {
    this._crtId = crtId
    return crtId
  }

  /**
  * Get the crtId parameter.
  *
  * @returns crtId parameter
  */
  get crtId () {
    return this._crtId
  }

  /**
   * Set the value of crtName
   *
   * @returns crtName parameter
   */
  set crtName (crtName) {
    this._crtName = crtName
    return crtName
  }

  /**
  * Get the crtName parameter.
  *
  * @returns crtName parameter
  */
  get crtName () {
    return this._crtName
  }

  /**
  * Set the value of ucs2
  *
  * @returns ucs2 parameter
  */
  set ucs2 (ucs2) {
    this._ucs2 = ucs2
    return ucs2
  }

  /**
  * Get the ucs2 parameter.
  *
  * @returns ucs2 parameter
  */
  get ucs2 () {
    return this._ucs2
  }

  /**
  * Set the value of nofilter
  *
  * @returns nofilter parameter
  */
  set nofilter (nofilter) {
    this._nofilter = nofilter
    return nofilter
  }

  /**
  * Get the nofilter parameter.
  *
  * @returns nofilter parameter
  */
  get nofilter () {
    return this._nofilter
  }

  /**
  * Set the value of parameters
  *
  * @returns parameters parameter
  */
  set parameters (parameters) {
    this._parameters = parameters
    return parameters
  }

  /**
    * Get the parameters parameter.
    *
    * @returns parameters parameter
    */
  get parameters () {
    return this._parameters
  }

  toString () {
    return '[destination=' + this._msisdn + ', message=' + this._message + ']'
  }
}

module.exports = LabsMobileModelTextMessage
