'use strict';

function Instamojo(httpClient) {
	var self = this;
	self.env = "production";
	this.httpClient = httpClient;

	this.setToken = function(token) {
		if (token.indexOf("production") === 0) {
			token = token.substr(10);
			self.env = "production";
		} else if (token.indexOf("token") === 0) {
			token = token.substr(4);
			self.env = "test";
		}
	}

	this.endPoints = {
		baseUrl: self._getBaseUrl(),
		create: 'payment_requests/',
		paymentStatus: 'payment_requests/',
		links: 'links/',
		refund: 'refunds/'
	};
	this.header = {
		'Authorization': "Bearer token"
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

	  switch(method.toLowerCase()) {
      case "get":
        return this.http.get(url, data, headers);
        break;
      case "post":
        return this.http.post(url, data, headers);
        break;
      default:
        throw "Invalid http method [" + method + "]";
    }
  },
	createRequest: function (data) {
		var url = this._getBaseUrl() + this.endPoints.create;

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
