

// function loadScript(url, callback)
// {
//     // adding the script tag to the head
//    var head = document.getElementsByTagName('head')[0];
//    var script = document.createElement('script');
//    script.type = 'text/javascript';
//    script.src = url;

//    // then bind the event to the callback function 
//    // there are several events for cross browser compatibility
//    script.onreadystatechange = callback;
//    script.onload = callback;

//    // fire the loading
//    head.appendChild(script);
// }

// function captureSelections()
// {
// 	if($ == undefined) // jquery a'int loaded yet
// 	{
// 		window.setTimeout(captureSelections,1000); // wait a bit and see if it's loaded again
// 	}else{
// 		alert('script loaded: ');
// 		alert($);
// 		$('html').unbind('click.searchTpb');
// 		$('html').bind('click.searchTpb', function(e){ alert(window.getSelection()); });
// 	}
// }

// if($ == undefined)
// {
// 	loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', captureSelections);
// } else {
// 	captureSelections();
// }

window.onmouseup = function(e){ 
	var x = window.getSelection().toString();
	chrome.extension.sendMessage({directive: "page-clicked", selectedText: x}, function(response) {
        // this.close(); 
		// alert('Just sent: ' + x);
    });
};