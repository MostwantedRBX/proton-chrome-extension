"use strict";

// Events
let search_contents = document.getElementById("search_suggestion_contents");
search_contents.addEventListener('DOMNodeInserted', onPageChange);

// Runs when the DOM gets new nodes
function onPageChange(event) {
    if (event.target == null || event.target.classList == null) {
        return;
    }
    if (event.target.classList[0] === "match") {
        let newItem = event.target;
        let id = newItem.dataset.dsAppid;
            chrome.runtime.sendMessage({
                contentScriptQuery: "queryProtonRating",
                appID: id
            },
            function(res){
                const rating = res[0];
                const id = res[1];
                let cont = document.createElement("div");
                cont.className = "search_bar_proton_badge proton_" + rating.toLowerCase();

                // Add link to the badge
                let pageLink = document.createElement("a");
                pageLink.className = "";
                pageLink.href = "https://www.protondb.com/app/" + id;
                pageLink.text = rating;
                pageLink.title = "Proton Rating: " + rating[0].toUpperCase() + rating.substring(1);
                pageLink.target = "_blank";
                cont.appendChild(pageLink);

                newItem.getElementsByClassName("match_name")[0].append(cont);
            }
        );
    }
  
}
