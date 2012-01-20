var FacebookFilter = FacebookFilter || {};
FacebookFilter.Options = function() {
	this.init = function() {
		var options = load();
		populateList('message_body_filters', options.messageBodyKeys, 'messageBody');
		populateList('attachment_filters', options.attachmentKeys, 'attachment');
		populateList('author_filters', options.authorKeys, 'author');
	}
	
	this.getOptions = function () {
		return load();
	}

	this.addMessageBodyKey = function(key) {
		var options = load();
		if (addKey(key, options.messageBodyKeys)) {
			save(options);
			addKeyToList('message_body_filters', key, options.messageBodyKeys.indexOf(key), 'messageBody');
			clearValue('message_body_new_filter');
		}
	}
	
	this.addAttachmentKey = function(key) {
		var options = load();
		if (addKey(key, options.attachmentKeys)) {
			save(options);
			addKeyToList('attachment_filters', key, options.attachmentKeys.indexOf(key), 'attachment');
			clearValue('attachment_new_filter');
		}
	}
	
	this.addAuthorKey = function(key) {
		var options = load();
		if (addKey(key, options.authorKeys)) {
			save(options);
			addKeyToList('author_filters', key, options.authorKeys.indexOf(key), 'author');
			clearValue('author_new_filter');
		}
	}
	
	//private
	function populateList(containerId, keys, listName) {
		var container = document.getElementById(containerId);
		clearHtml(container);
		var list = document.createElement('ul');
		list.className = "filters";
		for(var i in keys) {
			if(keys[i]) {
				var item = listItem(keys[i], i, listName);
				list.appendChild(item);
			}
		}
		container.appendChild(list);
	}
	
	function addKeyToList(containerId, key, index, listName) {
		var container = document.getElementById(containerId);
		if(container) {
			var list = container.querySelector('ul');
			var item = listItem(key, index, listName);
			list.appendChild(item);
		}
	}
	
	function listItem(key, index, listName) {
		var item = document.createElement('li');
		item.innerText = key;
		item.appendChild(closeLink(index, listName));
		return item;
	}
	
	function closeLink(index, listName) {
		var closeLink = document.createElement('a');
		closeLink.innerText = 'X';
		closeLink.setAttribute('href', '#');
		closeLink.setAttribute('data-index', index);
		closeLink.setAttribute('data-list', listName);
		closeLink.setAttribute('title', 'remove filter');
		closeLink.addEventListener("click", removeKey, false);
		return closeLink;
	}
	
	function removeKey() {
		var options = load();
		
		var index = this.getAttribute('data-index');
		var listName = this.getAttribute('data-list');
		
		if(listName === 'messageBody') {
			options.messageBodyKeys.splice(index, 1);
			populateList('message_body_filters', options.messageBodyKeys, 'messageBody');
		}
		
		if(listName === 'attachment') {
			options.attachmentKeys.splice(index, 1);
			populateList('attachment_filters', options.attachmentKeys, 'attachment');
		}
		
		if(listName === 'author') {
			options.authorKeys.splice(index, 1);
			populateList('author_filters', options.authorKeys, 'author');
		}
		
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
				authorKeys: new Array(),
				messageBodyKeys: new Array(),
				attachmentKeys: new Array()
			};
		}
	}

	function save(options) {
		localStorage['facebookFilterOptions'] = JSON.stringify(options);
	}
};