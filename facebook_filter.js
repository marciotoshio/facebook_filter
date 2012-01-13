var root = document.querySelector('#home_stream');
root.addEventListener('DOMNodeInserted', function() { 
	var authors = document.querySelectorAll('.uiAttachmentDetails a');
	for (var i = 0; i < authors.length; i++) {
		authors[i].innerText = '[ changed ]';
	}
});