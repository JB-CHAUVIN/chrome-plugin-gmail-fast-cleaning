console.log('Load Gmail extension')

function getSelectionText() {
	let email = ''
	const go = document.querySelector("span.go");

	if(go) {
		email = go.innerText;
		console.log('Email "classic way"', email)
	}

	if(!email) {
		const h3 = document.querySelector('h3.iw');
		if(h3) {
			email = h3.innerText;
			console.log('Email "h3 way"', email)
		} else {
			console.log('No H3 found')
		}
	}

	const selectedText = window.getSelection().toString();
	console.log('Email "selected text"', selectedText)

	if(!email && !selectedText) alert('Email not found')

	const theEmail = (email || selectedText).toString().replace('<', '').replace('>', '');

	console.log('Email:', theEmail)

  	return theEmail;
}

function handleFindEmails(variables) {
	const element = document.querySelector("input.gb_jf");
	console.log('Trying to find element', element, variables.selectionText)
	if (element) {
		element.value = 'from:' + variables.selectionText;
	}

	document.querySelector('button.gb_sf').click()
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
