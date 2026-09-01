/* moxruby.com - window manager + desktop shell */
(function () {
  "use strict";
  var A = window.MoxApps || {};
  // Order + which appear on desktop / start menu
  var ORDER = ["precons", "packbuilder", "packimages", "rotisserie", "links", "about", "readme"];
  var DESKTOP = ["computer", "precons", "packbuilder", "packimages", "rotisserie", "links", "readme", "recycle"];

  var desktop = document.getElementById("desktop");
  var deskIcons = document.getElementById("deskIcons");
  var tasklist = document.getElementById("tasklist");
  var startBtn = document.getElementById("startbtn");
  var startMenu = document.getElementById("startmenu");
  var startItems = document.getElementById("startItems");
  var wins = {}; // id -> {el, task, min}
  var zTop = 20;

  function glyphOf(id) { return (A[id] && A[id].glyph) || "📁"; }
  function nameOf(id) { return (A[id] && A[id].name) || id; }

  /* ---------- Desktop icons ---------- */
  var EXTRA = {
    computer: { name: "My Computer", glyph: "💻" },
    recycle: { name: "Recycle Bin", glyph: "🗑️" }
  };
  function iconName(id) { return (A[id] && A[id].name) || (EXTRA[id] && EXTRA[id].name) || id; }
  function iconGlyph(id) { return (A[id] && A[id].glyph) || (EXTRA[id] && EXTRA[id].glyph) || "📁"; }

  DESKTOP.forEach(function (id) {
    var d = document.createElement("div");
    d.className = "dicon"; d.dataset.app = id;
    d.innerHTML = '<span class="glyph">' + iconGlyph(id) + '</span><span class="lbl">' + iconName(id) + '</span>';
    var lastClick = 0;
    d.addEventListener("click", function (e) {
      document.querySelectorAll(".dicon.sel").forEach(function (x) { x.classList.remove("sel"); });
      d.classList.add("sel");
      var now = Date.now();
      if (now - lastClick < 400) openApp(id);
      lastClick = now;
    });
    d.addEventListener("dblclick", function () { openApp(id); });
    deskIcons.appendChild(d);
  });
  desktop.addEventListener("mousedown", function (e) {
    if (e.target === desktop || e.target === deskIcons)
      document.querySelectorAll(".dicon.sel").forEach(function (x) { x.classList.remove("sel"); });
  });

  /* ---------- Start menu ---------- */
  ORDER.forEach(function (id) {
    var i = document.createElement("div");
    i.className = "smi";
    i.innerHTML = '<span class="g">' + glyphOf(id) + '</span>' + nameOf(id);
    i.addEventListener("click", function () { closeStart(); openApp(id); });
    startItems.appendChild(i);
  });
  var sep = document.createElement("div"); sep.className = "smi sep"; startItems.appendChild(sep);
  var shut = document.createElement("div");
  shut.className = "smi";
  shut.innerHTML = '<span class="g">⏻</span>Shut Down...';
  shut.addEventListener("click", function () { closeStart(); shutDown(); });
  startItems.appendChild(shut);

  function toggleStart() { startMenu.classList.toggle("show"); startBtn.classList.toggle("open", startMenu.classList.contains("show")); }
  function closeStart() { startMenu.classList.remove("show"); startBtn.classList.remove("open"); }
  startBtn.addEventListener("click", function (e) { e.stopPropagation(); toggleStart(); });
  document.addEventListener("click", function (e) { if (!startMenu.contains(e.target) && e.target !== startBtn) closeStart(); });

  function shutDown() {
    var w = createWindow({ id: "__shutdown", title: "Shut Down Windows", glyph: "⏻", width: 340, height: 150, noTask: true });
    w.body.classList.add("gray");
    w.body.innerHTML = '<div style="display:flex;gap:14px;padding:6px 4px"><div style="font-size:34px">⏻</div>' +
      '<div>Are you sure you want to<br>quit Old School Magic?<br><br><i>(It is now safe to draft your deck.)</i></div></div>' +
      '<div class="row" style="justify-content:center;margin-top:10px">' +
      '<button class="btn95" id="sdYes">Yes</button><button class="btn95" id="sdNo">No</button></div>';
    center(w.el);
    w.body.querySelector("#sdNo").onclick = function () { closeWindow("__shutdown"); };
    w.body.querySelector("#sdYes").onclick = function () {
      document.body.innerHTML = '<div style="background:#000080;color:#fff;font-family:MS Sans Serif,Tahoma,sans-serif;' +
        'height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;font-size:18px">' +
        'It’s now safe to turn off<br>your computer.<br><br><span style="font-size:13px;opacity:.8">(Refresh to reboot.)</span></div>';
    };
  }

  /* ---------- Window manager ---------- */
  function createWindow(opts) {
    var el = document.createElement("div");
    el.className = "win";
    el.style.width = (opts.width || 420) + "px";
    if (opts.height) el.style.height = opts.height + "px";
    el.innerHTML =
      '<div class="titlebar"><span class="ico">' + (opts.glyph || "📁") + '</span>' +
      '<span class="t">' + opts.title + '</span><span class="tb-btns">' +
      '<button class="tbtn min" title="Minimize">_</button>' +
      '<button class="tbtn max" title="Maximize">□</button>' +
      '<button class="tbtn close" title="Close">✕</button></span></div>' +
      '<div class="body"></div><div class="resizer"></div>';
    desktop.appendChild(el);
    var body = el.querySelector(".body");
    var obj = { el: el, body: body, id: opts.id, min: false };
    wins[opts.id] = obj;

    // position
    var n = Object.keys(wins).length;
    el.style.left = (30 + (n % 6) * 26) + "px";
    el.style.top = (18 + (n % 6) * 22) + "px";

    focus(opts.id);
    el.addEventListener("mousedown", function () { focus(opts.id); });

    // buttons
    el.querySelector(".close").onclick = function (e) { e.stopPropagation(); closeWindow(opts.id); };
    el.querySelector(".min").onclick = function (e) { e.stopPropagation(); minimize(opts.id); };
    var maxBtn = el.querySelector(".max");
    maxBtn.onclick = function (e) { e.stopPropagation(); el.classList.toggle("max"); focus(opts.id); };

    // drag
    var tb = el.querySelector(".titlebar");
    tb.addEventListener("mousedown", function (e) {
      if (e.target.classList.contains("tbtn")) return;
      if (el.classList.contains("max")) return;
      var r = el.getBoundingClientRect(); var ox = e.clientX - r.left, oy = e.clientY - r.top;
      function mv(ev) {
        var x = Math.max(-r.width + 60, Math.min(ev.clientX - ox, window.innerWidth - 60));
        var y = Math.max(0, Math.min(ev.clientY - oy, window.innerHeight - 34 - 22));
        el.style.left = x + "px"; el.style.top = y + "px";
      }
      function up() { document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); }
      document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up);
    });
    tb.addEventListener("dblclick", function () { maxBtn.onclick({ stopPropagation: function () {} }); });

    // resize
    var rz = el.querySelector(".resizer");
    rz.addEventListener("mousedown", function (e) {
      e.stopPropagation(); e.preventDefault();
      var r = el.getBoundingClientRect(); var ox = e.clientX, oy = e.clientY, ow = r.width, oh = r.height;
      function mv(ev) { el.style.width = Math.max(240, ow + ev.clientX - ox) + "px"; el.style.height = Math.max(140, oh + ev.clientY - oy) + "px"; }
      function up() { document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); }
      document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up);
    });

    // taskbar button
    if (!opts.noTask) {
      var t = document.createElement("div");
      t.className = "taskbtn";
      t.innerHTML = '<span>' + (opts.glyph || "📁") + '</span><span>' + opts.title + '</span>';
      t.addEventListener("click", function () {
        if (obj.min) { restore(opts.id); }
        else if (el.classList.contains("active")) { minimize(opts.id); }
        else { focus(opts.id); }
      });
      tasklist.appendChild(t);
      obj.task = t;
    }
    return obj;
  }

  function focus(id) {
    Object.keys(wins).forEach(function (k) {
      wins[k].el.classList.remove("active");
      if (wins[k].task) wins[k].task.classList.remove("active");
    });
    var w = wins[id]; if (!w) return;
    w.min = false; w.el.style.display = "flex"; w.el.classList.add("active");
    w.el.style.zIndex = ++zTop;
    if (w.task) w.task.classList.add("active");
  }
  function minimize(id) { var w = wins[id]; if (!w) return; w.min = true; w.el.style.display = "none"; w.el.classList.remove("active"); if (w.task) w.task.classList.remove("active"); }
  function restore(id) { focus(id); }
  function closeWindow(id) {
    var w = wins[id]; if (!w) return;
    w.el.remove(); if (w.task) w.task.remove(); delete wins[id];
  }
  function center(el) {
    el.style.left = Math.max(0, (window.innerWidth - el.offsetWidth) / 2) + "px";
    el.style.top = Math.max(0, (window.innerHeight - 34 - el.offsetHeight) / 2) + "px";
  }

  function openApp(id) {
    if (wins[id]) { restore(id); return; }
    var app = A[id];
    if (id === "computer") { openApp("about"); return; }
    if (id === "recycle") { emptyBin(); return; }
    if (!app) return;
    var w = createWindow({ id: id, title: app.title || app.name, glyph: app.glyph, width: app.width, height: app.height });
    try { app.build(w, api); } catch (e) { w.body.innerHTML = "<p>App error: " + e.message + "</p>"; }
  }

  function emptyBin() {
    var w = createWindow({ id: "recycle", title: "Recycle Bin", glyph: "🗑️", width: 320, height: 160 });
    w.body.innerHTML = '<div class="uc"><p>The Recycle Bin contains:</p>' +
      '<p class="mono">- 1x City in a Bottle<br>- 4x Sinkhole (misplayed)</p>' +
      '<p><i>Careful, someone might Regrowth these.</i></p></div>';
    center(w.el);
  }

  /* ---------- Clock ---------- */
  function tick() {
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? "PM" : "AM"; h = h % 12; if (h === 0) h = 12;
    document.getElementById("clock").textContent = h + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  }
  tick(); setInterval(tick, 15000);

  /* ---------- Card hover preview (shared) ---------- */
  var pop = document.getElementById("cardpop");
  var api = {
    open: openApp, close: closeWindow, center: center, createWindow: createWindow,
    cardHover: function (imgEl, url) {
      imgEl.addEventListener("mousemove", function (e) {
        if (!url) return;
        pop.src = url; pop.style.display = "block";
        var x = e.clientX + 18, y = e.clientY + 18;
        if (x + 230 > window.innerWidth) x = e.clientX - 238;
        if (y + 310 > window.innerHeight) y = window.innerHeight - 320;
        pop.style.left = x + "px"; pop.style.top = y + "px";
      });
      imgEl.addEventListener("mouseleave", function () { pop.style.display = "none"; });
    }
  };
  window.MoxOS = api;

  /* ---------- Boot ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () { openApp("readme"); }, 250);
  });
})();
