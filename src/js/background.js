"use strict";

chrome.runtime.onMessage.addListener(
  function(req, from, sendRes) {
      if (req.contentScriptQuery == "queryProtonRating") {
          //    link to game ratings on proton
          var href = "https://www.protondb.com/api/v1/reports/summaries/" + req.appID + ".json";
          
          //    Fetch the body from the appid's protondb page then if response if 404, that means its not been reviewed enough then return the rating field in the json
          fetch(href)
              .then(res => {
                  if (!res.ok) {
                      if (res.status == 404) {
                          sendRes(["pending", req.appID]);
                          return true;
                      }
                      throw Error(res.status);
                  }
                  return res.json();
              })
              .then(data => {sendRes([data.tier, req.appID]);}).catch(error => console.log(error))

          return true;
      }
  }
);
/// This function checks if the current browser is firefox and if so, opens a special permissions tab requesting permissions.
/// Firefox has stopped supporting 'required' permissions since v3 and is real picky with asking the user about those permissions.
/// This opens a page explaining the permissions and asking for a button click
function onStartup(){
    if (typeof browser !== 'undefined' && browser.runtime.getBrowserInfo) {
        if(browser.runtime.getBrowserInfo().then(async function(res){
            console.log(res);
            if(res.name == "Firefox"){
                browser.permissions.contains({origins: ['https://www.protondb.com/*', 'https://store.steampowered.com/*']}).then(async function(result) {
                    if(!result){
                        await browser.tabs.create({ url: "html/permissions.html" });
                    }
                });
            }
        }));
    }
}

chrome.runtime.onInstalled.addListener(async (details) => {
    onStartup();
});

