const protonAppLink = "https://www.protondb.com/app/";

createLargeCarouselRatings()

function createLargeProtonButton(rating) {
    //  Create a div.
    var cont = document.createElement("div");
    cont.className = "proton_rating_div proton_" + rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link";
    pageLink.href = protonAppLink;
    pageLink.text = (rating === "native" ? rating[0].toUpperCase() + rating.substring(1) : "Proton: " + rating[0].toUpperCase() + rating.substring(1));
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    return cont;

}

function createLargeCarouselRatings() {
    // I'd like to figure out how to merge both of these and only have one for loop.
    var mainCapItems = document.getElementsByClassName("store_main_capsule");
    var comCapItems = document.getElementsByClassName("community_recommendation_capsule");

    for (let i = 0; i < mainCapItems.length; i++) {
        chrome.runtime.sendMessage({
                contentScriptQuery: "queryProtonRating",
                appID: mainCapItems[i].getAttribute("data-ds-appid")
            },
            (res) => {
                const rating = res[0];
                mainCapItems[i].firstChild.appendChild(createLargeProtonButton(rating))
            }
        );
    }

    for (let i = 0; i < comCapItems.length; i++) {
        chrome.runtime.sendMessage({
                contentScriptQuery: "queryProtonRating",
                appID: comCapItems[i].getAttribute("data-ds-appid")
            },
            (res) => {
                const rating = res[0];
                comCapItems[i].firstChild.appendChild(createLargeProtonButton(rating))
            }
        );
    }

}

