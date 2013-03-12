// TODO:
// Could use Url Filter to do something to IMDB http://developer.chrome.com/extensions/events.html#type-UrlFilter (parse when the dom is loaded)
// Clean up folder structure, and remove unused files
// Sometimes it stops working - the search term doesn't update and the onclick on the" Search TBP for XXX" does nothing
// What happens when you don't have uTorrent installed?
// How to add preferences?? Like, prefer HQ, prefer most recent, exclude XXX, 
// Give the files better names.

function genericOnClick(searchText) {
	var searchUrl = 'http://thepiratebay.se/search/' + encodeURIComponent(searchText) + '/0/7/0'
	chrome.tabs.create({'url': searchUrl}, function(tab) {
	    // Tab opened.
	});
}

function loadMagnetLink(magnetLink){
	chrome.tabs.create({'url': magnetLink}, function(tab) {
		// must be a better way of doing this
		window.setTimeout(function(){chrome.tabs.remove(tab.id)},1000)
	});
}

var parentId = 0;
var lastSearchTerm = '';
var loadingId = 0;
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.directive) {
        case 'page-clicked':
            // execute the content script
            //console.log(request.selectedText);
           	if((request.selectedText.length <= 0)||(lastSearchTerm === request.selectedText)){
           		// don't bother doing anything if they didn't select nothing special
           		return;
           	}
           	lastSearchTerm = request.selectedText;

      			var searchUrl = 'http://thepiratebay.se/search/' + encodeURIComponent(request.selectedText) + '/0/7/0'

      			var xhr = new XMLHttpRequest();
      			xhr.open('GET', searchUrl, true);
      			xhr.onreadystatechange = function() {
      				if (xhr.readyState == 4) {
                // Get rid of the menu item claiming we're loading (because we have a response now)
      					chrome.contextMenus.remove(loadingId);
                var resultTds = $(xhr.responseText).find('a[title="Download this torrent using magnet"]:lt(5)').closest('td');

                // Handle no results from TPB
                if(resultTds.length === 0)  {
                  chrome.contextMenus.create({'title': "TPB a'int got nothing.", 'parentId': parentId, 'contexts':['selection'], 'onclick': $.noop});
                  return;
                }

                // Sweet! We have some results!
      					resultTds.each(function(i, e) { 
      						var description = $(e).find('font.detDesc').text();
      						var sizeExtractionRegex = /.+Size (.+?),.+/i;
      						var size = sizeExtractionRegex.exec(description)[1];
      						var linkName = $(e).find('a.detLink').text();
      						var contextMenuTitle = '(' + size + ') ' + linkName;
      						var magnetUrl = $(e).find('a[title="Download this torrent using magnet"]').attr('href');
      						chrome.contextMenus.create({'title': contextMenuTitle, 'parentId': parentId, 'contexts':['selection'], 'onclick': function() { loadMagnetLink(magnetUrl); }});
      					});
      				}
      			}
      			xhr.send();
            sendResponse({}); // sending back empty response to sender

            var title = "Search TPB for '" + request.selectedText + "'";
            chrome.contextMenus.removeAll(function(){});
            parentId = chrome.contextMenus.create({"title": title, "contexts":["selection"], "onclick": function() { genericOnClick(request.selectedText); }});
            loadingId = chrome.contextMenus.create({'title': 'Loading... try again.', 'parentId': parentId, 'contexts':['selection'], 'onclick': function() { alert("TPB haven't told me what they have yet. Try giving it another click.... NOW!"); }});

            break;
        default:
            // helps debug when request directive doesn't match
            alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
    }
);

chrome.tabs.onUpdated.addListener(function(tab) {
	chrome.tabs.executeScript(tab.id, { // defaults to the current tab
		file: 'contentscript.js', // script to inject into page and run in sandbox
		allFrames: false // When true, this injects script into iframes in the page and doesn't work before 4.0.266.0. We actually don't want this here.
	});

	//console.log('Script injected');
});


chrome.tabs.onCreated.addListener(function(tab) {
	//console.log('tab created');
});

