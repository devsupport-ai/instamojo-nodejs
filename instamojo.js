'use strict';

function Instamojo(token, httpClient) {
	var self = this;
	var env = "production";
	if (token.indexOf("production") === 0) {
		token = token.substr(10);
	} else if (token.indexOf("token") === 0) {
		token = token.substr(4);
	}
	this.token = token;
	this.httpClient = httpClient;

	this._getBaseUrl = function (env) {
		if (!env) {
			env = "test";
		}
		if (env == "test") {
			return "https://test.instamojo.com/v2/";
		} else {
			return "https://api.instamojo.com/v2/";
		}
	};
	this.endPoints = {
		baseUrl: self._getBaseUrl(env),
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
}
Instamojo.prototype = {

	caller: function (url, method, data) {
		return self.http[method](url, data, {})
	},
	createRequest: function (data) {
		var url = BASE_URL + ENDPOINTS.CREATE;
		return this.caller(url, 'post', data);
	},
	getRequestDetails: function (requestId) {
		var url = BASE_URL + ENDPOINTS.PAYMENT_STATUS + requestId + '/';
		return this.caller(url, 'get');
	},
	getPaymentDetails: function (requestId, paymentId) {
		var url = BASE_URL + ENDPOINTS.PAYMENT_STATUS + requestId + '/' + paymentId + '/';
		return this.caller(url, 'get');
	},
	getAllPaymentRequests: function () {
		var url = BASE_URL + ENDPOINTS.PAYMENT_STATUS;
		return this.caller(url, 'get');
	},
	createRefund: function (refundData) {
		var url = BASE_URL + ENDPOINTS.REFUNDS;
		return this.caller(url, 'post', refundData);
	},
	getAllRefunds: function () {
		var url = BASE_URL + ENDPOINTS.REFUNDS;
		return this.caller(url, 'get');
	},
	getRefundDetails: function (refundId) {
		var url = BASE_URL + ENDPOINTS.REFUNDS + refundId + '/'
		return this.caller(url, 'get');
	},
	refundFields: function () {
		return this.refundFields;
	},
	paymentFields: function () {
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