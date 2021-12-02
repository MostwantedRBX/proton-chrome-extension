"use strict";

var buttons = new Map();
var id = 0;
var rows = document.getElementById('search_resultsRows');
for(var i = 0; i < rows.children.length; i++){
    var appId =getId(i);
    buttons.set(appId, i);
         //  Send app id to the listener in background.js and callback the createProtonButton with the results
    chrome.runtime.sendMessage({
        contentScriptQuery: "queryProtonRating",
        appID: appId }, 
        run
        );
}
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

    
function run(res){   
    var rating = res[0];
    var appId = res[1];
    var button = createProtonButton(rating, appId);
    addButtonToClass(button, "responsive_search_name_combined", buttons.get(appId)); 
}
// Shared Functions
function createProtonButton(rating, appId) {
    //  Create a div.
    var cont = document.createElement("div");
    cont.className = "proton_rating_div proton_rating_search col responsive_secondrow proton_"+ rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link proton_rating_link_search";
    var protonAppLink = "https://www.protondb.com/app/" + appId;

    pageLink.href = protonAppLink;
    
    pageLink.text = "";
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    buttons.delete(appId);
    return cont;
  
}

function addButtonToClass(button, className, count){
      //  Get the "Community Hub" button on the steam page and append the new div to the parent of the button.
      var otherSiteButton = document.getElementsByClassName(className)[count];
      if (otherSiteButton) {
          otherSiteButton.append(button);
      }else{
          console.error("No class found with name " +className + " and id " + count);
      }
}

document.addEventListener('DOMNodeInserted', nodeInsertedCallback);

function nodeInsertedCallback(event) {
    if(event.relatedNode.classList[0] == "search_result_row"){
        console.log(event);
        var newItem = event.relatedNode;
        var appId = newItem.dataset["dsAppid"];
        // newItem.id = appId;
        console.log(newItem.appId)
        
        // buttons.set(appId, appId);
        // console.log("Added " + appId + " to buttons");
    }
};

