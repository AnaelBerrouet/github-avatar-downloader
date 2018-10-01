var request = require('request');
var token = require('./secrets.js')['GITHUB_TOKEN'];
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  let options = {
    url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      Authorization: token
    }
  };

  request(options, function(err, res, body) {

    cb(err, JSON.parse(body));

  });
}

function downloadImageByURL(url, filePath) {

  request.get(url)
  .on('err', function(err){
    console.log("Error:",err);
  })
  .on('response', function(response) {
    console.log("Response status:",response.statusCode);
    if(response.statusCode===200){
      console.log("Downloading from " + url);
    }
  })
  .pipe(fs.createWriteStream(filePath)
    .on('finish', function() {
      console.log("Download", filePath, "complete");
    })
  );
}

//Test the whole system
getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  //create avatar directory if not already available
  fs.stat("avatars", function(err, stat) {
    if(err) {
      console.log("creating directory 'avatars'...");
      fs.mkdir("./avatars/");
    }
  });

  result.forEach(function(element, index) {
    downloadImageByURL(element['avatar_url'], "avatars/" + element['login'] + ".gif");
  });
});


