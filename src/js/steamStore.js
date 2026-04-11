"use strict";

var id = window.location.href.slice(35).split("/")[0];
var protonAppLink = "https://www.protondb.com/app/" + id;

// Check if the app runs natively
var tabs = document.getElementsByClassName("sysreq_tab");
var isNative = checkNative(tabs);

//  Send app id to the listener in background.js and callback the createProtonButton with the results
chrome.runtime.sendMessage({
    contentScriptQuery: "queryProtonRating",
    appID: id
},
    generateProtonBadge
);


// Source - https://stackoverflow.com/a/61511955
// Posted by Yong Wang, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-11, License - CC BY-SA 4.0
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}




function generateProtonBadge(res) {
    var rating = res[0];
    var button = createProtonButton(rating);
    addButtonToClass(button, "apphub_OtherSiteInfo");
}

// Source - https://stackoverflow.com/a/61511955
// Posted by Yong Wang, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-11, License - CC BY-SA 4.0
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function generateDeckBadge(){
   const deck_status_span = await waitForElm(
        "div[data-featuretarget='deck-verified-results'] span"
    );

    const deck_status_text = deck_status_span.textContent?.trim() ?? "";

    const button = createDeckButton(deck_status_text);
    addButtonToClass(button, "apphub_OtherSiteInfo");
}
generateDeckBadge();

//  If app is native, create a button for that too
if (isNative) {
    var nativeButton = createProtonButton("native");
    addButtonToClass(nativeButton, "apphub_OtherSiteInfo");
}

// Check if system requirements tabs include a linux tab
function checkNative(sysreq_tabs) {
    for (let i = 0; i < sysreq_tabs.length; i++) {
        var tab = sysreq_tabs.item(i);
        if (tab.getAttribute("data-os") == "linux") {
            return true;
        }
    }
    return false;
}

// Shared Functions
function createDeckButton(rating) {
    //  Create a div.
    var cont = document.createElement("div");
    cont.className = "proton_rating_div deck_" + rating.toLowerCase();

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link";
    pageLink.href = protonAppLink;
    pageLink.text = "Deck: " + rating[0].toUpperCase() + rating.substring(1);
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    return cont;

}

function createProtonButton(rating) {
    //  Create a div.
    var cont = document.createElement("div");
    cont.className = "proton_rating_div proton_" + rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link";
    pageLink.href = protonAppLink;
    pageLink.text = (rating === "native" ? rating[0].toUpperCase() + rating.substring(1) : "Proton: " + rating[0].toUpperCase() + rating.substring(1));
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    return cont;

}

function addButtonToClass(button, className) {
    //  Get the "Community Hub" button on the steam page and append the new div to the parent of the button.
    var otherSiteButton = document.getElementsByClassName(className);
    if (otherSiteButton) {
        otherSiteButton[0].append(button);
    }
}

