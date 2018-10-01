var request = require('request');
var token = require('./secrets.js')['GITHUB_TOKEN'];
var fs = require('fs');

function getRepoContributors(repoOwner, repoName, cb) {

  let options = {
    url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'AnaelBerrouet',
      'Authorization': 'token ' + token
    }
  };
  console.log("requesting from",options.url);
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

//MAIN
var args = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

if(!args[0] || !args[1]) {
  console.log("Please enter valid arguments: <repo-owner> <repo>");
  process.exit();
}

  //create avatar directory if not already available
  try {
    fs.statSync("avatars");
  } catch(err) {
      console.log("creating directory 'avatars'...");
      fs.mkdir("./avatars/");
  }


getRepoContributors(args[0], args[0], function(err, result) {
  console.log("Errors:", err);


  result.forEach(function(element, index) {
    downloadImageByURL(element['avatar_url'], "avatars/" + element['login'] + ".gif");

    // console.log(`Contributor: ${index}`, element['avatar_url']);
  });
});


