//
// popup.js
//
// v1.8
//
// Cyril Weller
// forgetthatpage@protonmail.com
//
// GNU GPLv3 license
//
//
// Special thanks to mubaidr (https://github.com/mubaidr)
// and TUrabbIT (https://github.com/TUrabbIT)


var pageCookies;
var pageLocalStorage;
var pageSessionStorage;
var pageDownloads;
var pageDeleteHost;

chrome.storage.local.get({
	cookies: true,
	localStorage: true,
	sessionStorage: true,
	pageDownloads: true,
  deleteHost: false
	}, function(items) {
	pageCookies = items.cookies ;
	pageLocalStorage  = items.localStorage ;
	pageSessionStorage = items.sessionStorage ;
	pageDownloads = items.downloads ;
  pageDeleteHost = items.deleteHost ;
});

// forgetOnlyPage
// Forgets just the current page
function forgetOnlyPage(tab){

    var current = tab.url;

  	/******************/
  	/* DELETE HISTORY */
  	/******************/
    chrome.history.deleteUrl({

     url: current

     }, function(){

  				/************************************/
  				/* DELETE SESSION AND LOCAL STORAGE */
  				/************************************/

  				// For http/https urlif option value is true
  				if (current.indexOf("http") !== -1) {
  					if (pageSessionStorage) {
  						// Alert for testing
  						//alert("delete sessionStorage");
  						chrome.tabs.executeScript(tab.id, {code: 'sessionStorage.clear()'});
  					}

  					// Delete local storage for current url if option value is true
  					if (pageLocalStorage) {
  						// Alert for testing
  						//alert("delete localStorage");
  						chrome.tabs.executeScript(tab.id, {code: 'localStorage.clear()'});
  					}
  				}

  				/********************/
  				/* DELETE DOWNLOADS */
  				/********************/

  				//alert(pageDownloads);
  				if (pageDownloads) {

  					// Erase downloads for current url
  					chrome.downloads.erase({
  						url: current
  					});
  				}

  				/******************/
  				/* DELETE COOKIES */
  				/******************/

  				// Delete cookies if option value is true
  				if (pageCookies){

  					// Alert for testing
  					//alert("delete cookies");

  					// Get all cookies for current url
  					chrome.cookies.getAll({

  						url: current

  						}, function(cookies) {

  						// For every cookie in the cookie list
  						for (i = 0; i < cookies.length; i++) {

  							// Remove the cookie
  							chrome.cookies.remove({

  								url: current,
  								name: cookies[i].name

  							});
  						}

  					});
  				}

  				/*******************/
  				/* DISPLAY MESSAGE */
  				/*******************/

  				// Get navigator language
  				var userLang = navigator.language || navigator.userLanguage;

  				// If language is persian, arabic or hebrew,
  				// font-size is 11pt to be more readable
  				if (userLang == 'ar' || userLang == 'fa' || userLang == 'he') {
  					document.getElementById("returnText").setAttribute('style','font-size:11pt');
  				}

  				// Get message for browser locale
  				var message = chrome.i18n.getMessage("websiteDeletedOK");

  				// Display message
  				document.getElementById("returnText").innerHTML = message;

  				// Change icon to really see it's ok
  				chrome.browserAction.setIcon({ path:"img/icon/swipe_done128.png" });

  				// After 1.5 seconds, the popup closes itself
  				setTimeout(function(){ window.close() },1500);

  			});

  }

// forgetAllFromHost
// Forgets all pages for same host
function forgetAllFromHost(tab,curUrl){

  var current = tab.url;

	/******************/
	/* DELETE HISTORY */
	/******************/

	// Search in history for that url. Getting all HistoryItems for tab.url and those building up on it.
	chrome.history.search({text: curUrl}, function(hist){

		//deleting history, session etc. for each url.
		for (i = 0; i < hist.length; i++) {

			var current = hist[i].url
			chrome.history.deleteUrl({

				url: current

				}, function(){

				/************************************/
				/* DELETE SESSION AND LOCAL STORAGE */
				/************************************/

				// For http/https urlif option value is true
				if (current.indexOf("http") !== -1) {
					if (pageSessionStorage) {
						// Alert for testing
						//alert("delete sessionStorage");
						chrome.tabs.executeScript(tab.id, {code: 'sessionStorage.clear()'});
					}

					// Delete local storage for current url if option value is true
					if (pageLocalStorage) {
						// Alert for testing
						//alert("delete localStorage");
						chrome.tabs.executeScript(tab.id, {code: 'localStorage.clear()'});
					}
				}

				/********************/
				/* DELETE DOWNLOADS */
				/********************/

				//alert(pageDownloads);
				if (pageDownloads) {

					// Erase downloads for current url
					chrome.downloads.erase({
						url: current
					});
				}

				/******************/
				/* DELETE COOKIES */
				/******************/

				// Delete cookies if option value is true
				if (pageCookies){

					// Alert for testing
					//alert("delete cookies");

					// Get all cookies for current url
					chrome.cookies.getAll({

						url: current

						}, function(cookies) {

						// For every cookie in the cookie list
						for (i = 0; i < cookies.length; i++) {

							// Remove the cookie
							chrome.cookies.remove({

								url: current,
								name: cookies[i].name

							});
						}

					});
				}

				/*******************/
				/* DISPLAY MESSAGE */
				/*******************/

				// Get navigator language
				var userLang = navigator.language || navigator.userLanguage;

				// If language is persian, arabic or hebrew,
				// font-size is 11pt to be more readable
				if (userLang == 'ar' || userLang == 'fa' || userLang == 'he') {
					document.getElementById("returnText").setAttribute('style','font-size:11pt');
				}

				// Get message for browser locale
				var message = chrome.i18n.getMessage("websiteDeletedOK");

				// Display message
				document.getElementById("returnText").innerHTML = message;

				// Change icon to really see it's ok
				chrome.browserAction.setIcon({ path:"img/icon/swipe_done128.png" });

				// After 1.5 seconds, the popup closes itself
				setTimeout(function(){ window.close() },1500);

			});

		}})

}

// Main program
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

  	var curUrl = tabs[0].url;

    if (pageDeleteHost){
      var url = curUrl;
      var arr = url.split("/");
      curUrl = arr[0] + "//" + arr[2];
      forgetAllFromHost(tabs[0],curUrl);
    }

    forgetOnlyPage(tabs[0]);

});
