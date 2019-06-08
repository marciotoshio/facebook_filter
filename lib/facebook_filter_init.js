var facebookFilterOptions = new FacebookFilter.Options();

function sendMessage(message) {
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

function setBadgeText(text) {
  chrome.browserAction.setBadgeText({'text': text});
}

//Badge
chrome.browserAction.setBadgeBackgroundColor({'color': [53,79,130,255]});
setBadgeText('0');

//Context menu
chrome.contextMenus.create({
  'title': chrome.i18n.getMessage('contextMenu'),
  'contexts': ['selection'],
  'documentUrlPatterns': ['http://www.facebook.com/','https://www.facebook.com/'],
  'onclick': function (info) {
    var key = info.selectionText;
    facebookFilterOptions.addKey(key);
    sendMessage({method: 'filterStories', filterKey: key});
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.method === 'getFilterKeys') {
    facebookFilterOptions.checkOldOptions();
    sendResponse(facebookFilterOptions.getOptions().keys);
  } else if (message.method === 'setBadgeText') {
    setBadgeText(message.value.toString());
  } else {
    sendResponse({}); // snub them.
  }
});
