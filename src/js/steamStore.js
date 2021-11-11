"use strict";


var id = window.location.href.slice(35).split("/")[0];
var protonAppLink = "https://www.protondb.com/app/" + id;


chrome.runtime.sendMessage(
    {
        contentScriptQuery: "queryProtonRating",
        appID: id
    },
    createProtonButton
);


function createProtonButton(rating) {

    var cont = document.createElement("div");
    cont.className = "proton_rating_div proton_"+ rating;

    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link";
    pageLink.href = protonAppLink;
    pageLink.text = "Proton: " + rating[0].toUpperCase()+rating.substring(1);
    pageLink.target = "_blank";
    cont.appendChild(pageLink);

    var otherSiteButton = document.getElementsByClassName("apphub_OtherSiteInfo");
    if (otherSiteButton) {
        otherSiteButton[0].append(cont);
    } else {
        console.log("Cannot select other site button")
    }
    
}