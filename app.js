const TR = (navigator.languages || [navigator.language || "en"]).some((x) => x.toLowerCase().startsWith("tr"));
const T = TR
  ? {
      folder: "Klas\u00f6r se\u00e7",
      eyebrow: "Colora HDR birle\u015ftirme",
      title: "Pozlamalar\u0131 tek temiz, do\u011fal ve kaliteli foto\u011frafa \u00e7evir.",
      lede: "Colora otomatik hizalar, pencere detay\u0131n\u0131 korur, oday\u0131 do\u011fal a\u00e7ar ve temiz JPG \u00e7\u0131kt\u0131lar\u0131n\u0131 ZIP olarak verir.",
      drop: "Foto\u011fraflar\u0131 buraya b\u0131rak",
      hint: "Dosya ad\u0131nda low / mid / high varsa otomatik e\u015fle\u015fir. Yoksa se\u00e7im s\u0131ras\u0131 3'l\u00fc set kabul edilir.",
      photo: "foto\u011fraf",
      set: "HDR seti",
      ready: "haz\u0131r",
      lens: "Lens d\u00fczeltme",
      lensHint: "Geni\u015f a\u00e7\u0131 kenar e\u011filmesini d\u00fczelt",
      shift: "Kayma d\u00fczeltme",
      shiftHint: "\u00dcst \u00fcste binme ve kenar kaymas\u0131n\u0131 temizle",
      start: "HDR Merge ba\u015flat",
      zip: "ZIP indir",
      clear: "Temizle",
      wait: "Foto\u011fraflar bekleniyor.",
      sets: "Setler",
      none: "Hen\u00fcz dosya yok",
      noImg: "G\u00f6r\u00fcnt\u00fc dosyas\u0131 bulunamad\u0131.",
      need3: "En az 3 foto\u011fraf se\u00e7. S\u0131ra low, middle, high olmal\u0131.",
      hdrRun: "HDR merge ba\u015flad\u0131. B\u00fcy\u00fck setlerde biraz bekle.",
      upload: "Y\u00fckleniyor",
      proc: "\u0130\u015fleniyor",
      done: "Tamamland\u0131",
      err: "Hata",
      fail: "HDR merge ba\u015far\u0131s\u0131z.",
      hdrOk: "HDR \u00e7\u0131kt\u0131 haz\u0131r. ZIP indir d\u00fc\u011fmesine bas.",
      rawDrop: "Foto\u011fraflar\u0131 buraya b\u0131rak",
      rawHint: "RAW, JPG, JPEG, PNG ve WebP dosyalar\u0131n\u0131 toplu y\u00fckle.",
      rawEyebrow: "Colora otomatik renk",
      rawTitle: "Foto\u011fraf\u0131n t\u00fcr\u00fcn\u00fc anlay\u0131p etkileyici renk ve kalite verir.",
      rawLede: "Portre, manzara, i\u00e7 mekan, \u00fcr\u00fcn ve gece foto\u011fraflar\u0131 i\u00e7in ayr\u0131 renk profili uygular; t\u00fcm sonu\u00e7lar\u0131 ZIP olarak indirirsin.",
      rawPick: "Foto\u011fraf se\u00e7",
      rawStart: "Auto renk ba\u015flat",
      rawInfo: "RAW, JPG, PNG ve WebP dosyalar\u0131 sahneye g\u00f6re renkli JPG'ye \u00e7evrilir.",
      rawFail: "Otomatik renk d\u00fczenleme ba\u015far\u0131s\u0131z.",
      rawOk: "Foto\u011fraflar haz\u0131r. ZIP indir d\u00fc\u011fmesine bas.",
      noRaw: "RAW veya g\u00f6r\u00fcnt\u00fc dosyas\u0131 bulunamad\u0131.",
    }
  : {
      folder: "Select folder",
      eyebrow: "Colora HDR merge",
      title: "Turn bracketed exposures into one clean, natural, high-quality photo.",
      lede: "Colora aligns automatically, protects window detail, opens the room naturally, and returns clean JPG outputs as a ZIP.",
      drop: "Drop photos here",
      hint: "If filenames include low / mid / high they are matched automatically. Otherwise selection order is grouped in triples.",
      photo: "photo",
      set: "HDR set",
      ready: "ready",
      lens: "Lens correction",
      lensHint: "Fix wide-angle edge bending",
      shift: "Shift correction",
      shiftHint: "Clean overlap and edge drift",
      start: "Start HDR Merge",
      zip: "Download ZIP",
      clear: "Clear",
      wait: "Waiting for photos.",
      sets: "Sets",
      none: "No files yet",
      noImg: "No image files found.",
      need3: "Select at least 3 photos. Order should be low, middle, high.",
      hdrRun: "HDR merge started. Large batches can take a while.",
      upload: "Uploading",
      proc: "Processing",
      done: "Done",
      err: "Error",
      fail: "HDR merge failed.",
      hdrOk: "HDR output is ready. Press Download ZIP.",
      rawDrop: "Drop photos here",
      rawHint: "Batch upload RAW, JPG, JPEG, PNG and WebP files.",
      rawEyebrow: "Colora auto color",
      rawTitle: "Detect the photo type and give it stronger color, tone and clarity.",
      rawLede: "Applies separate color profiles for portraits, landscapes, interiors, products and night photos, then returns every result in one ZIP.",
      rawPick: "Select photos",
      rawStart: "Start auto color",
      rawInfo: "RAW, JPG, PNG and WebP files are converted into scene-aware JPG edits.",
      rawFail: "Auto color edit failed.",
      rawOk: "Photos ready. Press Download ZIP.",
      noRaw: "No RAW or image files found.",
    };

document.documentElement.lang = TR ? "tr" : "en";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

window.fastHdrSetMode = (raw) => {
  document.body.classList.toggle("raw-mode", raw);
  $("#hdrModeBtn")?.classList.toggle("is-active", !raw);
  $("#rawModeBtn")?.classList.toggle("is-active", raw);
  $(".hero-copy")?.classList.toggle("panel-hidden", raw);
  $("#rawCopy")?.classList.toggle("panel-hidden", !raw);
  $(".hero > .uploader-panel")?.classList.toggle("panel-hidden", raw);
  $("#rawPanel")?.classList.toggle("panel-hidden", !raw);
  $(".queue-section")?.classList.toggle("panel-hidden", raw);
  const folder = $("#folderBtn");
  if (folder) folder.textContent = raw ? T.rawPick : T.folder;
};

function buildUi() {
  const css = document.createElement("style");
  css.textContent = `.mode-switch{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 18px;padding:8px;border:1px solid rgba(219,228,225,.92);border-radius:8px;background:rgba(255,255,255,.88);box-shadow:var(--shadow);backdrop-filter:blur(16px)}.mode-tab{min-height:54px;border:1px solid var(--line);border-radius:7px;background:#fff;color:var(--muted);font-weight:900}.mode-tab.is-active{border-color:var(--accent);background:linear-gradient(135deg,#0d806f,#2773c8 48%,#d88a31);color:#fff}.panel-hidden{display:none!important}.raw-copy{display:grid;align-content:center;min-height:430px;padding:clamp(28px,6vw,76px);border-radius:8px;color:#f7fbfa;background:linear-gradient(110deg,rgba(7,31,46,.92),rgba(14,128,111,.64),rgba(193,67,132,.42)),url("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80") center / cover;box-shadow:var(--shadow)}.raw-copy h1{font-size:clamp(2.05rem,4vw,4.35rem)}.toggle-control{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px;padding:12px 14px;border:1px solid var(--line);border-radius:8px;background:#fff}.toggle-control span{display:grid;gap:3px}.toggle-control small{color:var(--muted);font-weight:750}.toggle-control input{position:relative;width:54px;height:30px;margin:0;appearance:none;border-radius:999px;background:#dce7e4;cursor:pointer}.toggle-control input:after{position:absolute;top:4px;left:4px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(20,32,31,.22);content:"";transition:.18s}.toggle-control input:checked{background:var(--accent)}.toggle-control input:checked:after{transform:translateX(24px)}.raw-panel{display:grid;gap:16px}.raw-panel input[type=file]{display:none!important}.raw-drop{min-height:250px;background:#fff8ef;border-color:#d9bd94}.raw-drop .drop-icon{background:var(--warm)}.raw-actions{display:flex;gap:10px}.raw-actions button{flex:1}@media(max-width:680px){.mode-switch,.raw-actions{grid-template-columns:1fr}.raw-actions{flex-direction:column}.mode-tab{min-height:48px}}`;
  document.head.appendChild(css);

  const panel = $(".uploader-panel");
  $(".nav").insertAdjacentHTML("afterend", `<section class="mode-switch" aria-label="Mode"><button id="hdrModeBtn" class="mode-tab is-active" type="button" onclick="window.fastHdrSetMode(false)">HDR Merge</button><button id="rawModeBtn" class="mode-tab" type="button" onclick="window.fastHdrSetMode(true)">Auto Renk</button></section>`);
  $(".hero").insertAdjacentHTML("afterbegin", `<div id="rawCopy" class="raw-copy panel-hidden"><p class="eyebrow">${T.rawEyebrow}</p><h1>${T.rawTitle}</h1><p class="lede">${T.rawLede}</p></div>`);
  panel.insertAdjacentHTML("afterend", `<section id="rawPanel" class="uploader-panel raw-panel panel-hidden" aria-label="Auto color"><input id="rawInput" type="file" accept=".cr2,.cr3,.dng,.nef,.arw,.raf,.orf,.rw2,.pef,.srw,.raw,.jpg,.jpeg,.png,.webp,image/*" multiple><label id="rawDropZone" class="drop-zone raw-drop" for="rawInput"><span class="drop-icon" aria-hidden="true">+</span><strong>${T.rawDrop}</strong><span>${T.rawHint}</span></label><div class="stats-row"><div><span id="rawCount">0</span><small>${T.photo}</small></div><div><span id="rawDoneCount">0</span><small>${T.ready}</small></div><div><span id="rawZipCount">0</span><small>ZIP</small></div></div><div class="progress-wrap"><div class="progress-line"><span id="rawProgressText">${T.ready}</span><span id="rawProgressPercent">0%</span></div><progress id="rawProgressBar" value="0" max="100"></progress></div><div class="raw-actions"><button id="rawProcessBtn" class="solid-btn large" type="button" disabled>${T.rawStart}</button><button id="rawDownloadBtn" class="solid-btn large" type="button" disabled>${T.zip}</button><button id="rawClearBtn" class="ghost-btn large" type="button">${T.clear}</button></div><div id="rawStatus" class="status" role="status">${T.rawInfo}</div></section>`);

  $("#folderBtn").textContent = T.folder;
  $(".hero-copy .eyebrow").textContent = T.eyebrow;
  $(".hero-copy h1").textContent = T.title;
  $(".hero-copy .lede").textContent = T.lede;
  $("#dropZone strong").textContent = T.drop;
  $("#dropZone strong + span").textContent = T.hint;
  $$(".stats-row small")[0].textContent = T.photo;
  $$(".stats-row small")[1].textContent = T.set;
  $$(".stats-row small")[2].textContent = T.ready;
  const toggles = $$(".toggle-control");
  toggles[0].querySelector("strong").textContent = T.lens;
  toggles[0].querySelector("small").textContent = T.lensHint;
  toggles[1].querySelector("strong").textContent = T.shift;
  toggles[1].querySelector("small").textContent = T.shiftHint;
  $("#processBtn").textContent = T.start;
  $("#downloadBtn").textContent = T.zip;
  $("#clearBtn").textContent = T.clear;
  $(".queue-section h2").textContent = T.sets;
  $("#queueHint").textContent = T.none;
  $("#progressText").textContent = T.ready;
  $("#status").textContent = T.wait;
}

buildUi();

const els = {
  fileInput: $("#fileInput"), folderInput: $("#folderInput"), folderBtn: $("#folderBtn"), dropZone: $("#dropZone"),
  processBtn: $("#processBtn"), downloadBtn: $("#downloadBtn"), clearBtn: $("#clearBtn"),
  lensCorrection: $("#lensCorrection"), shiftCorrection: $("#shiftCorrection"),
  photoCount: $("#photoCount"), setCount: $("#setCount"), doneCount: $("#doneCount"),
  progressText: $("#progressText"), progressPercent: $("#progressPercent"), progressBar: $("#progressBar"),
  queueHint: $("#queueHint"), queueList: $("#queueList"), status: $("#status"),
  hdrModeBtn: $("#hdrModeBtn"), rawModeBtn: $("#rawModeBtn"), hdrPanel: $(".uploader-panel"), rawPanel: $("#rawPanel"), rawCopy: $("#rawCopy"), heroCopy: $(".hero-copy"),
  rawInput: $("#rawInput"), rawDropZone: $("#rawDropZone"), rawProcessBtn: $("#rawProcessBtn"), rawDownloadBtn: $("#rawDownloadBtn"), rawClearBtn: $("#rawClearBtn"),
  rawCount: $("#rawCount"), rawDoneCount: $("#rawDoneCount"), rawZipCount: $("#rawZipCount"), rawProgressText: $("#rawProgressText"), rawProgressPercent: $("#rawProgressPercent"), rawProgressBar: $("#rawProgressBar"), rawStatus: $("#rawStatus"),
};

let selectedFiles = [], selectedRawFiles = [], zipBlob = null, rawZipBlob = null, progressTimer = 0, rawProgressTimer = 0;
const progressAnim = { hdr: { value: 0, raf: 0 }, raw: { value: 0, raf: 0 } };

const imageOk = (f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(f.name);
const rawOk = (f) => f.type.startsWith("image/") || /\.(cr2|cr3|dng|nef|arw|raf|orf|rw2|pef|srw|raw|jpe?g|png|webp)$/i.test(f.name);
const sortByName = (files) => [...files].sort((a, b) => (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name, undefined, { numeric: true }));
const label = (n) => /(^|[^a-z])(low|under|dark|dusuk)([^a-z]|$)/i.test(n) ? "low" : /(^|[^a-z])(mid|middle|normal|orta)([^a-z]|$)/i.test(n) ? "mid" : /(^|[^a-z])(high|over|bright|yuksek)([^a-z]|$)/i.test(n) ? "high" : null;
const scene = (f) => (f.webkitRelativePath || f.name).replace(/\.[^.]+$/, "").replace(/(^|[^a-z])(low|under|dark|dusuk|mid|middle|normal|orta|high|over|bright|yuksek)([^a-z]|$)/gi, "_").replace(/[_\s-]+/g, "_").replace(/^_|_$/g, "").replace(/[^a-z0-9_-]+/gi, "_") || "scene";

function setMode(raw) {
  window.fastHdrSetMode(raw);
}

function paintProgress(kind, value, msg) {
  const p = Math.max(0, Math.min(100, value));
  const bar = kind === "raw" ? els.rawProgressBar : els.progressBar;
  const pct = kind === "raw" ? els.rawProgressPercent : els.progressPercent;
  const txt = kind === "raw" ? els.rawProgressText : els.progressText;
  bar.value = p; bar.setAttribute("value", String(p)); pct.textContent = `${Math.round(p)}%`; txt.textContent = msg;
}

function progress(kind, value, msg) {
  const state = progressAnim[kind];
  const start = state.value;
  const end = Math.max(0, Math.min(100, value));
  const startAt = performance.now();
  cancelAnimationFrame(state.raf);
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const step = (now) => {
    const t = Math.min(1, (now - startAt) / 720);
    state.value = start + (end - start) * ease(t);
    paintProgress(kind, state.value, msg);
    if (t < 1) state.raf = requestAnimationFrame(step);
  };
  state.raf = requestAnimationFrame(step);
}

function groups(files) {
  files = sortByName(files);
  const named = new Map();
  let namedOk = files.length > 0;
  for (const f of files) {
    const l = label(f.name);
    if (!l) { namedOk = false; break; }
    const k = scene(f);
    if (!named.has(k)) named.set(k, {});
    named.get(k)[l] = f;
  }
  if (namedOk) {
    const out = [...named.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).filter(([, g]) => g.low && g.mid && g.high).map(([name, g]) => ({ name, files: [g.low, g.mid, g.high] }));
    if (out.length) return out;
  }
  const out = [];
  for (let i = 0; i + 2 < files.length; i += 3) out.push({ name: scene(files[i + 1]), files: [files[i], files[i + 1], files[i + 2]] });
  return out;
}

function renderQueue(gs) {
  els.queueList.innerHTML = gs.slice(0, 160).map((g, i) => `<div class="queue-item"><span class="queue-num">#${String(i + 1).padStart(3, "0")}</span><span class="queue-files" title="${g.files.map((f) => f.name).join(" | ")}">${g.files.map((f) => f.name).join(" &middot; ")}</span><span class="queue-state">${T.ready}</span></div>`).join("");
}

function acceptFiles(list) {
  selectedFiles = sortByName([...list].filter(imageOk)); zipBlob = null;
  const gs = groups(selectedFiles);
  els.photoCount.textContent = selectedFiles.length; els.setCount.textContent = gs.length; els.doneCount.textContent = gs.length;
  els.processBtn.disabled = !gs.length; els.downloadBtn.disabled = true; els.queueHint.textContent = gs.length ? `${gs.length} ${T.set} ${T.ready}` : T.none;
  progress("hdr", 0, T.ready); renderQueue(gs);
  els.status.textContent = !selectedFiles.length ? T.noImg : !gs.length ? T.need3 : `${gs.length} ${T.set} ${T.ready}.`;
}

function acceptRaw(list) {
  selectedRawFiles = sortByName([...list].filter(rawOk)); rawZipBlob = null;
  els.rawCount.textContent = selectedRawFiles.length; els.rawDoneCount.textContent = selectedRawFiles.length; els.rawZipCount.textContent = "0";
  els.rawProcessBtn.disabled = !selectedRawFiles.length; els.rawDownloadBtn.disabled = true; progress("raw", 0, T.ready);
  els.rawStatus.textContent = selectedRawFiles.length ? `${selectedRawFiles.length} ${T.photo} ${T.ready}.` : T.noRaw;
}

function fake(kind) {
  clearInterval(kind === "raw" ? rawProgressTimer : progressTimer);
  let p = 8; progress(kind, p, T.upload);
  const id = setInterval(() => { p = Math.min(94, p + Math.max(0.45, (94 - p) * 0.035)); progress(kind, p, T.proc); }, 180);
  if (kind === "raw") rawProgressTimer = id; else progressTimer = id;
}

function stop(kind, msg, value = 100) {
  clearInterval(kind === "raw" ? rawProgressTimer : progressTimer);
  progress(kind, value, msg);
}

async function postZip(url, form, kind) {
  const r = await fetch(url, { method: "POST", body: form });
  if (!r.ok) {
    let m = kind === "raw" ? T.rawFail : T.fail;
    try { m = (await r.json()).error || m; } catch {}
    throw new Error(m);
  }
  return r.blob();
}

async function processHdr() {
  const gs = groups(selectedFiles); if (!gs.length) return;
  zipBlob = null; els.processBtn.disabled = true; els.downloadBtn.disabled = true; els.status.textContent = T.hdrRun; fake("hdr");
  const fd = new FormData(); selectedFiles.forEach((f) => fd.append("photos", f, f.webkitRelativePath || f.name));
  fd.append("lens_correction", els.lensCorrection.checked ? "1" : "0"); fd.append("shift_correction", els.shiftCorrection.checked ? "1" : "0");
  try { zipBlob = await postZip("/api/merge", fd, "hdr"); stop("hdr", T.done); els.downloadBtn.disabled = false; els.status.textContent = `${gs.length} ${T.hdrOk}`; }
  catch (e) { stop("hdr", T.err, 0); els.status.textContent = e.message; }
  finally { els.processBtn.disabled = !gs.length; }
}

async function processRaw() {
  if (!selectedRawFiles.length) return;
  rawZipBlob = null; els.rawProcessBtn.disabled = true; els.rawDownloadBtn.disabled = true; els.rawStatus.textContent = T.rawInfo; fake("raw");
  const fd = new FormData(); selectedRawFiles.forEach((f) => fd.append("raw_photos", f, f.webkitRelativePath || f.name));
  try { rawZipBlob = await postZip("/api/raw", fd, "raw"); stop("raw", T.done); els.rawZipCount.textContent = "1"; els.rawDownloadBtn.disabled = false; els.rawStatus.textContent = `${selectedRawFiles.length} ${T.rawOk}`; }
  catch (e) { stop("raw", T.err, 0); els.rawStatus.textContent = e.message; }
  finally { els.rawProcessBtn.disabled = !selectedRawFiles.length; }
}

function save(blob, name) {
  if (!blob) return;
  const a = document.createElement("a"), u = URL.createObjectURL(blob);
  a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 1000);
}

function clearHdr() {
  selectedFiles = []; zipBlob = null; els.fileInput.value = ""; els.folderInput.value = ""; els.lensCorrection.checked = false; els.shiftCorrection.checked = false;
  els.photoCount.textContent = "0"; els.setCount.textContent = "0"; els.doneCount.textContent = "0"; els.queueHint.textContent = T.none; els.queueList.innerHTML = "";
  els.processBtn.disabled = true; els.downloadBtn.disabled = true; progress("hdr", 0, T.ready); els.status.textContent = T.wait;
}

function clearRaw() {
  selectedRawFiles = []; rawZipBlob = null; els.rawInput.value = ""; els.rawCount.textContent = "0"; els.rawDoneCount.textContent = "0"; els.rawZipCount.textContent = "0";
  els.rawProcessBtn.disabled = true; els.rawDownloadBtn.disabled = true; progress("raw", 0, T.ready); els.rawStatus.textContent = T.rawInfo;
}

els.fileInput.addEventListener("change", (e) => acceptFiles(e.target.files || []));
els.folderInput.addEventListener("change", (e) => acceptFiles(e.target.files || []));
els.folderBtn.addEventListener("click", () => (document.body.classList.contains("raw-mode") ? els.rawInput : els.folderInput).click());
els.hdrModeBtn.addEventListener("click", () => setMode(false));
els.rawModeBtn.addEventListener("click", () => setMode(true));
els.processBtn.addEventListener("click", processHdr);
els.downloadBtn.addEventListener("click", () => save(zipBlob, "real-estate-hdr-results.zip"));
els.clearBtn.addEventListener("click", clearHdr);
els.rawInput.addEventListener("change", (e) => acceptRaw(e.target.files || []));
els.rawProcessBtn.addEventListener("click", processRaw);
els.rawDownloadBtn.addEventListener("click", () => save(rawZipBlob, "raw-auto-results.zip"));
els.rawClearBtn.addEventListener("click", clearRaw);

for (const [zone, fn] of [[els.dropZone, acceptFiles], [els.rawDropZone, acceptRaw]]) {
  ["dragenter", "dragover"].forEach((n) => zone.addEventListener(n, (e) => { e.preventDefault(); zone.classList.add("is-dragging"); }));
  ["dragleave", "drop"].forEach((n) => zone.addEventListener(n, (e) => { e.preventDefault(); zone.classList.remove("is-dragging"); }));
  zone.addEventListener("drop", (e) => fn(e.dataTransfer?.files || []));
}
