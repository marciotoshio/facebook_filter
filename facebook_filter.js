var FacebookFilter = FacebookFilter || {};
FacebookFilter.Options = FacebookFilter.Options || {};

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
			}
		}
	});
});

FacebookFilter.byAuthor = function (story) {
	var filtersKeys = FacebookFilter.theOptions.authorKeys;
	var contentContainer = story.querySelector('.uiAttachmentDetails a');
	if(contentContainer != null && filtersKeys.indexOf(contentContainer.innerText) > -1) {
		FacebookFilter.filter(story)
	}
}

FacebookFilter.filter = function(story) {
	FacebookFilter.filteredStories.push(story.id);
	story.querySelector('.storyHighlightIndicatorWrapper').style.display = 'none';
	story.querySelector('.storyContent').style.display = 'none';
	story.appendChild(FacebookFilter.template());
	chrome.extension.sendRequest({method: 'setBadgeText', value: FacebookFilter.filteredStories.length});
}

FacebookFilter.template = function () {
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	div.style.padding = '5px';
	div.style.margin = '5px';
	div.style.backgroundColor = '#FAA';
	div.style.border = '1px solid #F00';
	div.innerText = 'This content has been filtered by FacebookFilter';
	return div;
}