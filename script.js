    require('dotenv').config()
    // Initialize Firebase
    var config = {
      apiKey: process.env.APIkey,
      projectId: process.env.ProID,
      databaseURL: process.env.DBtype
    };
    firebase.initializeApp(config);

    // Get a reference to the discussion directory
    var discussionRef = firebase.database().ref('discussion');

    // Listen for changes in the discussion directory
    discussionRef.on('value', function(data) {
      var discussionContainer = document.getElementById('discussion-container');
      discussionContainer.innerHTML = '';

      data.forEach(function(postData) {
        var postHTML = '<div class="post">';
        postHTML += '<div style="display: ruby;"><img src="' + getAvatarUrl(postData.child('avatar').val()) + '" width = 50>'; // Avatar
        postHTML += '<h2 style="margin-right:5px ;">' + postData.child('playername').val() + '</h2>'; // Player Name
        postHTML += '<h5>(' + postData.child('username').val() + ')</h5></div>'; // Player Name
        postHTML += '<p>' + postData.child('content').val() + '</p>'; // Content
        if (postData.child('pin').val()) {
          postHTML += '<span class="pin">Pin</span>';
        }
        if (postData.hasChild('reply')) {
          var replyHTML = '<div class="reply">';
          replyHTML += '<h3><b>Replying to: </b>' + postData.child('reply').val() + '</h3>'; // Reply Username
          replyHTML += '</div>';
          postHTML += replyHTML;
        }
        if (postData.hasChild('youtubeconnection')) {
          var youtubeHTML = '<a href="' + postData.child('youtubeconnection').val() + '"><img src="youtube.png" width=50></a>';
          postHTML += youtubeHTML;
        }
        postHTML += '</div>';
        discussionContainer.innerHTML += postHTML;
      });
    });

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