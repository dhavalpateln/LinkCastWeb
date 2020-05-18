document.addEventListener('DOMContentLoaded', function() {
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        // // The Firebase SDK is initialized and available here!
        //
        // firebase.auth().onAuthStateChanged(user => { });
        // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
        // firebase.messaging().requestPermission().then(() => { });
        // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
        //
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

        try {
          let app = firebase.app();
          let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
          //document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
        } catch (e) {
          console.error(e);
          //document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
        }
		
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log(user);
				authSuccessCallback();
			// User is signed in.
			} else {
				window.location = "/login";
			}
		});
		
		document.getElementById("singOutButton").addEventListener('click', function() {firebase.auth().signOut();});
		
		function authSuccessCallback() {
			var linksRef = firebasedb.getUserLinksRef();
			
			// NEW LINK AVAILABLE
			linksRef.on('child_added', function(snapshot) {
				var data = snapshot.val();
				var id = snapshot.key;
				var url = data.url;
				var title = data.title;
				console.log(title + " " + url);
				var listElement = createListElement(id, title, url);
				listElement.id = id;
				var list = document.getElementById('listUL');
				list.insertBefore(listElement, list.childNodes[0]);
			});
			
			// LINK DELETED
			linksRef.on('child_removed', function(snapshot) {
				var data = snapshot.val()
				var id = snapshot.key;
				var url = data.url;
				var title = data.title;
				var element = document.getElementById(id);
				element.parentNode.removeChild(element);
			});
		}

	  function createListElement(id, title, url) {
		var listItem = document.createElement("li");
		listItem.className = "mdc-list-item";
		listItem.data = url;
		var span = document.createElement("span");
		span.className = "mdc-list-item__text";
		span.innerHTML = title;
		
		var buttonContainer = document.createElement("div");
		buttonContainer.className = "listItemButtonContainer";
		
		
		
		var deleteButton = createMDCButton("Delete", "delete");	
		deleteButton.setAttribute("style", "width: 30px; height: 30px;");
		deleteButton.setAttribute("data-id", id);
		deleteButton.addEventListener('click', function(){ firebasedb.removeLink(id);});
		
		var playButton = createMDCButton("Play", "play_arrow");
		playButton.setAttribute("style", "width: 30px; height: 30px; margin-right: 5px;");
		playButton.addEventListener('click', function() {openVideoPlayer(url);});
		
		var openNewButton = createMDCButton("Open Externally", "open_in_new");
		openNewButton.setAttribute("style", "width: 30px; height: 30px; margin-right: 5px;");
		openNewButton.addEventListener('click', function() {window.open(url, "_blank");});
		
		
		buttonContainer.appendChild(playButton);
		buttonContainer.appendChild(openNewButton);
		buttonContainer.appendChild(deleteButton);
		
		listItem.appendChild(span);
		listItem.appendChild(buttonContainer);
		return listItem;
	  }
	  
	  function createMDCButton(arialabel, type) {
		  var mdcButton = document.createElement("button");
		  mdcButton.className = "mdc-fab";
		  mdcButton.setAttribute("aria-label", arialabel);
		  
		  var rippleDIV = document.createElement("div");
		  rippleDIV.className = "mdc-fab__ripple";
		  
		  var span = document.createElement("span");
		  span.className = "mdc-fab__icon material-icons";
		  span.innerHTML = type;
		  
		  mdcButton.appendChild(rippleDIV);
		  mdcButton.appendChild(span);
		  
		  return mdcButton;
	  }
	  
	  function openVideoPlayer(src) {
		  var videoPlayerContainer = document.getElementById("videoContainer");
		  var videoPlayer = document.getElementById("videoPlayer");
		  videoPlayer.setAttribute("src", src);
		  videoPlayerContainer.style.display = 'block';
		  document.getElementById('fade').style.display = 'block';
	  }
	  
	  function closeVideoPlayer() {
		  var videoPlayerContainer = document.getElementById("videoContainer");
		  var videoPlayer = document.getElementById("videoPlayer");
		  //videoPlayer.setAttribute("src", "");
		  videoPlayerContainer.style.display = 'none';
		  document.getElementById('fade').style.display = 'none';
	  }
	  
	  
	  
	  function openExternallyButtonListener(e) {
		  var url = e.srcElement.getAttribute("data-url");
		  window.open(url, "_blank");
	  }
	  
	  window.closeVideoPlayer = closeVideoPlayer;
});