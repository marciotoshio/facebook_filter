var FacebookFilter = FacebookFilter || {};
FacebookFilter.Options = FacebookFilter.Options || {};

String.prototype.containsExactly = function(value) {
	var a1 = this.split(' ');
	var a2 = value.split(' ');
	for(var i = 0, j = 0; i < a1.length; i++) { 
		if(a1[i] === a2[j]) { 
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
		var stories = document.querySelectorAll('.pvm');
		for (var i = 0; i < stories.length; i++) {
			if(FacebookFilter.filteredStories.indexOf(stories[i].id) < 0) {
				FacebookFilter.byAuthor(stories[i]);
				FacebookFilter.byMessageBody(stories[i]);
			}
		}
	});
});

FacebookFilter.byAuthor = function (story) {
	var filterKeys = FacebookFilter.theOptions.authorKeys;
	var contentContainer = story.querySelector('.uiAttachmentDetails a');
	if(contentContainer != null && filterKeys.indexOf(contentContainer.innerText) > -1) {
		FacebookFilter.filter(story)
	}
}

FacebookFilter.byMessageBody = function (story) {
	var filterKeys = FacebookFilter.theOptions.messageBodyKeys;
	var contentContainer = story.querySelector('.messageBody');
	if(contentContainer != null) {
		for(var i = 0; i < filterKeys.length; i++) {
			if(contentContainer.innerText.containsExactly(filterKeys[i])) {
				FacebookFilter.filter(story)
			}
		}
	}
}

FacebookFilter.filter = function(story) {
	FacebookFilter.filteredStories.push(story.id);
	FacebookFilter.hideStory(story, 'none');
	story.appendChild(FacebookFilter.template(story));
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

FacebookFilter.template = function (story) {
	var div = document.createElement('div');
	div.className = 'facebook-filter';
	div.style.textAlign = 'center';
	div.style.padding = '5px';
	div.style.margin = '5px';
	div.style.color = '#aaa';
	div.style.backgroundColor = '#ffd';
	div.style.border = '1px solid #ff3';
	div.innerText = 'This content has been filtered by Facebook Filter. To view click here.';
	div.onclick = function(sender) {
		FacebookFilter.showStory(story);
	};
	return div;
}