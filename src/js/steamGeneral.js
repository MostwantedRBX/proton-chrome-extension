"use strict";

const processedAppIds = new Set();

async function waitForLabel(label) {
    const popularSearchResultsLabel = await waitForElementByText("div", label);

    const searchContents = popularSearchResultsLabel.nextElementSibling;
    if (!searchContents) {
        console.warn("Could not find search results container");
        return;
    }
    processExistingResults(popularSearchResultsLabel);
    observeSearchResults(searchContents);
}

function loadAndApplyTheme() {
    chrome.storage.sync.get(defaultOptions, (options) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            applyTheme(defaultOptions);
            return;
        }

        applyTheme(options);
    });
}

async function onPageLoad() {
    loadAndApplyTheme();
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "sync") {
            loadAndApplyTheme();
        }
    });

    const _ = await Promise.all([
        waitForLabel("Popular searches"),
        waitForLabel("Search results")
    ]);
}

function processExistingResults(container) {
    const parent = container.parentElement;
    const links = parent.querySelectorAll('a[href*="/app/"]');
    for (const link of links) {
        onSteamItemLoaded(link);
    }
}

function observeSearchResults(container) {
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                onSteamItemLoaded(node);

                for (const match of node.querySelectorAll?.(".match") ?? []) {
                    onSteamItemLoaded(match);
                }
            }
        }
    });

    observer.observe(container, {
        childList: true,
        subtree: true
    });
}

function onSteamItemLoaded(newItem) {

    if (!(newItem instanceof HTMLElement)) return;

    if (newItem.tagName !== "A") return;

    const href = newItem.getAttribute("href");
    if (!href?.includes("/app/")) return;


    const appid = href.split("/app/")[1].split("/")[0];

    if (processedAppIds.has(appid))
        return;
    processedAppIds.add(appid);

    chrome.storage.sync.get(defaultOptions, (options) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

        if (options.searchBarBadges) {
            chrome.runtime.sendMessage(
                {
                    contentScriptQuery: "queryProtonRating",
                    appID: appid
                },
                function (res) {
                    const rating = res[0];
                    const returnedId = res[1];

                    const cont = createProtonSearchbarRating(rating, returnedId);

                    const nameEl = newItem.lastChild;
                    if (nameEl) {
                        nameEl.firstChild.appendChild(cont);
                    }

                }
            );
        }
    });

}

onPageLoad();