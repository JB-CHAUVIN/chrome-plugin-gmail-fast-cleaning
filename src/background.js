function getSelectionText() {
	const email = (document.querySelector("span.go").innerText || '').replace('<', '').replace('>', '');
	const selectedText = window.getSelection().toString();
  return email || selectedText;
}

function actionDeleteEmails() {
	var selectionText = ''

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	  const tabId = tabs[0].id;
	  chrome.scripting.executeScript({
	    target: { tabId: tabId },
	    function: getSelectionText
	  }, (injectionResults) => {
	    selectionText = injectionResults[0].result;

		console.log({
			selectionText
		})

	    chrome.scripting.executeScript({
		    target: { tabId: tabId },
		    function: () => {
				const element = document.querySelector("#gs_lc50 > input:nth-child(1)");
				console.log('selectionText')
				if (element) {
					element.innerText = 'selectionText';
				}
			}
		  });
	  });
	});
}

chrome.commands.onCommand.addListener((command) => {
  if(command === 'delete-emails') {
  	actionDeleteEmails()
  }
});
