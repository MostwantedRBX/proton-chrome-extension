document.getElementById('request-permission').addEventListener('click', () => {
    browser.permissions.request({
      origins: ['https://www.protondb.com/*', 'https://store.steampowered.com/*']
    }).then((granted) => {
      if (granted) {
        window.close();
      } 
    }).catch((error) => {
      console.error(error);
    });
  });