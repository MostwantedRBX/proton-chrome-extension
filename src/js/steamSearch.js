"use strict";

let buttons = new Map(); // Map with appId as key and row number as value

let searchRows = document.getElementById('search_resultsRows');
for (let i = 0; i < searchRows.children.length; i++) {
    const appId = getId(i);

    // Store the row number in a map with appID as key
    buttons.set(appId, i);
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
    let rows = document.getElementById('search_resultsRows');
    let row = rows.children.item(count);
    let href = row.getAttribute("href");
    if (!href) {
        return -1;
    }

    return href.split("/")[4];
}

// Return the result's row number based on the appId
function getRow(appId) {
    let rows = document.getElementById('search_resultsRows');
    for (let i = 0; i < rows.children.length; i++) {
        let row = rows.children.item(i);
        let href = row.getAttribute("href");
        if (!href) {
            return -1;
        }
        let id = href.split("/")[4];
        if (id === appId) {
            return i;
        }
    }
}

// Create the button and add it to class when result is found
function run(res) {
    const rating = res[0];
    const appId = res[1];
    let row = buttons.get(appId);
    let button = createProtonButton(rating, appId);
    addButtonToClass(button, "responsive_search_name_combined", row);
}

// Shared Functions
// Create a proton button based on a rating and appId
function createProtonButton(rating, appId) {
    //  Create a div.
    let cont = document.createElement("div");
    cont.className = "proton_rating_div proton_rating_search col responsive_secondrow proton_" + rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    let pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link proton_rating_link_search";
    pageLink.href = "https://www.protondb.com/app/" + appId; // Link doesn't work in current result, as steam makes the entire row a link to the store-page
    pageLink.text = rating[0].toUpperCase() + rating.substring(1);
    pageLink.target = "_blank";

    cont.appendChild(pageLink);
    buttons.delete(appId);
    return cont;
}

// Add the html button to a class
function addButtonToClass(button, className, count) {
    //  Get the "Community Hub" button on the steam page and append the new div to the parent of the button.
    let otherSiteButton = document.getElementsByClassName(className)[count];
    if (otherSiteButton) {
        otherSiteButton.append(button);
    }
}

// Add a search result rating to the DOM 
function processItem(item) {
    const appId = item.dataset["dsAppid"];
    buttons.set(appId, getRow(appId));
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
    if (event.srcElement.classList[0] === "search_result_row") {
        // Regular updated rows -- These are the rows that match when the user scrolls downwards
        let newItem = event.srcElement;
        processItem(newItem);
    }
    else if (event.relatedNode != null && event.relatedNode.classList[0] === "search_results") {
        // Page change rows -- These are the rows that match when the user searches for a new term or changes filters
        let result_container = event.relatedNode.children[1];
        if (result_container.id !== "search_result_container") {
            return;
        }

        let all_results = null;
        for (let i = 0; i < result_container.children.length; i++) {
            let child = result_container.children.item(i);
            if (child.id === "search_resultsRows") {
                all_results = child.children;
                break;
            }
        }
        if (all_results == null) {
            return;
        }

        for (let i = 0; i < all_results.length; i++) {
            let result = all_results.item(i);
            processItem(result);
        }
    }
}
