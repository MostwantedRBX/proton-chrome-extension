"use strict";

// Events
var search_contents = document.getElementById("search_suggestion_contents");
search_contents.addEventListener('DOMNodeInserted', onPageChange);

// Runs when the DOM gets new nodes
function onPageChange(event) {
    if (event.srcElement == null || event.srcElement.classList == null) {
        return;
    }
    if (event.srcElement.classList[0] == "match") {
        var newItem = event.srcElement;
        var id = newItem.dataset.dsAppid;
            chrome.runtime.sendMessage({
                contentScriptQuery: "queryProtonRating",
                appID: id
            },
            function(res){
                var rating = res[0];
                var id = res[1];
                var cont = document.createElement("div");
                var badge_classes = "search_bar_proton_badge proton_" + rating.toLowerCase();
                cont.className = badge_classes;

                // Add link to the badge
                var pageLink = document.createElement("a");
                pageLink.className = "";
                var protonAppLink = "https://www.protondb.com/app/" + id;
                pageLink.href = protonAppLink;
                pageLink.text = rating;
                pageLink.title = "Proton Rating: " + rating[0].toUpperCase() + rating.substring(1);
                pageLink.target = "_blank";
                cont.appendChild(pageLink);

                newItem.getElementsByClassName("match_name")[0].append(cont);
            }
        );
    }
  
};
