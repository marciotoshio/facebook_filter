var FacebookFilter = FacebookFilter || {};

String.prototype.ff_clean = function() {
	return this.replace(/[\.\?!,;'"]/g, ' ');
}

Array.prototype.ff_removeEmpty = function() {
	return this.filter(function (x) {
		return x != '';
	});
}

String.prototype.ff_contains = function(value) {
	var a1 = this.ff_clean().split(' ').ff_removeEmpty();
	var a2 = value.split(' ');
	for(var i = 0, j = 0; i < a1.length; i++) { 
		if(a1[i].toLowerCase() === a2[j].toLowerCase()) { 
			j++; 
			if(j == a2.length)  return true;
		} else {
			j = 0;
		}
	} 
	return false
}

FacebookFilter.filteredStories = new Array();
FacebookFilter.theOptions = {};

//Start
chrome.extension.sendRequest({method: 'getOptions'}, function(response) {
	FacebookFilter.theOptions = response;
	var root = document.querySelector('#home_stream');
	root.addEventListener('DOMNodeInserted', function() { 
		var stories = document.querySelectorAll('.uiStreamStory');
		for (var i = 0; i < stories.length; i++) {
			if(FacebookFilter.filteredStories.indexOf(stories[i].id) < 0) {
				FacebookFilter.byAuthor(stories[i]);
				FacebookFilter.byMessageBody(stories[i]);
				FacebookFilter.byAttachment(stories[i]);
			}
		}
	});
});

FacebookFilter.byAuthor = function (story) {
	var filterKeys = FacebookFilter.theOptions.authorKeys;
	var contentContainer = story.querySelector('.uiAttachmentDetails a');
	if(contentContainer != null ) {
		var i = filterKeys.indexOf(contentContainer.innerText);
		if(i > -1) {
			FacebookFilter.filter(story, filterKeys[i], ' in author field.');
		}
	}	
}

FacebookFilter.byMessageBody = function (story) {
	var filterKeys = FacebookFilter.theOptions.messageBodyKeys;
	var contentContainer = story.querySelector('.messageBody');
	if(contentContainer != null) {
		for(var i = 0; i < filterKeys.length; i++) {
			if(filterKeys[i] && contentContainer.innerText.ff_contains(filterKeys[i])) {
				FacebookFilter.filter(story, filterKeys[i], ' in message body.');
			}
		}
	}
}

FacebookFilter.byAttachment = function (story) {
	var filterKeys = FacebookFilter.theOptions.attachmentKeys;
	var contentContainerTitle = story.querySelector('.uiAttachmentTitle');
	var contentContainerDesc = story.querySelector('.uiAttachmentDesc');
	if(contentContainerTitle != null && contentContainerDesc != null ) {
		for(var i = 0; i < filterKeys.length; i++) {
			if(filterKeys[i] && (contentContainerTitle.innerText.ff_contains(filterKeys[i]) || contentContainerDesc.innerText.ff_contains(filterKeys[i]))) {
				FacebookFilter.filter(story, filterKeys[i], ' in attachment.');
			}
		}
	}
}

FacebookFilter.filter = function(story, filterKey, filter) {
	FacebookFilter.filteredStories.push(story.id);
	FacebookFilter.hideStory(story, 'none');
	story.appendChild(FacebookFilter.template(story, filterKey, filter));
	chrome.extension.sendRequest({method: 'setBadgeText', value: FacebookFilter.filteredStories.length});
}

FacebookFilter.hideStory = function (story) {
	story.querySelector('.storyHighlightIndicatorWrapper').style.display = 'none';
	story.querySelector('.storyContent').style.display = 'none';
}

FacebookFilter.showStory = function (story) {
	story.querySelector('.storyHighlightIndicatorWrapper').style.display = 'block';
	story.querySelector('.storyContent').style.display = 'block';
	story.querySelector('.facebook-filter').style.display = 'none';
}

FacebookFilter.template = function (story, filterKey, filter) {
	var div = document.createElement('div');
	div.className = 'facebook-filter';
	div.style.textAlign = 'center';
	div.style.padding = '5px';
	div.style.margin = '5px';
	div.style.color = '#aaa';
	div.style.backgroundColor = '#ffd';
	div.style.border = '1px solid #ff3';
	div.innerText = 'This content has been filtered by Facebook Filter becouse it contains: ' + filterKey + filter + ' To view click here.';
	div.onclick = function(sender) {
		FacebookFilter.showStory(story);
	};
	return div;
}