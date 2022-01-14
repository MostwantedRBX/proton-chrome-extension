"use strict";

var buttons = new Map(); // Map with appId as key and row number as value

var searchRows = document.getElementById('search_resultsRows');
for(var i = 0; i < searchRows.children.length; i++){
    var appId =getId(i);

    // Store the row number in a map with appID as key
    buttons.set(appId, i);
    //  Send app id to the listener in background.js and callback the createProtonButton with the results
    chrome.runtime.sendMessage({
        contentScriptQuery: "queryProtonRating",
        appID: appId }, 
        run
        );
}

// Return the AppID based on the result's row
function getId(count){
        var rows = document.getElementById('search_resultsRows');
        var row = rows.children.item(count);
        var href = row.getAttribute("href");
        if(!href){
            return -1;
        }
        var id = href.split("/")[4];
        return id;
}

// Return the result's row number based on the appId
function getRow(appId){
    var rows = document.getElementById('search_resultsRows');
    for(var i = 0; i < rows.children.length; i++){
        var row = rows.children.item(i);
        var href = row.getAttribute("href");
        if(!href){
            return -1;
        }
        var id = href.split("/")[4];
        if(id == appId){
            return i;
        }
    }
}
    
// Create the button and add it to class when result is found
function run(res){   
    var rating = res[0];
    var appId = res[1];
    var row = buttons.get(appId);
    var button = createProtonButton(rating, appId);
    addButtonToClass(button, "responsive_search_name_combined", row); 
}

// Shared Functions
// Create a proton button based on a rating and appId
function createProtonButton(rating, appId) {
    //  Create a div.
    var cont = document.createElement("div");
    cont.className = "proton_rating_div proton_rating_search col responsive_secondrow proton_"+ rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link proton_rating_link_search";
    var protonAppLink = "https://www.protondb.com/app/" + appId; // Link doesn't work in current result, as steam makes the entire row a link to the store-page

    pageLink.href = protonAppLink;
    
    pageLink.text = rating[0].toUpperCase() + rating.substring(1);
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    buttons.delete(appId);
    return cont;
  
}

// Add the html butto to a class
function addButtonToClass(button, className, count){
      //  Get the "Community Hub" button on the steam page and append the new div to the parent of the button.
      var otherSiteButton = document.getElementsByClassName(className)[count];
      if (otherSiteButton) {
          otherSiteButton.append(button);
      }else{
          console.error("Failed to find result row");
      }
}

document.addEventListener('DOMNodeInserted', onPageChange);

function onPageChange(event) {
    if(event.srcElement == null || event.srcElement.classList == null){
        return;
    }
    if(event.srcElement.classList[0] == "search_result_row"){
        var newItem = event.srcElement;
        var appId = newItem.dataset["dsAppid"];
        
        buttons.set(appId, getRow(appId));
        chrome.runtime.sendMessage({
            contentScriptQuery: "queryProtonRating",
            appID: appId }, 
            run
            );
    }
};

