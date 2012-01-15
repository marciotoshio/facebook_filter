var FacebookFilter = FacebookFilter || {};
FacebookFilter.Options = FacebookFilter.Options || {};

FacebookFilter.Options.init = function () {
	var options = FacebookFilter.Options.load();
	document.getElementById('author_keys').value = options.authorKeys.join(',') || '';
	document.getElementById('message_body_keys').value = options.messageBodyKeys.join(',') || '';
}

FacebookFilter.Options.submit = function () {
	var options = FacebookFilter.Options.load();
	options.authorKeys = document.getElementById('author_keys').value.split(',');
	options.messageBodyKeys = document.getElementById('message_body_keys').value.split(',');
	FacebookFilter.Options.save(options);
	FacebookFilter.Options.showSuccess();
	return false;
}

FacebookFilter.Options.load = function () {
	var options = localStorage['facebookFilterOptions'];
	if(options) {
		return JSON.parse(options);
	}
	else {
		return {};
	}
}

FacebookFilter.Options.save = function (options) {
	localStorage['facebookFilterOptions'] = JSON.stringify(options);
}

FacebookFilter.Options.showSuccess = function () {
	var message = document.querySelector('#message');
	message.style.display = 'block';
	setTimeout(function() {
		message.style.display = 'none';
	}, 5000);
	
}