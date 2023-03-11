"use strict";

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

function processResult(res){
    var rating = res[0];
    var appId = res[1];
    var target = '[data-ds-itemkey="App_' + appId + '"]'
    var targetElement = document.querySelector(target);
    if(targetElement == null){
        target = '[data-ds-itemkey="Bundle_' + appId + '"]'
        targetElement = document.querySelector(target);
    }

    var button = createProtonButton(rating, appId);
    addButtonToElement(button, targetElement, "responsive_search_name_combined");
}

// Return the AppID based on the result's row
function getId(count) {
    var rows = document.getElementById('search_resultsRows');
    var row = rows.children.item(count);
    var id = row.dataset.dsBundleid;
    if(id == null)
        id = row.dataset.dsPackageid;
    if (id== null)
        id = row.dataset.dsAppid;
    return id;
}


// Shared Functions
// Create a proton button based on a rating and appId
function createProtonButton(rating, appId) {
    //  Create a div.
    var cont = document.createElement("div");
    cont.className = "proton_rating_div proton_rating_search col responsive_secondrow proton_" + rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link proton_rating_link_search";
    var protonAppLink = "https://www.protondb.com/app/" + appId; // Link doesn't work in current result, as steam makes the entire row a link to the store-page
    pageLink.href = protonAppLink;
    pageLink.text = rating[0].toUpperCase() + rating.substring(1);
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    return cont;

}

// Add the html button to a class
function addButtonToElement(button, element, className) {
    var parentElement = element.getElementsByClassName(className)[0];
    if(parentElement){
        parentElement.append(button);
    }
}

// Events
document.addEventListener('DOMNodeInserted', onPageChange);

// Runs when the DOM gets new nodes
function onPageChange(event) {
    if (event.srcElement == null || event.srcElement.classList == null) {
        return;
    }
    if (event.srcElement.classList[0] == "search_result_row") {
        var newItem = event.srcElement;
        var id = newItem.dataset.dsBundleid;
        if(id == null)
            id = newItem.dataset.dsPackageid;
        if (id== null)
            id = newItem.dataset.dsAppid;

            chrome.runtime.sendMessage({
                contentScriptQuery: "queryProtonRating",
                appID: id
            },
            processResult
        );
    }
};
