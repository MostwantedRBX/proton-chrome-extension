"use strict";

const id = window.location.href.slice(35).split("/")[0];
const protonAppLink = "https://www.protondb.com/app/" + id;

// Check if the app runs natively
let tabs = document.getElementsByClassName("sysreq_tab");
let isNative = checkNative(tabs);

//  Send app id to the listener in background.js and callback the createProtonButton with the results
chrome.runtime.sendMessage({
        contentScriptQuery: "queryProtonRating",
        appID: id
    },
    run
);

function run(res) {
    const rating = res[0];
    let button = createProtonButton(rating);
    addButtonToClass(button, "apphub_OtherSiteInfo");
}

//  If app is native, create a button for that too
if (isNative) {
    let nativeButton = createProtonButton("native");
    addButtonToClass(nativeButton, "apphub_OtherSiteInfo");
}

// Check if system requirements tabs include a linux tab
function checkNative(sysreq_tabs) {
    for (let i = 0; i < sysreq_tabs.length; i++) {
        let tab = sysreq_tabs.item(i);
        if (tab.getAttribute("data-os") === "linux") {
            return true;
        }
    }
    return false;
}

// Shared Functions
function createProtonButton(rating) {
    //  Create a div.
    let cont = document.createElement("div");
    cont.className = "proton_rating_div proton_" + rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    let pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link";
    pageLink.href = protonAppLink;
    pageLink.text = (rating === "native" ? rating[0].toUpperCase() + rating.substring(1) : "Proton: " + rating[0].toUpperCase() + rating.substring(1));
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    return cont;

}

function addButtonToClass(button, className) {
    //  Get the "Community Hub" button on the steam page and append the new div to the parent of the button.
    let otherSiteButton = document.getElementsByClassName(className);
    if (otherSiteButton) {
        otherSiteButton[0].append(button);
    }
}

