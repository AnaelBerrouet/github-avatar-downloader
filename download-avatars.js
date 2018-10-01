var request = require('request');
var token = require('./secrets.js')['GITHUB_TOKEN'];

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

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(element, index) {
    console.log(`Contributor: ${index}`, element);
  });

});


// const fs = require('fs');
// const request = require('request');

// const URL = 'https://sytantris.github.io/http-examples/future.jpg';

// request.get(URL)
//   .on('err', function(err) {
//     console.log(err);
//   })
//   .on('response', function(response) {
//     console.log("Response status:",response.statusCode);
//     if(response.statusCode===200){
//       console.log("Downloading...");
//     }
//   })
//   .pipe(fs.createWriteStream('./future.jpg')
//     .on('finish', function() {
//     console.log("Download complete.");
//   }));