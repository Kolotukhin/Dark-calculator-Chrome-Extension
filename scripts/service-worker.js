console.log('start service-worker.js');

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.greeting === 'switch_on') {
        console.log('Response to request connect - content.js tab:', sender.tab.id, '  Response: ', request.greeting);
        console.log('Tab:', sender.tab.id, '  send: switch');
        chrome.tabs.sendMessage(sender.tab.id, { greeting: 'switch' });
    }
});

chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { greeting: 'connect_test' }, function (response) {
        if (!chrome.runtime.lastError) {
            console.log("Ready");

            chrome.tabs.sendMessage(tab.id, { greeting: 'query_switch' });

        }
        else {
            console.log("Not there, inject contentscript");
            chrome.scripting.insertCSS({ target: { tabId: tab.id, allFrames: true }, files: ['css/style.css', 'css/iconsfont.css'], }, function () {
                if (!chrome.runtime.lastError) { }
            });

            chrome.scripting.executeScript({ target: { tabId: tab.id, allFrames: false }, files: ['scripts/content.js'], }, function () {
                if (!chrome.runtime.lastError) { chrome.tabs.sendMessage(tab.id, { greeting: 'query_switch' }); }
            });

        }
    });
});


