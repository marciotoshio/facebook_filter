var root = document.querySelector('#home_stream');
root.addEventListener('DOMNodeInserted', function() { 
	var stories = document.querySelectorAll('.pvm');
	for (var i = 0; i < stories.length; i++) {
		filterByAuthor(stories[i]);
	}
});

function filterByAuthor(story) {
	var filters = ['Some Text to Block', 'Another Text to Block'];
	var author = story.querySelector('.uiAttachmentDetails a');
	if(author != null && filters.indexOf(author.innerText) > -1) {
		story.innerText = "[ FILTERED ]";
	}
}