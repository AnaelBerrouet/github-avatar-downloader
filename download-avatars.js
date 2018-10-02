var request = require('request');
// var token = require('./secrets.js')['GITHUB_TOKEN'];
var fs = require('fs');

const env = require('dotenv').config();

//Async function to generate HTTP request to github api in order to obtain a list of contributors to a provided repo
function getRepoContributors(repoOwner, repoName, cb) {

  let options = {
    url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': USERNAME,
      'Authorization': 'token ' + TOKEN
    }
  };

  console.log("Requesting contributors from", options.url, "as '", USERNAME,"'");

  request(options, function(err, res, body) {
    if(err) {
      console.log("Request Connection Error:",err);
    }
    if(res.statusCode === 200) {
      cb(err, JSON.parse(body));
    } else {
      console.log("Status:",res.statusCode,":",JSON.parse(body).message);
      console.log("~ Request Failed - please check credentials, api rate limts, and repoOwner/repo inputs");
    }
  });
}

//
function downloadImageByURL(url, filePath) {

  request.get(url)
  .on('err', function(err){
    console.log("Error:",err);
  })
  .on('response', function(res) {
    if(res.statusCode === 200){
      console.log("Downloading from " + url);
    } else {
      console.log("Status:",res.statusCode,":",JSON.parse(res.body).message);
      console.log("\nFailed to download from", url);
    }
  })
  .pipe(fs.createWriteStream(filePath)
    .on('finish', function() {
      console.log("Download", filePath, "complete");
    })
  );
}

//MAIN ------------------------------------------------------------
var args = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

if(!args[0] || !args[1] || args.length > 2)  {
  console.log("Please enter only valid arguments:\n e.g. --> node download-avatars.js <repo-owner> <repo>");
  process.exit();
}

//Check the env conditions------------------------------------------
let USERNAME = "";
let TOKEN = "";

//Check if error in dotenv variable retrieval
if (env.error) {
  console.log("WARNING: No '.env' file located. Proceeding with default credentials");
}

//If .env does not exist OR either of the env variables is not set - use defaults which will create request with rate limit of 50
try {
  USERNAME = env.parsed['USERNAME'];
  TOKEN = env.parsed['GITHUB_TOKEN'];
} catch(e) {
  USERNAME = "request";
  TOKEN = "";
}

//Check if avatar directory is not already available----------------
try {
  fs.statSync("avatars");
} catch(err) {
    console.log("creating directory 'avatars'...");
    fs.mkdir("./avatars/");
}

//Try and get REPO contributors and save avatars--------------------
getRepoContributors(args[0], args[1], function(err, result) {

  if(err) {
    console.log("Errors:", err);
  }

  result.forEach(function(element, index) {
    downloadImageByURL(element['avatar_url'], "avatars/" + element['login'] + ".gif");

    // console.log(`Contributor: ${index}`, element['avatar_url']);
  });
});


