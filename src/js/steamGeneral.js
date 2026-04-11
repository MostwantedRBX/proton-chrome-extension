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
            function (res) {
                var rating = res[0];
                var id = res[1];

                const cont = createProtonSearchbarRating(rating, id);

                newItem.getElementsByClassName("match_name")[0].append(cont);
            }
        );
    }

};
