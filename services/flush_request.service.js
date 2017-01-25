(function() {

'use strict';

var flushRequestService = function(req, res, next) {
	res.end();
}

module.exports = flushRequestService;

})();