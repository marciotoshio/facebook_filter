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
	for (var i = 0, j = 0; i < a1.length; i++) {
		if (a1[i].toLowerCase() === a2[j].toLowerCase()) {
			j++;
			if (j === a2.length)  return true;
		} else {
			j = 0;
		}
	}
	return false;
}

var FacebookFilter = FacebookFilter || {};

FacebookFilter.filteredStories = new Array();

FacebookFilter.filterStories = function(filterKey) {
  if (filterKey) {
    var stories = FacebookFilter.getStories();
    for (let story of stories) {
      FacebookFilter.filter(story, filterKey);
    }
  }
}

FacebookFilter.getStories = function() {
	return document.querySelectorAll('.userContentWrapper');
}

FacebookFilter.filterAllKeys = function (story) {
	var filterKeys = FacebookFilter.keys;
	for (let filterKey of filterKeys) {
		FacebookFilter.filter(story, filterKey);
	}
}

FacebookFilter.filter = function(story, filterKey) {
	if (FacebookFilter.filteredStories.indexOf(story.parentNode.id) != -1) return;
	var storyText = FacebookFilter.getText(story);
	if (filterKey && storyText && storyText.ff_contains(filterKey)) {
		FacebookFilter.filteredStories.push(story.parentNode.id);
		FacebookFilter.hideStory(story);
		story.appendChild(FacebookFilter.template(story, filterKey));
		chrome.runtime.sendMessage({method: 'setBadgeText', value: FacebookFilter.filteredStories.length});
	}
}

FacebookFilter.getText = function(story) {
	var contents = story.querySelectorAll('.userContent');
  var text;
  for (let content of contents) {
    if (content.innerText === '') {
      continue;
    } else {
      text = content.innerText;
      var frm = content.querySelector('form');
      if (frm) {
        var i = content.innerText.indexOf(frm.innerText);
        text = text.substring(0, i);
      }
      break;
    }
  }

	return text;
}

FacebookFilter.hideStory = function (story) {
	for (let child of story.children) {
    child.style.display = 'none';
  }
}

FacebookFilter.showStory = function (story) {
  for (let child of story.children) {
    child.style.display = 'block';
  }
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
	div.innerText = chrome.i18n.getMessage('messageToUser', [filterKey]);
	div.onclick = function(sender) {
		FacebookFilter.showStory(story);
	};
	return div;
}

FacebookFilter.start = function(filterKeys) {
  FacebookFilter.keys = filterKeys;
  var root = document.querySelector('#contentArea');
  root.addEventListener('DOMNodeInserted', function() {
    var stories = FacebookFilter.getStories();
    for (let story of stories) {
      FacebookFilter.filterAllKeys(story);
    }
  });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.method === 'filterStories') {
    FacebookFilter.filterStories(message.filterKey);
  } else {
    sendResponse({}); // snub them.
  }
});

// Start
chrome.runtime.sendMessage({method: 'getFilterKeys'}, FacebookFilter.start);
