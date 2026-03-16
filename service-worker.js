chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== "install") {
        return;
    }

    await chrome.storage.local.set({
        installDate: Date.now(),
        interval: 20,
        enabled: false,
        totalBrakes: 0,
        history: [],
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "break-reminder") {
        chrome.notifications.create(
            "break-reminder",
            {
                type: "basic",
                iconUrl: "images/sit-tracker-icon-proto.png",
                title: "SitTrack",
                message: "Time to wake up",
            }
        );
    }
});

chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId === "break-reminder") {
        console.log("User click on notification!");
    }
});


chrome.storage.onChanged.addListener((chanegs, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(chanegs)) {
        console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
})