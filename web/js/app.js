const state = { data: null, scene: "all", q: "", episodes: [], episodeId: "moon" };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function toast(msg) {
  const el = $("#toast");
  el.hidden = false;
  el.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.hidden = true; }, 1600);
}

async function copy(text) {
  await navigator.clipboard.writeText(text);
  toast("Skopiowane");
}

function imgSrc(path) {
  return "/" + path.replaceAll("\\", "/");
}

function pdfHref(d) {
  return "/" + (d.pdf || "scripts/the_ghost_of_glowalot_script.pdf").replaceAll("\\", "/");
}

function kindBadge(s) {
  if (s.kind === "2d") return `<span class="pill teal">2D EKRAN</span>`;
  if (s.kind === "3d") return `<span class="pill purple">3D LAB</span>`;
  return "";
}

function renderEpisodePicker() {
  const host = $("#episodePicker");
  if (!host) return;
  host.innerHTML = state.episodes.map((e) => `
    <button class="chip ${e.id === state.episodeId ? "on" : ""}" data-ep="${e.id}">
      ${e.code} · ${e.title}
    </button>
  `).join("");
  $$("#episodePicker [data-ep]").forEach((b) => {
    b.onclick = () => loadEpisode(b.dataset.ep);
  });
}

function renderOverview(d) {
  const isExplainer = d.format === "lab_explainer";
  const n2d = (d.shots || []).filter((s) => s.kind === "2d").length;
  const n3d = (d.shots || []).length - n2d;

  $("#topMeta").innerHTML = `
    <span class="pill">${d.code}</span>
    <span class="pill">${d.runtime}</span>
    <span class="pill">${d.shots.length} ujęć</span>
    <span class="pill">${d.scenes.length} scen</span>
    ${isExplainer ? `<span class="pill">2D×${n2d} · 3D×${n3d}</span>` : ""}
  `;

  $("#view-overview").innerHTML = `
    <div class="hero-grid">
      <article class="card">
        <h2>${d.series} — ${d.title}</h2>
        <p class="logline">${d.logline}</p>
        <p class="moral">${d.moral}</p>
        <div class="timeline" title="akty">${(d.acts || []).map(() => "<i></i>").join("")}</div>
        <p class="hint">${d.tone}${d.age ? ` · Wiek: ${d.age}` : ""}${d.cast ? ` · Cast: ${d.cast.join(", ")}` : ""}</p>
        <div class="row-btns">
          <a class="btn primary" href="${pdfHref(d)}" target="_blank">Otwórz PDF</a>
          <button class="btn" id="copyAll">Kopiuj wszystkie prompty</button>
          ${isExplainer ? `<button class="btn ghost" id="copy2d">Kopiuj tylko 2D</button>` : ""}
        </div>
      </article>
      <article class="card">
        <h2>Akty</h2>
        <div class="acts">
          ${(d.acts || []).map((a) => `<div class="act"><b>ACT ${a.id}</b> <span>${a.name}</span> <span>${a.tc}</span></div>`).join("")}
        </div>
        <p class="hint">${isExplainer
          ? "Ujęcia oznaczone 2D EKRAN to grafiki na monitorze w labie — pod czystą animację 2D. Reszta to Bravo + Pipi w 3D."
          : "Adventure episode · filmowe kadry 3D."}</p>
      </article>
    </div>
    <div class="stats">
      <div class="stat card"><strong>${d.runtime}</strong><span>runtime</span></div>
      <div class="stat card"><strong>${d.shots.length}</strong><span>klatki</span></div>
      <div class="stat card"><strong>${d.scenes.length}</strong><span>sceny</span></div>
      <div class="stat card"><strong>${(d.characters || []).length}</strong><span>postacie</span></div>
    </div>
  `;
  $("#copyAll").onclick = () => copy(d.shots.map((s) => `### ${s.id} [${(s.kind || "3d").toUpperCase()}] ${s.title}\n${s.prompt}\n\nNEGATIVE: ${s.negative}`).join("\n\n"));
  const c2 = $("#copy2d");
  if (c2) {
    c2.onclick = () => copy(d.shots.filter((s) => s.kind === "2d").map((s) => `### ${s.id} ${s.title}\n${s.prompt}\n\nNEGATIVE: ${s.negative}`).join("\n\n"));
  }
}

function renderScript(d) {
  const nav = d.scenes.map((s) => `<button class="chip" data-jump="${s.id}">${s.id} · ${s.tc}</button>`).join("");
  const body = d.scenes.map((scene) => {
    const blocks = scene.blocks.map((b) => {
      if (b.type === "action" && b.text === "THE END") return `<p class="theend">THE END</p>`;
      if (b.type === "action") return `<p class="action">${b.text}</p>`;
      if (b.type === "char") return `<p class="char">${b.name}</p>`;
      if (b.type === "paren") return `<p class="paren">${b.text}</p>`;
      if (b.type === "dial") return `<p class="dial">${b.text}</p>`;
      return "";
    }).join("");
    return `<article id="scene-${scene.id}"><h3>${scene.heading}<br>${scene.tc} · ACT ${scene.act}</h3>${blocks}</article>`;
  }).join("");

  $("#view-script").innerHTML = `
    <div class="scene-nav">${nav}</div>
    <div class="screenplay">
      <div class="ep-head">
        <div>${d.series.toUpperCase()}</div>
        <strong>${d.title}</strong>
        <div>Runtime ${d.runtime}</div>
      </div>
      ${body}
    </div>
  `;
  $$(".scene-nav .chip").forEach((c) => {
    c.onclick = () => document.getElementById(`scene-${c.dataset.jump}`).scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const GENERATED_FRAMES = new Set([
  "S01", "S02", "S03", "S04", "S05",
  "S06", "S07", "S08", "S09", "S10",
]);

function shotCard(s) {
  const refs = (s.refs || []).map((p) => `
    <figure>
      <img src="${imgSrc(p)}" alt="${p}" />
      <div class="path">${p}</div>
    </figure>
  `).join("");
  const generatedFrame = GENERATED_FRAMES.has(s.id)
    ? `<a class="generated-frame" href="/generated/shots/${s.id}.png" target="_blank">
        <img src="/generated/shots/${s.id}.png" alt="Wygenerowana klatka ${s.id}: ${s.title}" />
        <span><b>Wygenerowana klatka</b><small>Kliknij, aby otworzyć pełny rozmiar</small></span>
      </a>`
    : "";
  return `
    <article class="card shot" data-scene="${s.scene}" data-kind="${s.kind || "3d"}">
      <div class="clapper">
        <div class="sid">${s.id}</div>
        <div class="size">${s.size}</div>
        <div class="tc">${s.tc_in} → ${s.tc_out}</div>
        <div class="tc">${s.dur}s · scena ${s.scene}</div>
        <div style="margin-top:8px">${kindBadge(s)}</div>
      </div>
      <div>
        <h3>${s.title}</h3>
        <div class="meta">${s.dialogue || "bez dialogu"}</div>
        ${generatedFrame}
        <div class="camera"><b>${s.kind === "2d" ? "Grafika 2D / ekran" : "Kamera / blocking"}</b><br>${s.camera}</div>
        <div class="refs">${refs || (s.kind === "2d" ? "<span class='hint'>Czysta grafika 2D na monitor — bez referencji postaci.</span>" : "<span class='hint'>Brak płyty referencyjnej.</span>")}</div>
        <div class="row-btns">
          <button class="btn primary" data-copy-prompt>Kopiuj prompt</button>
          <button class="btn" data-copy-neg>Kopiuj negative</button>
        </div>
        <pre class="prompt">${s.prompt}</pre>
        <pre class="neg">NEGATIVE: ${s.negative}</pre>
      </div>
    </article>
  `;
}

function renderShots(d) {
  const scenes = ["all", ...d.scenes.map((s) => s.id)];
  const has2d = d.shots.some((s) => s.kind === "2d");
  $("#view-shots").innerHTML = `
    <div class="filters">
      ${scenes.map((id) => `<button class="chip ${id === state.scene ? "on" : ""}" data-scene="${id}">${id === "all" ? "Wszystkie sceny" : "Scena " + id}</button>`).join("")}
      ${has2d ? `
        <button class="chip" data-kindf="all">Wszystkie typy</button>
        <button class="chip" data-kindf="3d">Tylko 3D lab</button>
        <button class="chip" data-kindf="2d">Tylko 2D ekran</button>
      ` : ""}
      <input class="search" id="shotSearch" placeholder="Szukaj ujęcia, postaci, dialogu..." value="${state.q}" />
    </div>
    <p class="hint">${has2d
      ? "Prompty 2D EKRAN = animacja na monitorze w labie. Prompty 3D LAB = Bravo + Pipi w sekretnym laboratorium."
      : "Każdy prompt ma lock postaci + ścieżki referencji."}</p>
    <div class="shots" id="shotList"></div>
  `;
  state.kindFilter = state.kindFilter || "all";
  paintShotList(d);
  $$("#view-shots [data-scene]").forEach((b) => {
    b.onclick = () => { state.scene = b.dataset.scene; renderShots(d); };
  });
  $$("#view-shots [data-kindf]").forEach((b) => {
    if (b.dataset.kindf === state.kindFilter) b.classList.add("on");
    b.onclick = () => { state.kindFilter = b.dataset.kindf; renderShots(d); };
  });
  $("#shotSearch").oninput = (e) => { state.q = e.target.value; paintShotList(d); };
}

function paintShotList(d) {
  const q = state.q.trim().toLowerCase();
  const kf = state.kindFilter || "all";
  const list = d.shots.filter((s) => {
    if (state.scene !== "all" && s.scene !== state.scene) return false;
    if (kf !== "all" && (s.kind || "3d") !== kf) return false;
    if (!q) return true;
    return (s.title + s.prompt + (s.dialogue || "") + s.id).toLowerCase().includes(q);
  });
  $("#shotList").innerHTML = list.map(shotCard).join("") || "<p class='hint'>Nic nie pasuje.</p>";
  $$("#shotList [data-copy-prompt]").forEach((b) => {
    b.onclick = () => copy(b.closest(".shot").querySelector(".prompt").textContent);
  });
  $$("#shotList [data-copy-neg]").forEach((b) => {
    b.onclick = () => copy(b.closest(".shot").querySelector(".neg").textContent.replace(/^NEGATIVE:\s*/, ""));
  });
}

function renderBible(d) {
  const chars = d.characters.map((c) => `
    <article class="card">
      <h2>${c.name}</h2>
      <p class="moral">${c.role}</p>
      <p>${c.blurb}</p>
      <div class="thumbs">${(c.images || []).map((p) => `<img src="${imgSrc(p)}" alt="${c.name}" title="${p}">`).join("") || "<p class='hint'>Brak renderu.</p>"}</div>
    </article>
  `).join("");
  const locs = d.locations.map((l) => `
    <article class="card">
      <h2>${l.name}</h2>
      <p>${l.note}</p>
      <div class="thumbs">${(l.images || []).map((p) => `<img src="${imgSrc(p)}" alt="${l.name}">`).join("") || "<p class='hint'>Lokacja do wymyślenia.</p>"}</div>
    </article>
  `).join("");
  $("#view-bible").innerHTML = `
    <h2 style="font-family:Fredoka,sans-serif">Postacie</h2>
    <div class="bible-grid">${chars}</div>
    <h2 style="font-family:Fredoka,sans-serif;margin-top:22px">Lokacje</h2>
    <div class="bible-grid">${locs}</div>
  `;
}

function bindTabs() {
  $$(".tab").forEach((t) => {
    t.onclick = () => {
      $$(".tab").forEach((x) => x.classList.remove("on"));
      $$(".view").forEach((x) => x.classList.remove("on"));
      t.classList.add("on");
      $(`#view-${t.dataset.view}`).classList.add("on");
    };
  });
}

function paintAll(d) {
  state.data = d;
  state.scene = "all";
  state.q = "";
  state.kindFilter = "all";
  $("#title").textContent = d.title;
  document.title = `Widgeteers Studio — ${d.title}`;
  renderOverview(d);
  renderScript(d);
  renderShots(d);
  renderBible(d);
}

async function loadEpisode(id) {
  const meta = state.episodes.find((e) => e.id === id) || state.episodes[0];
  if (!meta) throw new Error("Brak katalogu odcinków");
  state.episodeId = meta.id;
  const d = await (await fetch(meta.file)).json();
  renderEpisodePicker();
  paintAll(d);
  const url = new URL(window.location.href);
  url.searchParams.set("ep", meta.id);
  history.replaceState({}, "", url);
}

async function boot() {
  bindTabs();
  try {
    state.episodes = await (await fetch("data/episodes.json")).json();
  } catch {
    state.episodes = [{ id: "ghost", title: "The Ghost of Glow-A-Lot", code: "EP05", file: "data/episode.json" }];
  }
  const want = new URLSearchParams(location.search).get("ep") || "moon";
  await loadEpisode(want);
}

boot().catch((err) => {
  document.body.insertAdjacentHTML("beforeend", `<p class="hint" style="padding:24px">Błąd ładowania studia: ${err}</p>`);
});
