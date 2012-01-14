var FacebookFilter = FacebookFilter || {};
FacebookFilter.Options = FacebookFilter.Options || {};

FacebookFilter.Options.init = function () {
	var options = FacebookFilter.Options.load();
	document.getElementById('author_keys').value = options.authorKeys || '';
}

FacebookFilter.Options.submit = function () {
	var options = FacebookFilter.Options.load();
	options.authorKeys = document.getElementById('author_keys').value;
	FacebookFilter.Options.save(options);
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