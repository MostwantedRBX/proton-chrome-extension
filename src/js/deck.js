function createDeckButton(rating) {
    //  Create a div.
    var cont = document.createElement("div");
    cont.className = "proton_rating_div deck_" + rating.toLowerCase();

    //  Create an anchor link, set the href to the protondb page, add it to the container div.
    var pageLink = document.createElement("a");
    pageLink.className = "proton_rating_link";
    pageLink.href = protonAppLink;
    pageLink.text = "Deck: " + rating[0].toUpperCase() + rating.substring(1);
    pageLink.target = "_blank";
    cont.appendChild(pageLink);
    return cont;

}


async function generateDeckBadge(){
   const deck_status_span = await waitForElm(
        "div[data-featuretarget='deck-verified-results'] span"
    );

    const deck_status_text = deck_status_span.textContent?.trim() ?? "";

    const button = createDeckButton(deck_status_text);
    addButtonToClass(button, "apphub_OtherSiteInfo");
}