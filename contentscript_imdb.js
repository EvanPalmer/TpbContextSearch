//debugger;
(function($, undefined){
	window.onload = function(){
		//debugger;
		var thisIsImdb = window.location.href.indexOf('//www.imdb.com/') > 0;
		if(thisIsImdb){
			// debugger;
			// add bootstrap JS from CDN
			$.getScript("//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js", function(){

				var thisIsAMoviePage = window.location.href.indexOf('/title/') > 0;
				if(thisIsAMoviePage){
					var container = $('#prometer_container');
					debugger;
					var searchTerm = $('h1.header').text();

					if(container == undefined || container.length === 0){
						// this is if it's a TV series.
						container = $('#warplink').parent();
						container.css('float', 'right');
						searchTerm = $('h1.header .itemprop').text();
					}

					// make room for the new DDL
					container.css('left', '-10px').children().remove();
					container.tpbSearch({'searchTerm' : searchTerm });
				}

				var thisIsPersonPage = window.location.href.indexOf('/name/') > 0;
				if(thisIsPersonPage){
					var container = $('#prometer_container');

					// make room for the new DDL
					container.css('left', '-10px').children().remove();

					var header = $('h1.header').clone(); 
					header.find('span').remove()

					container.tpbSearch({'searchTerm' : header.text() });
				}

				var thisIsAListPage = window.location.href.indexOf('/list/') > 0;
				if(thisIsAListPage){
					$('.list.detail .list_item .info b').each(function (i, e){
						var currentElement = $(e);
						var container = $('<span>').attr('class', 'list_container').css('float','right');
						currentElement.append(container);
						// make room for the new DDL
						//container.css('left', '-10px').children().remove();

						var header = $('h1.header').clone(); 
						header.find('span').remove()
						container.tpbSearch({'searchTerm' : currentElement.text() });
					});
				}
			});
		};
	};
}(jQuery));



(function($) {
	$.fn.extend({
		tpbSearch : function(options){
			var defaults = { searchTerm: ''};
			var options = $.extend(defaults, options);
			return this.each(function(){
				doSearch($(this), options.searchTerm);
			})
		}

	});

	// private functions
	function doSearch(container, searchTerm){
		// here we should iterate over the container selector, becuase it's possible multiple items will be selected.

		var sanitizedSearchTerm = sanitizeSearchTerm(searchTerm);

		// set the default logo
		var logo = $('<img id="tpb-logo" src="http://thepiratebay.se/static/downloads/preview-cassette.gif">').css('width', '50px').css('height', '50px');

		var searchUrl = 'http://thepiratebay.se/search/' + encodeURIComponent(sanitizedSearchTerm) + '/0/7/0'
		$.get(searchUrl, function(data){
			var resultTds = $(data).find('a[title="Download this torrent using magnet"]:lt(5)').closest('td');

			// Handle no results from TPB
			if(resultTds.length === 0)  {
				container.append(logo).attr('title', 'Sorry, no results on TPB for this one...') 
									  .fadeIn('slow');
				return;
			}

			// Sweet! We have some results!
			logo.attr('src', 'http://thepiratebay.se/static/downloads/preview-tpb-logo.gif');
			buildDropdownList(container, resultTds, sanitizedSearchTerm, logo);

			container.fadeIn('slow');
		});
	}

	function sanitizeSearchTerm(searchTerm){
		return searchTerm.replace(/(\d+ tv series)/ig, '') // get rid of the word TV Series, because most torrents don't have that string in there
					 .replace(/(\d+ documentary)/ig, '') // get rid of the word Documentary, because most torrents don't have that string in there
					 .replace(/[^\s\w\d]+/ig, '') // get rid of weird-ass characters
					 .replace(/\s+/g, ' ') // get rid of excessive spaces
					 .trim(); // keep that shit trim, motherfucker
	}

	function buildDropdownList(container, items, searchTerm, logo){
		// build the bones of the DDL
		container.append($('<ul class="nav nav-pills">')
			.append($('<li class="dropdown">')
				.append($('<a class="dropdown-toggle" data-toggle="dropdown" href="#">').append(logo))
				.append($('<ul class="dropdown-menu">')
					.append($('<li>').append('<a target="_blank" href="http://thepiratebay.se/search/' + encodeURIComponent(searchTerm) + '/0/7/0">Search TPB for "' + searchTerm + '"</a>'))
					.append($('<li class="divider">')))));

		// add all the links for the top 5 magent links
		items.each(function(i, e) { 
			var description = $(e).find('font.detDesc').text();
			var sizeExtractionRegex = /.+Size (.+?),.+/i;
			var size = sizeExtractionRegex.exec(description)[1];
			var linkName = $(e).find('a.detLink').text();
			var contextMenuTitle = '(' + size + ') ' + linkName;
			var magnetUrl = $(e).find('a[title="Download this torrent using magnet"]').attr('href');
			
			container.find('.dropdown-menu').append($('<li>').append($('<a>').attr('href', magnetUrl).append(contextMenuTitle)));
		});
	}

}(jQuery));


// (function($) {
// 	$.fn.tpbSearcher = function(element, options){
// 		debugger;
// 		console.log(element);
// 		this.options = {};

// 		element.data('tpbSearcher', this);

// 		this.init = function(element,options){
// 			this.options = $.extend({}, $.tpbSearcher.defaultOptions, options);
// 			debugger;
// 			// do the search on init
// 		}

// 		// public function
// 		this.doSearch = function(container, searchTerm){
// 			// here we should iterate over the container selector, becuase it's possible multiple items will be selected.

// 			var sanitizedSearchTerm = sanitizeSearchTerm(searchTerm);

// 			// set the default logo
// 			var logo = $('<img id="tpb-logo" src="http://thepiratebay.se/static/downloads/preview-cassette.gif">').css('width', '50px').css('height', '50px');

// 			var searchUrl = 'http://thepiratebay.se/search/' + encodeURIComponent(sanitizedSearchTerm) + '/0/7/0'
// 			$.get(searchUrl, function(data){
// 				var resultTds = $(data).find('a[title="Download this torrent using magnet"]:lt(5)').closest('td');

// 				// Handle no results from TPB
// 				if(resultTds.length === 0)  {
// 					container.append(logo).attr('title', 'Sorry, no results on TPB for this one...') 
// 										  .fadeIn('slow');
// 					return;
// 				}

// 				// Sweet! We have some results!
// 				logo.attr('src', 'http://thepiratebay.se/static/downloads/preview-tpb-logo.gif');
// 				buildDropdownList(container, resultTds, sanitizedSearchTerm, logo);

// 				container.fadeIn('slow');
// 			});
// 		}

// 		// call initialise when instatiated
// 		this.init(element, options);
// 	}

// 	// private functions
// 	function sanitizeSearchTerm(searchTerm){
// 		return searchTerm.replace(/(\d+ tv series)/ig, '') // get rid of the word TV Series, because most torrents don't have that string in there
// 					 .replace(/[^\s\w\d]+/ig, '') // get rid of weird-ass characters
// 					 .replace(/\s+/g, ' ') // get rid of excessive spaces
// 					 .trim(); // keep that shit trim, motherfucker
// 	}

// 	function buildDropdownList(container, items, searchTerm, logo){
// 		// build the bones of the DDL
// 		container.append($('<ul class="nav nav-pills">')
// 			.append($('<li class="dropdown">')
// 				.append($('<a class="dropdown-toggle" data-toggle="dropdown" href="#">').append(logo))
// 				.append($('<ul class="dropdown-menu">')
// 					.append($('<li>').append('<a target="_blank" href="http://thepiratebay.se/search/' + encodeURIComponent(searchTerm) + '/0/7/0">Search TPB for "' + searchTerm + '"</a>'))
// 					.append($('<li class="divider">')))));

// 		// add all the links for the top 5 magent links
// 		items.each(function(i, e) { 
// 			var description = $(e).find('font.detDesc').text();
// 			var sizeExtractionRegex = /.+Size (.+?),.+/i;
// 			var size = sizeExtractionRegex.exec(description)[1];
// 			var linkName = $(e).find('a.detLink').text();
// 			var contextMenuTitle = '(' + size + ') ' + linkName;
// 			var magnetUrl = $(e).find('a[title="Download this torrent using magnet"]').attr('href');
			
// 			container.find('.dropdown-menu').append($('<li>').append($('<a>').attr('href', magnetUrl).append(contextMenuTitle)));
// 		});
// 	}

// 	// set default options
// 	$.fn.tpbSearcher.defaultOptions = {
// 		class: 'tpbSearcher',
// 		searchTerm: ''
// 	}
// }(jQuery));
