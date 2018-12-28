var mainArea = document.getElementById("commandArea");
var ipAPI = "https://api.ipify.org?format=json";
var ip = cus.ipFallback;

setStyles();
if (cus.showIp) {
    requestAPI(ipAPI);
} else {
    generator();
}

// Set CLI Styles
function setStyles() {
    WebFont.load({
        google: {
            families: [cus.fontName]
        }
    });
    document.body.style.backgroundColor = cus.bgColor;
    document.body.style.color = cus.fontColor;
    document.body.style.fontFamily = cus.fontName + ", Arial";
    document.body.style.fontSize = cus.fontSize;
}

// Create Text Input
function generator() {
    var textBox = document.createElement("input");
    var cmdContainer = document.createElement("div");
    var userText = document.createElement("div");
    textBox.style.backgroundColor = cus.bgColor;
    textBox.style.color = cus.fontColor;
    cmdContainer.className = "row";
    userText.className = "col-auto col-md-auto";
    userText.innerHTML = '[' + ip + ']: ';
    textBox.setAttribute("type", "text");
    textBox.className = "col col-md";
    mainArea.appendChild(cmdContainer);
    cmdContainer.appendChild(userText);
    cmdContainer.appendChild(textBox);
    textBox.focus();
    textBox.addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            textBox.disabled = true;
            nextCmd(textBox.value.toLowerCase());
        }
    });
}

// Show Output
function nextCmd(textInBox) {
    var outputText = document.createElement("div");
    var outputContainer = document.createElement("div");
    outputContainer.className = "row";
    outputText.className = "col-sm-12 col-md-12";
    switch (textInBox) {
        case "":
            break;
        case "help":
            var helpText = "";
            for (i = 1; i < cus.commands.length; i++) {
                helpText = helpText + cus.commands[i] + "&nbsp&nbsp";
            }
            outputText.innerHTML = helpText;
            break;
        case "about":
            outputText.innerHTML = cus.about;
            break;
        case "contact":
            outputText.innerHTML = '<a target="_blank" style="color: ' + cus.fontColor + ';" href="https://github.com/' + cus.githubUsername + '">Github</a>&nbsp&nbsp<a target="_blank" style="color: ' + cus.fontColor + ';" href="https://twitter.com/' + cus.twitterUsername + '">Twitter</a>&nbsp&nbsp<a style="color: ' + cus.fontColor + ';" href="mailto:' + cus.email + '">Email</a>';
            break;
        case "projects":
            requestAPI("https://api.github.com/users/" + cus.githubUsername + "/repos");
            break;
        case "clear":
            mainArea.innerHTML = "";
            break;
        default:
            outputText.innerHTML = "Command Not Found.";
            break;
    }
    if (textInBox != "clear" || textInBox != "projects") {
        mainArea.appendChild(outputContainer);
        outputContainer.appendChild(outputText);
    }
    if (textInBox != "projects") {
        generator();
    }
}

// Function to handle API request
function requestAPI(linkAPI) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (linkAPI != ipAPI) {
                if (cus.showGithubProjects) {
                    setProjects(xmlHttp.responseText);
                } else {
                    setProjects();
                }
            }
            else if (linkAPI == ipAPI) {
                var ipJSON = JSON.parse(xmlHttp.responseText);
                ip = ipJSON.ip;
                var helpText = document.createElement("div");
                helpText.innerHTML = 'Type "help" to get the list of commands.';
                mainArea.appendChild(helpText);
                generator();
            }
        }
    }
    xmlHttp.open("GET", linkAPI, true);
    xmlHttp.send(null);
}

// Output the project list
function setProjects(apiOutput) {
    var outputText = document.createElement("div");
    var outputContainer = document.createElement("div");
    var githubText = "";
    if (cus.showGithubProjects) {
        var res = JSON.parse(apiOutput);
        for (var i = 0; i < res.length; i++) {
            githubText = githubText + '<a target="_blank" style="color: ' + cus.fontColor + ';" href="' + res[i].html_url + '"> ' + res[i].name + ' </a> - ' + res[i].description + '<br>'
        }
    }
    if (cus.showOtherProjects) {
        for (i = 0; i < projects.length; i++) {
            githubText = githubText + '<a target="_blank" style="color: ' + cus.fontColor + ';" href="' + projects[i].url + '"> ' + projects[i].name + ' </a> - ' + projects[i].description + '<br>'
        }
    }
    outputContainer.className = "row";
    outputText.className = "col-sm-12 col-md-12";
    outputText.innerHTML = githubText;
    mainArea.appendChild(outputContainer);
    outputContainer.appendChild(outputText);
    generator();
}