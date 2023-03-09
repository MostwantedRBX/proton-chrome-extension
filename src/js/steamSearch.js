"use strict";

var rowsByAppId = new Map(); // Map with appId as key and row number as value

// Add ratings to initially loaded DOM
var searchRows = document.getElementById('search_resultsRows');
for (var i = 0; i < searchRows.children.length; i++) {
    var appId = getId(i);

    // Store the row number in a map with appID as key
    rowsByAppId.set(appId, i);
    //  Send app id to the listener in background.js and callback the createProtonButton with the results
    chrome.runtime.sendMessage({
        contentScriptQuery: "queryProtonRating",
        appID: appId
    },
        run
    );
}

// Return the AppID based on the result's row
function getId(count) {
    var rows = document.getElementById('search_resultsRows');
    var row = rows.children.item(count);
    var href = row.getAttribute("href");
    if (!href) {
        return -1;
    }
    var id = href.split("/")[4];
    return id;
}

// Return the result's row number based on the appId
function getRow(appId) {
    var rows = document.getElementById('search_resultsRows');
    for (var i = 0; i < rows.children.length; i++) {
        var row = rows.children.item(i);
        var href = row.getAttribute("href");
        if (!href) {
            return -1;
        }
        var id = href.split("/")[4];
        if (id == appId) {
            return i;
        }
    }
}

// Create the button and add it to class when result is found
function run(res) {
    var rating = res[0];
    var appId = res[1];
    var row = rowsByAppId.get(appId);

    if(row == null)
        row = getRow(appId);
   
    var button = createProtonBadge(rating, appId);
    addButtonToSearch(button, "search_name", row);
}

// Shared Functions
function createProtonBadge(rating, appId){
    //  Create encompassing span element
    var cont = document.createElement("span");
    cont.className = "platform_img platform_proton platform_proton_" + rating.toLowerCase();

    // Add link to the badge
    var pageLink = document.createElement("a");
    pageLink.className = "";
    var protonAppLink = "https://www.protondb.com/app/" + appId;
    pageLink.href = protonAppLink;
    pageLink.title = "Proton Rating: " + rating[0].toUpperCase() + rating.substring(1);
    pageLink.text = rating.toUpperCase();
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    rowsByAppId.delete(appId);
    return cont;
}

// Add rating on search page
function addButtonToSearch(button, className, count) {
    //  Get the "Community Hub" button on the steam page and append the new div to the parent of the button.
    var otherSiteButton = document.getElementsByClassName(className)[count];
    if (otherSiteButton) {
        var parentDiv = otherSiteButton.getElementsByTagName("div")[0]

        // Only add proton rating if none is yet added
        if(parentDiv.getElementsByClassName("platform_proton").length == 0)
            parentDiv.append(button);
    }
}

// Add a search result rating to the DOM 
function processItem(item) {
    var appId = item.dataset["dsAppid"];
    if(appId == null){
        appId = item.dataset.dsBundleid;
    }
    rowsByAppId.set(appId, getRow(appId));
    chrome.runtime.sendMessage({
        contentScriptQuery: "queryProtonRating",
        appID: appId
    },
        run
    );
}

// Events
document.addEventListener('DOMNodeInserted', onPageChange);

// Runs when the DOM gets new nodes
function onPageChange(event) {
    if (event.srcElement == null || event.srcElement.classList == null) {
        return;
    }
    if (event.srcElement.classList[0] == "search_result_row") {
        // Regular updated rows -- These are the rows that match when the user scrolls downwards
        var newItem = event.srcElement;
        processItem(newItem);
    }
    else if (event.relatedNode != null && event.relatedNode.classList[0] == "search_results") {
        // Page change rows -- These are the rows that match when the user searches for a new term or changes filters
        var result_container = event.relatedNode.children[1];
        if (result_container.id != "search_result_container") {
            return;
        }

        var all_results = null;
        for (var i = 0; i < result_container.children.length; i++) {
            var child = result_container.children.item(i);
            if (child.id == "search_resultsRows") {
                all_results = child.children;
                break;
            }
        }
        if (all_results == null) {
            return;
        }

        for (var i = 0; i < all_results.length; i++) {
            var result = all_results.item(i);
            processItem(result);
        }
    }
};
