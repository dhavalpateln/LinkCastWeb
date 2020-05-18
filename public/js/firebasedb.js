(function() {
	var db = firebase.database();
	
	var firebasedb = {};
	
	function getUserLinksRef() {
		var user = firebase.auth().currentUser;
		var uid = user.uid;
		
		return db.ref('userdata/' + uid + '/links');
	}
	
	function removeLink(id) {
		var user = firebase.auth().currentUser;
		var uid = user.uid;
		db.ref('userdata/' + uid + '/links/' + id).remove();
	}
	
	firebasedb.getUserLinksRef = getUserLinksRef;
	firebasedb.removeLink = removeLink;
	
	window.firebasedb = firebasedb;
})();