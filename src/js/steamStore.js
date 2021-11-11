"use strict";


var id = window.location.href.slice(35).split("/")[0];
var protonAppLink = "https://www.protondb.com/app/" + id;

//  send app id to the listener in background.js > callback the createProtonButton with the results
chrome.runtime.sendMessage({
        contentScriptQuery: "queryProtonRating",
        appID: id }, 
        createProtonButton
        );

function createProtonButton(rating) {
    //  Create a div.

    var cont = document.createElement("div");
    cont.className = "proton_rating_div proton_"+ rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link";
    pageLink.href = protonAppLink;
    pageLink.text = "Proton: " + rating[0].toUpperCase()+rating.substring(1);
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    
    //  Get the "Community Hub" button on the steam page and append the new div to the parent of the button.
    var otherSiteButton = document.getElementsByClassName("apphub_OtherSiteInfo");
    if (otherSiteButton) {
        otherSiteButton[0].append(cont);
    }
}