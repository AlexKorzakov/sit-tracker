chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== "install") return;

    await chrome.storage.local.set({
        installDate: Date.now(),
        intervalMinutes: 20,
        isRunning: false,
        totalBreaks: 0,
        breakHistory: [],
        notificationClicks: 0,
    });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== "break-reminder") return;

    await chrome.notifications.create(
        "break-reminder",
        {
            type: "basic",
            iconUrl: "images/sit-tracker-icon-proto.png",
            title: "SitTrack",
            message: "Time to warm up",
        }
    );
    const { totalBreaks = 0 } = await chrome.storage.local.get("totalBreaks");
    await chrome.storage.local.set({
        isRunning: false,
        endTime: 0,
        totalBreaks: totalBreaks + 1,
    });
});

chrome.notifications.onClicked.addListener(async (notificationId) => {
    if (notificationId === "break-reminder") {
        const { notificationClicks = 0 } = await chrome.storage.local.get("notificationClicks");
        await chrome.storage.local.set({ 
            notificationClicks: notificationClicks + 1,
        });
    }
});

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "START_TIMER") {
        await chrome.alarms.clear("break-reminder");
        await chrome.alarms.create("break-reminder", { delayInMinutes: message.intervalMinutes });
        const endTime = Date.now() + message.intervalMinutes * 60 * 1000;
        await chrome.storage.local.set({
            isRunning: true,
            intervalMinutes: message.intervalMinutes,
            endTime: endTime,
        });
    } else if (message.type === "STOP_TIMER") {
        await chrome.alarms.clear("break-reminder");
        await chrome.storage.local.set({
            isRunning: false,
            endTime: 0,
        });
    }
});