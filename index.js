'use strict';

/*
  This script fetches local data and medium posts list.
  converts the data into html element so they can be injected into base HTML.
*/

const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;
const Feed = require('rss-to-json');

const linkDataPath = __dirname + '/data/links.json';
const projectDataPath = __dirname + '/data/projects.json';
const postDataPath = __dirname + '/data/posts.json';
const baseHTMLPath = __dirname + '/source/index.html';
const outputPathPrefix = __dirname + '/dist/';

const linkDOMID = 'sns';
const projectDOMID = 'projects';
const postDOMID = 'posts';

const readBaseHTML = function () {
  var baseHTMLText = fs.readFileSync(baseHTMLPath, 'utf8');
  var baseHTMLDOM = new JSDOM(baseHTMLText);
  return baseHTMLDOM;
}

const readLocalData = function (dataPath) {
  var data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

const buildHTMLWithLocalData = function (dataPath) {
  let htmlToReturn = '';
  const data = readLocalData(dataPath);
  for (const d of data) {
    htmlToReturn += `<a href="${d.link}"> ${d.name} </a>`;
  }
  return htmlToReturn;
}

const buildHTMLWithLocalPostData = function (dataPath) {
  let htmlToReturn = '<ul>';
  const data = readLocalData(dataPath);
  for (const post of data) {
    htmlToReturn += `<li><a href="${post.link}"> ${post.title} </a></li>`;
  }
  htmlToReturn += '</ul>';
  return htmlToReturn;
}


function writeResultHTML () {
  const stream = fs.createWriteStream(outputPathPrefix + 'index.html');
  stream.once('open', function(fd) {
    const baseDOM = readBaseHTML();

    const snsLinks = buildHTMLWithLocalData(linkDataPath);
    const projectLinks = buildHTMLWithLocalData(projectDataPath);
    const postLinks = buildHTMLWithLocalPostData(postDataPath);

    baseDOM.window.document.getElementById(linkDOMID).innerHTML = snsLinks;
    baseDOM.window.document.getElementById(projectDOMID).innerHTML = projectLinks;
    baseDOM.window.document.getElementById(postDOMID).innerHTML = postLinks;

      stream.end(baseDOM.window.document.documentElement.innerHTML);

  })

}

writeResultHTML();