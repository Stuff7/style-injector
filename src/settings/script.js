/** @type {HTMLInputElement} */
const staticServer = document.getElementById("staticServer");
const staticServerUrl = document.getElementById("staticServerUrl");

if (!(staticServer instanceof HTMLInputElement)) {
  throw new Error("Static server input not found");
}

staticServer.addEventListener("change", async function () {
  if (!staticServer.value) {
    return;
  }

  browser.storage.local.set({ staticServer: staticServer.value });
  displayStaticServer(staticServer.value);
});

browser.storage.local.get("staticServer").then((result) => {
  displayStaticServer(result.staticServer);
});

/** @param {string|undefined} url - Static server url */
function displayStaticServer(url) {
  const NA = "No static server";
  if (!url) {
    staticServerUrl.textContent = NA;
  }

  try {
    staticServerUrl.textContent = (new URL(url))?.hostname || NA;
  } catch (e) {
    staticServerUrl.textContent = NA;
  }
}

/** @type {HTMLInputElement} */
const folderPicker = document.getElementById("folderPicker");

if (!(folderPicker instanceof HTMLInputElement)) {
  throw new Error("Folder picker element not found");
}

document.getElementById("folderPickerBtn").addEventListener("click", () => folderPicker.click());

folderPicker.addEventListener("change", async function () {
  if (!folderPicker.files) {
    return;
  }
  /** @type {Record<string, string>} */
  const files = {};
  /** @type {Promise<void>[]} */
  const promises = [...folderPicker.files].map((file) => new Promise((res) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      files[file.name] = reader.result;
      res();
    });
    reader.readAsText(file);
  }));

  await Promise.all(promises);
  browser.storage.local.set({ selectedFolder: files });
  document.getElementById("selectedFolder").textContent = `${promises.length} files loaded`;
});

browser.storage.local.get("selectedFolder").then((result) => {
  const storedFolder = result.selectedFolder;
  document.getElementById("selectedFolder").textContent =
    `${Object.entries(storedFolder).length} files loaded`;
});
