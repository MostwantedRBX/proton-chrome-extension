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
