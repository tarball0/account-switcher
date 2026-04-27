chrome.commands.onCommand.addListener(function (command) {
	var isNewTab = command.includes('shift');
	var account_num = command.substring(command.length - 1);
	
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    var current_url = tabs[0].url;
    var update_url_regex = null;
    var update_acc = null;

    const google_regex_type1 = ".*.google.*\/u\/[0-9].*"
    if (current_url.match(google_regex_type1)) {
      update_url_regex = RegExp("u\/[0-9]");
      update_acc = "u/" + account_num;
    }

    const google_regex_type2 = ".*.google.*\?authuser=[0-9].*"
    if (current_url.match(google_regex_type2)) {
      update_url_regex = RegExp("authuser=[0-9]");
      update_acc = "authuser=" + account_num;
    }

    if (update_acc && update_url_regex) {
      current_url = current_url.replace(update_url_regex, update_acc);
      console.log(current_url);
      if (!isNewTab) {
        chrome.tabs.update({ url: current_url });
      } else {
        chrome.tabs.create({ url: current_url });
      }
    } else {
      console.log("Account switching is not supported on this page.");
    }
  });
});
