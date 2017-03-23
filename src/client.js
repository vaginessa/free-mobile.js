import EventEmitter from 'events';
import superagent from 'superagent';

/**
 * Sends messages by SMS to a [Free Mobile](http://mobile.free.fr) account.
 */
export class Client extends EventEmitter {

  /**
   * The URL of the default API end point.
   * @type {string}
   */
  static get DEFAULT_ENDPOINT() {
    return 'https://smsapi.free-mobile.fr';
  }

  /**
   * Initializes a new instance of the class.
   * @param {string} [username] The user name associated to the account.
   * @param {string} [password] The identification key associated to the account.
   * @param {string} [endPoint] The URL of the API end point.
   */
  constructor(username = '', password = '', endPoint = Client.DEFAULT_ENDPOINT) {
    super();

    /**
     * The URL of the API end point.
     * @type {string}
     */
    this.endPoint = endPoint;

    /**
     * The identification key associated to the account.
     * @type {string}
     */
    this.password = password;

    /**
     * The user name associated to the account.
     * @type {string}
     */
    this.username = username;
  }

  /**
   * Sends a SMS message to the underlying account.
   * @param {string} text The text of the message to send.
   * @return {Promise} Completes when the operation is done.
   * @emits {superagent.Request} The "request" event.
   * @emits {superagent.Response} The "response" event.
   */
  async sendMessage(text) {
    if (!this.username.length || !this.password.length) throw new Error('The account credentials are invalid.');

    let message = text.trim();
    if (!message.length) throw new Error('The specified message is empty.');

    let request = superagent.get(`${this.endPoint}/sendmsg`).query({
      msg: message.substr(0, 160),
      pass: this.password,
      user: this.username
    });

    this.emit('request', request);
    let response = await request;
    this.emit('response', response);

    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return null;
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      endPoint: this.endPoint,
      password: this.password,
      username: this.username
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}
