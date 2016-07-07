// ==UserScript==
// @name        SpiegelPlus Decryptor
// @namespace   www.spiegel.de
// @version     1.0
// @description spiegelplus decryptor
// @include     http://www.spiegel.de/*
// @grant       none
// ==/UserScript==

// remove blurring
var obfDiv = document.getElementsByClassName('obfuscated-content');
obfDiv[0].setAttribute('style', 'filter: blur(0px) !important; opacity: 1 !important; -webkit-filter: blur(0px) !important; -webkit-filter: url() !important');

// "decrypt" all paragraphs
var obfs = document.getElementsByClassName('obfuscated');
for (i = 0; i < obfs.length; i++) {
 // iterate over all characters inside the current paragraph tag
 // normal text except spaces is "encrypted" by incrementing the unicode numbers by 1
 // HTML tags like <b> are excluded from the encryption, the text inside them is not
 // anchor tags <a href=...>...</a> are complete excluded from theencryption
 // TODO: http://xkcd.com/208/ !


 letters = obfs[i].innerHTML.split('');
 var insideTag = false; // are we currently inside an HTML tag?
 var tagOpen = false; // is a tag like <b> ... </b> currently active?
 var isAnchorTag = false; // are we inside an anchor tag?
 var lastLT = 0; // index of last occurence of less-than sign
 for (l = 0; l < letters.length; l++) {
   if (letters[l] == '<') {
     insideTag = true;
     lastLT = l;
     // bound checks are for sissies.
     isAnchorTag = letters[l + 1] == 'a';
     if (letters[l + 1] != '/') {
       tagOpen = true;
     }
   } else if (letters[l] == '>') {
     insideTag = false;
     if (letters[lastLT + 1] == '/') {
       tagOpen = false;
     }
   } else if (letters[l] != ' ' && !insideTag) {
     if (!isAnchorTag) {
       // decrypt by decrementing every non-space character that is not inside an active HTML tag
       letters[l] = String.fromCharCode(letters[l].charCodeAt(0) - 1);
     }
   }
 }
 obfs[i].innerHTML = letters.join('');
}
