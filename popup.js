const statusElem = document.querySelector(".status");
const startElem = document.querySelector("#start");
const formElem = document.querySelector("#timerForm");
const intervalElem = document.querySelector("#interval");
const endTimeElem = document.querySelector(".endTime");

let isRunningState = false;

chrome.storage.local.get(["isRunning", "endTime"]).then((result) => {
    isRunningState = result.isRunning ?? false;
    statusElem.textContent = "Status: " + (isRunningState ? "Running" : "Stopped");
    startElem.textContent = (isRunningState ? "Stop" : "Start");
    if (result.endTime && result.endTime > 0) {
        endTimeElem.textContent = `Break in: ${new Date(result.endTime)}`;
    }
});

chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.isRunning) {
        isRunningState = changes.isRunning.newValue;
        statusElem.textContent = "Status: " + (isRunningState ? "Running" : "Stopped");
        startElem.textContent = (isRunningState ? "Stop" : "Start");
    }

    if (changes.endTime) {
        const endTime = changes.endTime.newValue ?? 0;
        if (endTime > 0) {
            endTimeElem.textContent = `Break in: ${new Date(changes.endTime.newValue)}`;
        } else {
            endTimeElem.textContent = "";
        }
    }
});

formElem.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isRunningState) {
        await chrome.runtime.sendMessage({ type: "STOP_TIMER" });
    } else {
        const value = parseInt(intervalElem.value, 10);
        if (!value || value <= 0) return;
        await chrome.runtime.sendMessage({
            type: "START_TIMER",
            intervalMinutes: value,
        });
    }

});