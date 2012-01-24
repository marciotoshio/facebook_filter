var FacebookFilter = FacebookFilter || {};
FacebookFilter.Options = function() {
	this.init = function() {
		var options = load();
		setLabels();
		populateList('filter_keys', options.keys);
	}
	
	this.getOptions = function () {
		return load();
	}

	this.addKey = function(key) {
		var options = load();
		if (addKey(key, options.keys)) {
			save(options);
			addKeyToList('filter_keys', key, options.keys.indexOf(key));
			clearValue('new_key');
		}
	}
	
	this.checkOldOptions = function() {
		var oldOptions = load();
		var newOptions = { keys: new Array()	};
		if(oldOptions.messageBodyKeys) {
			newOptions.keys = newOptions.keys.concat(oldOptions.messageBodyKeys);
		}
		if(oldOptions.attachmentKeys) {
			newOptions.keys = newOptions.keys.concat(oldOptions.attachmentKeys);
		}
		if(oldOptions.authorKeys) {
			newOptions.keys = newOptions.keys.concat(oldOptions.authorKeys);
		}
		save(newOptions);
	}
	
	//private
	function setLabels() {
		document.getElementById('title').innerText = chrome.i18n.getMessage('optionsTitle');
		document.getElementById('messageText').innerText = chrome.i18n.getMessage('optionsMessageText');
		document.getElementById('legend').innerText = chrome.i18n.getMessage('optionsLegend');
		document.getElementById('newKeyLabel').innerText = chrome.i18n.getMessage('optionsNewKeyLabel');
		document.getElementById('addButton').value = chrome.i18n.getMessage('optionsAddButton');
	}
	function populateList(containerId, keys) {
		var container = document.getElementById(containerId);
		clearHtml(container);
		var list = document.createElement('ul');
		list.className = "filters";
		keys = keys.sort();
		for(var i = 0; i < keys.length; i++) {
			if(keys[i]) {
				var item = listItem(keys[i], i);
				list.appendChild(item);
			}
		}
		container.appendChild(list);
	}
	
	function addKeyToList(containerId, key, index) {
		var container = document.getElementById(containerId);
		if(container) {
			var list = container.querySelector('ul');
			var item = listItem(key, index);
			list.appendChild(item);
		}
	}
	
	function listItem(key, index) {
		var item = document.createElement('li');
		item.innerText = key;
		item.appendChild(closeLink(index));
		return item;
	}
	
	function closeLink(index) {
		var closeLink = document.createElement('a');
		closeLink.innerText = 'X';
		closeLink.setAttribute('href', '#');
		closeLink.setAttribute('data-index', index);
		closeLink.setAttribute('title', chrome.i18n.getMessage('optionsRemoveFilterTitle'));
		closeLink.addEventListener("click", removeKey, false);
		return closeLink;
	}
	
	function removeKey() {
		var options = load();
		
		var index = this.getAttribute('data-index');		
		options.keys.splice(index, 1);
		populateList('filter_keys', options.keys);
		
		save(options);
		this.parentNode.parentNode.removeChild(this.parentNode);
		
		return false;
	}
	
	function clearHtml(element) {
		if(element) element.innerHTML = '';
	}
	
	function clearValue(elementId) {
		var element = document.getElementById(elementId);
		if(element) element.value = '';
	}
	
	function addKey(key, list) {
		if(list.indexOf(key) == -1) {
			list.push(key);
			return true;
		}
		return false;
	}
	
	function load () {
		var options = localStorage['facebookFilterOptions'];
		if(options) {
			return JSON.parse(options);
		}
		else {
			return {
				keys: new Array()
			};
		}
	}

	function save(options) {
		localStorage['facebookFilterOptions'] = JSON.stringify(options);
	}
};