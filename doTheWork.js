// TODO:
// Could use Url Filter to do something to IMDB http://developer.chrome.com/extensions/events.html#type-UrlFilter (parse when the dom is loaded)
// Need a "loading now" child context menu element
// Need a "no results found" element
// Display size of download in context menu items.
// Clean up folder structure, and remove unused files
// Sometimes it stops working - the search term doesn't update and the onclick on the" Search TBP for XXX" does nothing
// 

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

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.directive) {
        case "page-clicked":
            // execute the content script
            console.log(request.selectedText);
           	if((request.selectedText.length <= 0)||(lastSearchTerm === request.selectedText)){
           		// don't bother doing anything if they didn't select nothing special
           		return;
           	}
           	lastSearchTerm = request.selectedText;
			var title = "Search TPB for '" + request.selectedText + "'";
			chrome.contextMenus.removeAll(function(){});
			parentId = chrome.contextMenus.create({"title": title, "contexts":["selection"], "onclick": function() { genericOnClick(request.selectedText); }});

			var searchUrl = 'http://thepiratebay.se/search/' + encodeURIComponent(request.selectedText) + '/0/7/0'

			var xhr = new XMLHttpRequest();
			xhr.open("GET", searchUrl, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					// remember to handle no results
					$(xhr.responseText).find('a[title="Download this torrent using magnet"]:lt(5)').closest('td').each(function(i, e) { 
						//alert(e);
						console.log($(e).find('a.detLink').text());
						console.log($(e).find('a[title="Download this torrent using magnet"]').attr('href'));
						chrome.contextMenus.create({'title': $(e).find('a.detLink').text(), 'parentId': parentId, 'contexts':['selection'], 'onclick': function() { loadMagnetLink($(e).find('a[title="Download this torrent using magnet"]').attr('href')); }});
					});
				}
			}
			xhr.send();

            sendResponse({}); // sending back empty response to sender
            break;
        default:
            // helps debug when request directive doesn't match
            alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
    }
);

chrome.tabs.onUpdated.addListener(function(tab) {
	chrome.tabs.executeScript(tab.id, { // defaults to the current tab
		file: "contentscript.js", // script to inject into page and run in sandbox
		allFrames: false // When true, this injects script into iframes in the page and doesn't work before 4.0.266.0. We actually don't want this here.
	});

	console.log('Script injected');
});


chrome.tabs.onCreated.addListener(function(tab) {
	console.log('tab created');
});
