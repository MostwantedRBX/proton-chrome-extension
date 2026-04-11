"use strict";

// Events
chrome.storage.sync.get(defaultOptions, (options) => {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }

    if (options.searchPageBadges) {
        document.addEventListener('DOMNodeInserted', onPageChange);

        var searchRows = document.getElementById('search_resultsRows');
        for (var i = 0; i < searchRows.children.length; i++) {
            var appId = getId(i);
            var newItem = searchRows.children.item(i);
            //  Send app id to the listener in background.js and callback the createProtonButton with the results
            chrome.runtime.sendMessage({
                contentScriptQuery: "queryProtonRating",
                appID: appId
            },
                processResult
            );
        }

    }
});



function processResult(res) {
    var rating = res[0];
    var appId = res[1];
    var target = '[data-ds-itemkey="App_' + appId + '"]'
    var targetElement = document.querySelector(target);
    if (targetElement == null) {
        target = '[data-ds-itemkey="Bundle_' + appId + '"]'
        targetElement = document.querySelector(target);
    }

    var button = createProtonButton(rating, appId);
    button.classList.add("proton_rating_search");
    button.classList.add("col");
    button.classList.add("response_secondrow");
    button.firstChild.classList.add("proton_rating_link_search");
    addButtonToElement(button, targetElement, "responsive_search_name_combined");
}

// Return the AppID based on the result's row
function getId(count) {
    var rows = document.getElementById('search_resultsRows');
    var row = rows.children.item(count);
    var id = row.dataset.dsBundleid;
    if (id == null)
        id = row.dataset.dsPackageid;
    if (id == null)
        id = row.dataset.dsAppid;
    return id;
}

// Runs when the DOM gets new nodes
function onPageChange(event) {
    if (event.srcElement == null || event.srcElement.classList == null) {
        return;
    }
    if (event.srcElement.classList[0] == "search_result_row") {
        var newItem = event.srcElement;
        var id = newItem.dataset.dsBundleid;
        if (id == null)
            id = newItem.dataset.dsPackageid;
        if (id == null)
            id = newItem.dataset.dsAppid;

        chrome.runtime.sendMessage({
            contentScriptQuery: "queryProtonRating",
            appID: id
        },
            processResult
        );
    }
};
