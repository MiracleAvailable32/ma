// popup.js
const themes = [
  { name: "Dark Mode" }, 
  { name: "Light Mode" }, 
  { name: "Ocean Blue" },
  { name: "Forest Green" }, 
  { name: "Sunset Orange" }
  // Add more themes as needed
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
        document.querySelectorAll('.theme-list li').forEach(el => el.classList.remove('active-theme'));
        li.classList.add('active-theme');
    };
    themeList.appendChild(li);
});

// Set the currently selected theme as active when loaded
chrome.storage.sync.get('theme', (data) => {
    const activeTheme = data.theme;
    if (activeTheme) {
        const activeLi = Array.from(document.querySelectorAll('.theme-list li')).find(li => li.textContent === activeTheme);
        if (activeLi) activeLi.classList.add('active-theme');
    }
});
