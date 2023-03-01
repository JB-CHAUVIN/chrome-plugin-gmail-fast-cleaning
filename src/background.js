console.log('Load Gmail extension')

function getSelectionText() {
	const email = (document.querySelector("span.go").innerText || '').replace('<', '').replace('>', '');
	const selectedText = window.getSelection().toString();
  return email || selectedText;
}

function handleFindEmails(variables) {
	const element = document.querySelector("input.gb_jf");
	console.log('Trying to find element', element, variables.selectionText)
	if (element) {
		element.value = variables.selectionText;
	}

	document.querySelector('button.gb_sf').click()
	setTimeout(() => {
		const clickable = document.querySelector('.T-Jo-auh')
		clickable.click()
	}, 2000)
}

function actionDeleteEmails() {
	let selectionText = ''

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
			args: [{selectionText}],
		    function: handleFindEmails
		  });
	  });
	});
}

chrome.commands.onCommand.addListener((command) => {
	console.log('Command:', command)
  if(command === 'delete-emails') {
  	actionDeleteEmails()
  }
});
