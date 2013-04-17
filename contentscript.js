(function(){
	window.onload = function(){

		window.onmouseup = function(e){ 
			var x = window.getSelection().toString();
			chrome.extension.sendMessage({directive: "page-clicked", selectedText: x}, function(response) {
		        // this.close(); 
				// alert('Just sent: ' + x);
		    });
		};
	};
}());


