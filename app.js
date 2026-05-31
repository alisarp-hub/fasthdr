const els = {
  fileInput: document.querySelector("#fileInput"),
  folderInput: document.querySelector("#folderInput"),
  folderBtn: document.querySelector("#folderBtn"),
  dropZone: document.querySelector("#dropZone"),
  processBtn: document.querySelector("#processBtn"),
  downloadBtn: document.querySelector("#downloadBtn"),
  clearBtn: document.querySelector("#clearBtn"),
  photoCount: document.querySelector("#photoCount"),
  setCount: document.querySelector("#setCount"),
  doneCount: document.querySelector("#doneCount"),
  progressText: document.querySelector("#progressText"),
  progressPercent: document.querySelector("#progressPercent"),
  progressBar: document.querySelector("#progressBar"),
  queueHint: document.querySelector("#queueHint"),
  queueList: document.querySelector("#queueList"),
  status: document.querySelector("#status"),
};

let selectedFiles = [];
let zipBlob = null;
let progressTimer = 0;

function setStatus(message) {
  els.status.textContent = message;
}

function setProgress(value, label) {
  const percent = Math.max(0, Math.min(100, Math.round(value)));
  els.progressBar.value = percent;
  els.progressBar.setAttribute("value", String(percent));
  els.progressPercent.textContent = `${percent}%`;
  els.progressText.textContent = label;
}

function sortFiles(files) {
  return [...files]
    .filter((file) => file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name))
    .sort((a, b) => (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name, undefined, { numeric: true }));
}

function exposureFromName(name) {
  const lower = name.toLowerCase();
  if (/(^|[^a-z])(low|under|dark|dusuk)([^a-z]|$)/.test(lower)) return "low";
  if (/(^|[^a-z])(mid|middle|normal|orta)([^a-z]|$)/.test(lower)) return "mid";
  if (/(^|[^a-z])(high|over|bright|yuksek)([^a-z]|$)/.test(lower)) return "high";
  return null;
}

function sceneKey(file) {
  return (file.webkitRelativePath || file.name)
    .replace(/\.[^.]+$/, "")
    .replace(/(^|[^a-z])(low|under|dark|dusuk|mid|middle|normal|orta|high|over|bright|yuksek)([^a-z]|$)/gi, "_")
    .replace(/[_\s-]+/g, "_")
    .replace(/^_|_$/g, "")
    .replace(/[^a-z0-9_-]+/gi, "_") || "scene";
}

function getGroups(files) {
  const named = new Map();
  let canUseNames = files.length > 0;

  for (const file of files) {
    const exposure = exposureFromName(file.name);
    if (!exposure) {
      canUseNames = false;
      break;
    }
    const key = sceneKey(file);
    if (!named.has(key)) named.set(key, {});
    named.get(key)[exposure] = file;
  }

  if (canUseNames) {
    const groups = [...named.entries()]
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .filter(([, group]) => group.low && group.mid && group.high)
      .map(([name, group]) => ({ name, files: [group.low, group.mid, group.high], status: "Hazir" }));
    if (groups.length) return groups;
  }

  const groups = [];
  for (let i = 0; i + 2 < files.length; i += 3) {
    groups.push({ name: sceneKey(files[i + 1]), files: [files[i], files[i + 1], files[i + 2]], status: "Hazir" });
  }
  return groups;
}

function renderQueue(groups) {
  els.queueList.innerHTML = "";
  groups.slice(0, 160).forEach((group, index) => {
    const row = document.createElement("div");
    row.className = "queue-item";
    row.innerHTML = `
      <span class="queue-num">#${String(index + 1).padStart(3, "0")}</span>
      <span class="queue-files" title="${group.files.map((file) => file.name).join(" | ")}">${group.files.map((file) => file.name).join(" &middot; ")}</span>
      <span class="queue-state">${group.status}</span>
    `;
    els.queueList.appendChild(row);
  });
}

function acceptFiles(fileList) {
  selectedFiles = sortFiles(fileList);
  zipBlob = null;
  const groups = getGroups(selectedFiles);

  els.photoCount.textContent = String(selectedFiles.length);
  els.setCount.textContent = String(groups.length);
  els.doneCount.textContent = String(groups.length);
  els.processBtn.disabled = groups.length === 0;
  els.downloadBtn.disabled = true;
  els.queueHint.textContent = groups.length ? `${groups.length} set hazir` : "Henuz dosya yok";
  setProgress(0, "Hazir");
  renderQueue(groups);

  if (!selectedFiles.length) {
    setStatus("Goruntu dosyasi bulunamadi.");
  } else if (!groups.length) {
    setStatus("En az 3 fotograf sec. Sira low, middle, high olmali.");
  } else {
    const unused = selectedFiles.length - groups.length * 3;
    setStatus(`${groups.length} HDR seti hazir. Tek dugmeyle real estate merge yapilacak.${unused ? ` ${unused} fotograf disarida kaldi.` : ""}`);
  }
}

function startFakeProcessingProgress() {
  clearInterval(progressTimer);
  let progress = 8;
  setProgress(progress, "Yukleniyor");
  progressTimer = setInterval(() => {
    progress = Math.min(92, progress + Math.max(1, (92 - progress) * 0.08));
    setProgress(progress, progress < 35 ? "Fotograflar yukleniyor" : "HDR merge isleniyor");
  }, 550);
}

function stopProgress(label, value = 100) {
  clearInterval(progressTimer);
  setProgress(value, label);
}

async function processPhotos() {
  const groups = getGroups(selectedFiles);
  if (!groups.length) return;

  zipBlob = null;
  els.processBtn.disabled = true;
  els.downloadBtn.disabled = true;
  setStatus("OpenCV real estate HDR merge basladi. Buyuk setlerde biraz bekle.");
  startFakeProcessingProgress();

  const form = new FormData();
  selectedFiles.forEach((file) => form.append("photos", file, file.webkitRelativePath || file.name));

  try {
    const response = await fetch("/api/merge", { method: "POST", body: form });
    if (!response.ok) {
      let message = "HDR merge basarisiz.";
      try {
        const json = await response.json();
        message = json.error || message;
      } catch {}
      throw new Error(message);
    }

    zipBlob = await response.blob();
    stopProgress("Tamamlandi");
    els.doneCount.textContent = String(groups.length);
    els.downloadBtn.disabled = false;
    setStatus(`${groups.length} HDR cikti hazir. ZIP indir dugmesine bas.`);
  } catch (error) {
    stopProgress("Hata", 0);
    setStatus(error.message);
  } finally {
    els.processBtn.disabled = groups.length === 0;
  }
}

function downloadZip() {
  if (!zipBlob) return;
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "real-estate-hdr-results.zip";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function clearAll() {
  selectedFiles = [];
  zipBlob = null;
  els.fileInput.value = "";
  els.folderInput.value = "";
  els.photoCount.textContent = "0";
  els.setCount.textContent = "0";
  els.doneCount.textContent = "0";
  els.processBtn.disabled = true;
  els.downloadBtn.disabled = true;
  els.queueHint.textContent = "Henuz dosya yok";
  els.queueList.innerHTML = "";
  setProgress(0, "Hazir");
  setStatus("Fotograflar bekleniyor.");
}

els.fileInput.addEventListener("change", (event) => acceptFiles(event.target.files || []));
els.folderInput.addEventListener("change", (event) => acceptFiles(event.target.files || []));
els.folderBtn.addEventListener("click", () => els.folderInput.click());
els.processBtn.addEventListener("click", processPhotos);
els.downloadBtn.addEventListener("click", downloadZip);
els.clearBtn.addEventListener("click", clearAll);

["dragenter", "dragover"].forEach((name) => {
  els.dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    els.dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((name) => {
  els.dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    els.dropZone.classList.remove("is-dragging");
  });
});

els.dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  acceptFiles(event.dataTransfer?.files || []);
});
