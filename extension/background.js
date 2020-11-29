var port = chrome.runtime.connectNative('default_opener');

port.onMessage.addListener((response) => {
  console.log("Received: " + response);
});

port.onDisconnect.addListener(() => {
  console.log("Disconnected", JSON.stringify(chrome.runtime.lastError));
});

function openUrl(url) {
  try {
    port.postMessage({text: url});
  }
  catch(err) {
    port = chrome.runtime.connectNative("default_opener");
    port.postMessage({text: url});
  }
}

chrome.contextMenus.create({
  title: 'Open in default browser',
  contexts: ['link'],
  onclick: (info) => {
    openUrl(info.linkUrl);
  }
});

function allowHijack(url) {
    return !(url.match(/^http[s]?:\/\/meet.google.com/))
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.hasOwnProperty("request")) {
      if (request["request"] == "LAUNCH" && !sender.tab.pinned && allowHijack(sender.tab.url)) {
        openUrl(sender.tab.url);
        chrome.tabs.remove(sender.tab.id);
      }
    }
    else {
      sendResponse({response: "nothing"});
    }
  });
