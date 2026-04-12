"use strict";

var id = window.location.href.split("/app/")[1].split("/")[0];
var protonAppLink = "https://www.protondb.com/app/" + id;

// Check if the app runs natively
var tabs = document.getElementsByClassName("sysreq_tab");
var isNative = checkNative(tabs);

//  Send app id to the listener in background.js and callback the createProtonButton with the results
chrome.storage.sync.get(defaultOptions, (options) => {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }

    if (options.gamePageBadges) {
        chrome.runtime.sendMessage({
            contentScriptQuery: "queryProtonRating",
            appID: id
        },
            generateProtonBadge
        );

        //  If app is native, create a button for that too
        if (isNative) {
            var nativeButton = createProtonButton("native");
            addButtonToClass(nativeButton, "apphub_OtherSiteInfo");
        }


    }
});

chrome.storage.sync.get(defaultOptions, (options) => {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }

    if (options.deckBadges) {
        generateDeckBadge();

    }
});

