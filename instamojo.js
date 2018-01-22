'use strict';

function Instamojo(httpClient) {
  var self = this;
  self.env = "production";
  this.httpClient = httpClient;

  this.endPoints = {
    baseUrl: self._getBaseUrl(),
    create: 'payment_requests/',
    paymentStatus: 'payment_requests/',
    links: 'links/',
    refund: 'refunds/'
  };

  this.paymentFields = {
    'purpose': '',
    'amount': '',
    'currency': 'INR',
    'buyer_name': '',
    'email': '',
    'phone': '',
    'send_email': '',
    'send_sms': '',
    'allow_repeated_payments': '',
    'webhook': '',
    'redirect_url': '',
  };
  this.refundFields = {
    'payment_id': '',
    'type': '',
    'body': '',
    'refund_amount': ''
  };
  return self;
}

Instamojo.prototype = {


  setToken: function (token) {
    if (token.indexOf("production") === 0) {
      this.token = token.substr(10);
      this.env = "production";
    } else if (token.indexOf("token") === 0) {
      this.token = token.substr(4);
      this.env = "test";
    }
  },
  _getBaseUrl: function () {
    if (!this.env) {
      this.env = "test";
    }
    if (this.env == "test") {
      return "https://test.instamojo.com/v2/";
    } else {
      return "https://api.instamojo.com/v2/";
    }
  },
  caller: function (url, method, data, headers) {
    let headers = {
      "Authorization": this.token,
    };
    alert("Headers created: " + JSON.stringify(headers));
    alert("Http client request [" + method + "]");
    switch (method.toLowerCase()) {
      case "get":
        return this.httpClient.get(url, data, headers);
        break;
      case "post":
        return this.httpClient.post(url, data, headers);
        break;
      default:
        throw "Invalid http method  [" + method + "]";
    }
  },
  createRequest: function (data) {
    var url = this._getBaseUrl() + this.endPoints.create;
    alert("Created payment request url: " + url);
    return this.caller(url, 'post', data);
  },
  getRequestDetails: function (requestId) {
    var url = this._getBaseUrl() + this.endPoints.paymentStatus + requestId + '/';
    return this.caller(url, 'get');
  },
  getPaymentDetails: function (requestId, paymentId) {
    var url = this._getBaseUrl() + this.endPoints.paymentStatus + requestId + '/' + paymentId + '/';
    return this.caller(url, 'get');
  },
  getAllPaymentRequests: function () {
    var url = this._getBaseUrl() + this.endPoints.paymentStatus;
    return this.caller(url, 'get');
  },
  createRefund: function (refundData) {
    var url = this._getBaseUrl() + this.endPoints.refund;
    return this.caller(url, 'post', refundData);
  },
  getAllRefunds: function () {
    var url = this._getBaseUrl() + this.endPoints.refund;
    return this.caller(url, 'get');
  },
  getRefundDetails: function (refundId) {
    var url = this._getBaseUrl() + this.endPoints.refund + refundId + '/'
    return this.caller(url, 'get');
  },
  refundFields: function () {
    return this.refundFields;
  },
  getPaymentFields: function () {
    return this.paymentFields;
  },
  setWebHook: function (url) {
    this.paymentFields.webhook = url;
  },
  setRedirectionUrl: function (url) {
    this.paymentFields.redirect_url = url;
  }
}

module.exports = Instamojo;
