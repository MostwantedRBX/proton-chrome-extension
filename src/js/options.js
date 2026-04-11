function saveOptions() {
    const options = {};

    for (const input of form.querySelectorAll("input")) {
        if (input.type === "checkbox") {
            options[input.name] = input.checked;
        } else if (input.type === "color") {
            options[input.name] = input.value;
        }
    }

    chrome.storage.sync.set(options, () => {
        const status = document.getElementById("status");

        if (chrome.runtime.lastError) {
            console.error("Failed to save options:", chrome.runtime.lastError);
            status.textContent = "Failed to save options.";
            return;
        }

        status.textContent = "Options saved.";
        setTimeout(() => {
            // status.textContent = "";
        }, 1500);
    });
}

var form;
var checkboxes;
var colorpickers;

function restoreOptions() {
    chrome.storage.sync.get(defaultOptions, (storedOptions) => {
        if (chrome.runtime.lastError) {
            console.error("Failed to restore options:", chrome.runtime.lastError);
            return;
        }

        for (const input of form.querySelectorAll("input")) {
            const value = storedOptions[input.name];

            if (input.type === "checkbox") {
                input.checked = value;
            } else if (input.type === "color") {
                input.value = value;
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    form = document.getElementById('options-form');
    checkboxes = form.querySelectorAll("input[type='checkbox']");
    colorpickers = form.querySelectorAll("input[type='color']");
    restoreOptions();

    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', saveOptions);
    }

    for (const colorpicker of colorpickers) {
        colorpicker.addEventListener('change', saveOptions);
    }

    document.getElementById("open-full-settings").addEventListener("click", () => {
        chrome.runtime.openOptionsPage();
    });


});
