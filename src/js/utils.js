"use strict";

// Source - https://stackoverflow.com/a/61511955
// Posted by Yong Wang, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-11, License - CC BY-SA 4.0
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Source - https://stackoverflow.com/a/175787
// Posted by Dan, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-11, License - CC BY-SA 4.0
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


function darkenHex(hex, percent) {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);

    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    r = Math.max(0, Math.floor(r * (1 - percent)));
    g = Math.max(0, Math.floor(g * (1 - percent)));
    b = Math.max(0, Math.floor(b * (1 - percent)));

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function applyTheme(options) {
    const root = document.documentElement;

    root.style.setProperty("--proton_gold", options.protonGoldColor);
    root.style.setProperty("--proton_platinum", options.protonPlatinumColor);
    root.style.setProperty("--proton_silver", options.protonSilverColor);
    root.style.setProperty("--proton_bronze", options.protonBronzeColor);
    root.style.setProperty("--proton_borked", options.protonBorkedColor);
    root.style.setProperty("--proton_pending", options.protonPendingColor);

    root.style.setProperty("--deck_playable", options.deckPlayableColor);
    root.style.setProperty("--deck_verified", options.deckVerifiedColor);
    root.style.setProperty("--deck_unsupported", options.deckUnsupportedColor);
    root.style.setProperty("--deck_unknown", options.deckUnknownColor);

    const nativeDark = darkenHex(options.protonNativeColor, 0.25);
    root.style.setProperty(
        "--proton_native",
        `linear-gradient(to right, ${options.protonNativeColor} 5%, ${nativeDark} 95%)`
    );
}
const defaultOptions = {
    searchPageBadges: true,
    gamePageBadges: true,
    searchBarBadges: true,
    deckBadges: true,

    protonNativeColor: "#75b022",
    protonPlatinumColor: "#7bb1e8",
    protonGoldColor: "#cfb53b",
    protonSilverColor: "#c0c0c0",
    protonBronzeColor: "#e78f36",
    protonBorkedColor: "#cc0000",
    protonPendingColor: "#ff9595",

    deckPlayableColor: "#e78f36",
    deckVerifiedColor: "#5fe736",
    deckUnsupportedColor: "#cc0000",
    deckUnknownColor: "#ff9595"
};

function waitForElementByText(selector, text) {
    return new Promise(resolve => {
        const find = () =>
            [...document.querySelectorAll(selector)]
                .find(el => el.textContent.trim() === text);

        const existing = find();
        if (existing) {
            resolve(existing);
            return;
        }

        const observer = new MutationObserver(() => {
            const el = find();
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function addButtonToClass(button, className) {
    //  Get the "Community Hub" button on the steam page and append the new div to the parent of the button.
    var otherSiteButton = document.getElementsByClassName(className);
    if (otherSiteButton) {
        otherSiteButton[0].append(button);
    }
}

function addButtonToElement(button, element, className) {
    var parentElement = element.getElementsByClassName(className)[0];
    if(parentElement){
        parentElement.append(button);
    }
}


// Check if system requirements tabs include a linux tab
function checkNative(sysreq_tabs) {
    for (let i = 0; i < sysreq_tabs.length; i++) {
        var tab = sysreq_tabs.item(i);
        if (tab.getAttribute("data-os") == "linux") {
            return true;
        }
    }
    return false;
}
