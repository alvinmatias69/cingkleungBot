(function() {

'use strict';

var feedbacks = require('../models/feedback');

var feedbackService = {
	create: function(feedback) {
		feedbacks.create(feedback);
	}
}

module.exports = feedbackService;

})();