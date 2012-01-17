var FacebookFilter = FacebookFilter || {};
FacebookFilter.Options = function() {
	this.init = function() {
		var options = load();
		document.getElementById('author_keys').value = options.authorKeys.join(',') || '';
		document.getElementById('message_body_keys').value = options.messageBodyKeys.join(',') || '';
	}
	
	this.submit = function() {
		var options = load();
		options.authorKeys = document.getElementById('author_keys').value.split(',');
		options.messageBodyKeys = document.getElementById('message_body_keys').value.split(',');
		save(options);
		showSuccess();
		return false;
	}
	
	this.getOptions = function () {
		return load();
	}
	
	this.addAuthorKey = function(key) {
		var options = load();
		if (addKey(key, options.authorKeys))
			save(options);
	}

	this.addMessageBodyKey = function(key) {
		var options = load();
		if (addKey(key, options.messageBodyKeys))
			save(options);
	}
	
	//private
	function addKey(key, list) {
		if(list.indexOf(key) == -1) {
			list.push(key);
			return true;
		}
		return false;
	}
	
	function showSuccess () {
		var message = document.querySelector('#message');
		message.style.display = 'block';
		setTimeout(function() {
			message.style.display = 'none';
		}, 5000);
	}
	
	function load () {
		var options = localStorage['facebookFilterOptions'];
		if(options) {
			return JSON.parse(options);
		}
		else {
			return {
				authorKeys: new Array(),
				messageBodyKeys: new Array()
			};
		}
	}

	function save(options) {
		localStorage['facebookFilterOptions'] = JSON.stringify(options);
	}
};