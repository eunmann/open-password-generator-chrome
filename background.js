const generatePasswordId = "generatePassword";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: generatePasswordId,
    title: "Generate Password",
    contexts: ["editable"],
  });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateStrongPassword() {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+{}:"<>?[];,./\'';
    const allChars = uppercaseChars + lowercaseChars + numbers + specialChars;
    let password = [];

    function getRandomChar(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    const minCharInstances = 2;
    let i = 0;
    for (; i < minCharInstances; i++) {
        password.push(getRandomChar(uppercaseChars));
        password.push(getRandomChar(lowercaseChars));
        password.push(getRandomChar(numbers));
        password.push(getRandomChar(specialChars));
    }

    const passwordLength = 16;
    for (; i < passwordLength; i++) {
        password.push(getRandomChar(allChars));
    }

    password = shuffleArray(password);

    return password.join('');
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === generatePasswordId) {
    let generatedPassword = generateStrongPassword();

    // New API usage
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillPassword,
      args: [generatedPassword]
    });
  }
});

// This function will be serialized and executed in the context of the webpage
function fillPassword(password) {
  const element = document.activeElement;
  element.value = password;

  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}
