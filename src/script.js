(async function() {
  const { staticServer } = await browser.storage.local.get("staticServer");
  const host = location.host.replace(/^www./, "");
  const filePath = `${host}.css`;
  let fileContent;

  if (staticServer) {
    fileContent = await fetch(`${staticServer}/${filePath}`).then(r => r.text());
  } else {
    const { selectedFolder } = await browser.storage.local.get("selectedFolder");

    if (!selectedFolder) {
      return;
    }

    fileContent = selectedFolder[filePath];
  }

  if (!fileContent) {
    return;
  }

  const style = document.createElement("style");
  style.innerText = fileContent;
  style.dataset.styleInjectorExtension = "";
  document.head.append(style);
})();
