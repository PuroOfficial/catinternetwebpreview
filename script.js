    require('dotenv').config()
    // Initialize Firebase
    var config = {
      apiKey: process.env.APIkey,
      projectId: 'catinternet-catadventure',
      databaseURL: process.env.DBtype
    };
    firebase.initializeApp(config);

// Get a reference to the discussion directory
var discussionRef = firebase.database().ref('discussion');

// Initial Load (Load first 50 posts)
function loadInitialPosts() {
  discussionRef.orderByChild('timestamp').limitToLast(50).on('value', function(data) {
    displayPosts(data);
  });
}

// Load More Button Click Handler
function loadMorePosts() {
  // Get the timestamp of the last post in the current batch
  var lastPostTimestamp = document.querySelector('.post:last-child').dataset.timestamp;

  // Query for posts with timestamps earlier than the last post
  discussionRef.orderByChild('timestamp').endAt(lastPostTimestamp).limitToLast(50).on('value', function(data) {
    displayPosts(data);
  });
}

// Function to display posts
function displayPosts(data) {
  var discussionContainer = document.getElementById('discussion-container');
  discussionContainer.innerHTML = ''; // Clear existing posts

  data.forEach(function(postData) {
    var postHTML = '<div class="post" data-timestamp="' + postData.child('timestamp').val() + '">'; // Add timestamp to post element
    postHTML += '<div class="posttext" style="display: ruby;"><img src="' + getAvatarUrl(postData.child('avatar').val()) + '" width = 50>'; // Avatar
    postHTML += '<h2 class="posttext" style="margin-right:5px ;">' + postData.child('playername').val() + '</h2>'; // Player Name
    postHTML += '<h5 class="posttext">(' + postData.child('username').val() + ')</h5></div>'; // Player Name
    postHTML += '<p class="posttext postcontent">' + postData.child('content').val() + '</p>'; // Content
    // ... (rest of your post HTML)
    postHTML += '</div>';
    discussionContainer.innerHTML += postHTML;
  });
}

// Call the initial load function when the page loads
window.onload = loadInitialPosts;

// Add event listener to the "Load More" button
document.getElementById('load-more-button').addEventListener('click', loadMorePosts);

// Helper function to get the avatar URL
function getAvatarUrl(avatar) {
  if (isNaN(parseInt(avatar))) return '';
  var avatarNumber = parseInt(avatar);
  var avatarDir = 'avatars/cat';
  for (var i = 0; i < 35; i++) {
    var fileExtension = (i + 1).toString().padStart(2, '0') + '.png';
    if (fileExtension === avatarNumber.toString().padStart(2, '0') + '.png') {
      return avatarDir + fileExtension;
    }
  }
}