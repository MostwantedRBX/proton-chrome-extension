"use strict";

chrome.runtime.onMessage.addListener(
  function(req, from, sendRes) {
      if (req.contentScriptQuery == "queryProtonRating") {
          var href = "https://www.protondb.com/api/v1/reports/summaries/" + req.appID + ".json";

          fetch(href)
              .then(response => {
                  if (!response.ok)
                  {
                      if (response.status == 404)
                      {
                          sendRes("pending");
                      }

                      throw Error(response.status);
                  }
                  return response.json();
              })
              .then(data => {
                console.log(data.tier); 
                sendRes(data.tier);

              })
              .catch(error => console.log(error))

          return true;
      }
  }
);
