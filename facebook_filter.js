var root = document.querySelector('#home_stream');
root.addEventListener('DOMNodeInserted', function() { 
	var stories = document.querySelectorAll('.pvm');
	for (var i = 0; i < stories.length; i++) {
		filterByAuthor(stories[i]);
	}
});

var filteredStories = new Array();

function filterByAuthor(story) {
	var filters = ['Altas Risadas'];
	var author = story.querySelector('.uiAttachmentDetails a');
	if(author != null && filters.indexOf(author.innerText) > -1 && filteredStories.indexOf(story.id) < 0) {
		filteredStories.push(story.id);
		story.querySelector('.storyHighlightIndicatorWrapper').style.display = 'none';
		story.querySelector('.storyContent').style.display = 'none';
		story.appendChild(filteredTemplate());
	}
}

function filteredTemplate() {
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	div.style.padding = '5px';
	div.style.margin = '5px';
	div.style.backgroundColor = '#FAA';
	div.style.border = '1px solid #F00';
	div.innerText = 'This content has been filtered by FacebookFilter';
	return div;
}