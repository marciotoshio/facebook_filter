var FacebookFilter = FacebookFilter || {};

String.prototype.ff_clean = function() {
	return this.replace(/[\.\?\n!,;'"]/g, ' ');
}

Array.prototype.ff_removeEmpty = function() {
	return this.filter(function (x) {
		return x != '';
	});
}

String.prototype.ff_contains = function(value) {
	var a1 = this.ff_clean().split(' ').ff_removeEmpty();
	var a2 = value.ff_clean().split(' ').ff_removeEmpty();
	for(var i = 0, j = 0; i < a1.length; i++) { 
		if(a1[i].toLowerCase() === a2[j].toLowerCase()) { 
			j++; 
			if(j === a2.length)  return true;
		} else {
			j = 0;
		}
	} 
	return false;
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
			FacebookFilter.doTheJob(stories[i]);
		}
	});
});

FacebookFilter.doTheJob = function (story) {
	if(FacebookFilter.filteredStories.indexOf(story.id) != -1) return;
	
	var filterKeys = FacebookFilter.theOptions.keys;
	for(var i = 0; i < filterKeys.length; i++) {
		FacebookFilter.filter(story, filterKeys[i]);
	}
}

FacebookFilter.filter = function(story, filterKey) {
	var storyText = FacebookFilter.getText(story);
	if(filterKey && storyText && storyText.ff_contains(filterKey)) {
		FacebookFilter.filteredStories.push(story.id);
		FacebookFilter.hideStory(story);
		story.appendChild(FacebookFilter.template(story, filterKey));
		chrome.extension.sendRequest({method: 'setBadgeText', value: FacebookFilter.filteredStories.length});
	}
}

FacebookFilter.getText = function(story) {
	var container = story.querySelector('.mainWrapper');
	var text = container.innerText;
	var frm = container.querySelector('form');
	if(frm) {
		var i = container.innerText.indexOf(frm.innerText);
		text = text.substring(0, i);
	}
	return text;
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

FacebookFilter.template = function (story, filterKey) {
	var div = document.createElement('div');
	div.className = 'facebook-filter';
	div.style.textAlign = 'center';
	div.style.padding = '5px';
	div.style.margin = '5px';
	div.style.color = '#aaa';
	div.style.backgroundColor = '#ffd';
	div.style.border = '1px solid #ff3';
	div.innerText = 'This content has been filtered by Facebook Filter becouse it contains: "' + filterKey + '"  To view click here.';
	div.onclick = function(sender) {
		FacebookFilter.showStory(story);
	};
	return div;
}