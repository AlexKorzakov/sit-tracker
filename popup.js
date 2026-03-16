const status = document.querySelector(".status");
const start = document.querySelector("#start");

chrome.storage.local.get(["enabled"]).then((result) => {
    const isEnabled = result.enabled ?? false;

    status.textContent = "Status: " + (isEnabled ? "Enabled" : "Disabled");
});

start.addEventListener("click", (event) => {
    event.preventDefault();
    const interval = document.querySelector("#interval").value;
    console.log(typeof(parseInt(interval)));
    chrome.storage.local.set({ 
        enabled: true,
        interval: parseInt(interval)
    });
});