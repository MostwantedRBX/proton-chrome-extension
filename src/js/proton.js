function createProtonSearchbarRating(rating, id) {
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
    return cont;
}

function createProtonButton(rating, appId=-1) {
    //  Create a div.
    var cont = document.createElement("div");
    cont.className = "proton_rating_div proton_" + rating;

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link";
    pageLink.text = (rating === "native" ? rating[0].toUpperCase() + rating.substring(1) : "Proton: " + rating[0].toUpperCase() + rating.substring(1));
    if(appId != -1){
        pageLink.href = "https://www.protondb.com/app/" + appId; 
    }
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    return cont;
}

function generateProtonBadge(res) {
    var rating = res[0];
    var button = createProtonButton(rating);
    addButtonToClass(button, "apphub_OtherSiteInfo");
}
