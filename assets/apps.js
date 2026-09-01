/* moxruby.com - applications */
(function () {
  "use strict";
  var Scry = window.Scry;

  // ---- Atlantic 93/94 (NEOS) rules ----
  var ATLANTIC = {
    sets: ["Alpha", "Beta", "Arabian Nights", "Antiquities", "Legends", "The Dark", "Fallen Empires"],
    setCodes: ["lea", "leb", "arn", "atq", "leg", "drk", "fem"],
    banned: ["Bronze Tablet", "Contract from Below", "Darkpact", "Demonic Attorney", "Jeweled Bird", "Rebirth", "Tempest Efreet"],
    restricted: ["Ancestral Recall", "Balance", "Black Lotus", "Braingeyser", "Chaos Orb", "Channel", "Demonic Tutor",
      "Library of Alexandria", "Mana Drain", "Mind Twist", "Mox Emerald", "Mox Jet", "Mox Pearl", "Mox Ruby", "Mox Sapphire",
      "Regrowth", "Sol Ring", "Strip Mine", "Time Walk", "Timetwister", "Wheel of Fortune"]
  };
  var BASICS = { "plains": 1, "island": 1, "swamp": 1, "mountain": 1, "forest": 1 };
  function low(s) { return s.toLowerCase().trim(); }
  var bannedL = ATLANTIC.banned.map(low), restrictedL = ATLANTIC.restricted.map(low);

  function checkLegality(main) {
    var issues = [], total = 0;
    main.forEach(function (row) {
      var q = row[0], name = row[1], nl = low(name); total += q;
      if (bannedL.indexOf(nl) >= 0) issues.push(name + " is BANNED");
      else if (restrictedL.indexOf(nl) >= 0 && q > 1) issues.push(name + " is restricted (max 1, deck has " + q + ")");
      else if (q > 4 && !BASICS[nl]) issues.push(q + "x " + name + " exceeds the 4-of limit");
    });
    if (total < 60) issues.push("Only " + total + " cards (minimum 60)");
    return { ok: issues.length === 0, issues: issues, total: total };
  }

  // ---- helpers ----
  function h(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pip(colors) {
    var m = { W: "#f8f6d8", U: "#aae0fa", B: "#cbc2bf", R: "#f9aa8f", G: "#9bd3ae" }, o = "";
    (colors && colors.length ? colors : ["C"]).forEach(function (c) {
      o += '<span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:' + (m[c] || "#ccc") + ';border:1px solid #555;margin-right:2px"></span>';
    });
    return o;
  }

  // =====================================================================
  var Apps = {};

  // ---------- README / Welcome ----------
  Apps.readme = {
    name: "Read Me First", glyph: "📄", title: "Welcome.txt - Notepad", width: 460, height: 400,
    build: function (w) {
      w.body.innerHTML =
        '<div class="marquee"><span>★ Welcome to MOX RUBY ★ your Old School Magic 93/94 command center ★ NEOS / Atlantic rules ★ best viewed in Netscape Navigator at 800x600 ★</span></div>' +
        '<div class="uc"><img src="assets/gifs/under-construction.gif" alt="under construction" height="30"> ' +
        '<span class="blink" style="color:#c00;font-weight:bold">NEW!</span> ' +
        '<img src="assets/gifs/under-construction.gif" alt="under construction" height="30"></div>' +
        '<h3 style="margin:6px 0">Mox Ruby</h3>' +
        '<p>A little corner of the World Wide Web for <b>Old School Magic: The Gathering</b> (the good stuff, 1993-94). ' +
        'Everything here runs on the <b>NEOS / Atlantic 93/94</b> card pool.</p>' +
        '<p><b>Double-click a desktop icon</b> or hit <b>Start</b> to get going:</p>' +
        '<ul style="margin:6px 0 6px 18px;padding:0">' +
        '<li><b>Old School Precons</b>: classic archetype decklists with real card images and an Atlantic legality checker</li>' +
        '<li><b>Pack Builder</b>: crack a random virtual booster from any legal set</li>' +
        '<li><b>Rotisserie Draft</b>: run a snake draft with your playgroup</li>' +
        '<li><b>Pack Images</b>: the old set art</li>' +
        '<li><b>OS MtG Links</b>: the old-school web ring</li></ul>' +
        '<p class="row" style="justify-content:space-between;border-top:1px solid #999;padding-top:6px;margin-top:8px">' +
        '<span>You are visitor <span class="counter"><b>0</b><b>0</b><b>4</b><b>0</b><b>4</b></span></span>' +
        '<span class="muted">Site by <a href="https://tedkwartler.com/" target="_blank" rel="noopener">Ted Kwartler</a></span></p>';
      // random-ish visitor counter
      var n = 40000 + Math.floor(Math.random() * 9999);
      var cs = w.body.querySelectorAll(".counter b"); String(n).split("").forEach(function (d, i) { if (cs[i]) cs[i].textContent = d; });
      window.MoxOS.center(w.el);
    }
  };

  // ---------- About ----------
  Apps.about = {
    name: "About Mox Ruby", glyph: "💎", title: "About Mox Ruby", width: 360, height: 250,
    build: function (w) {
      w.body.classList.add("gray");
      w.body.innerHTML =
        '<div style="text-align:center;padding:6px">' +
        '<svg width="46" height="46"><use href="#mox-gem"/></svg>' +
        '<h3 style="margin:6px 0 2px">Mox Ruby&trade;</h3>' +
        '<p style="margin:0" class="muted">Old School Magic 93/94 Desktop</p>' +
        '<p style="margin:8px 0 0;font-size:12px">Version 9.4 &middot; NEOS / Atlantic ruleset</p>' +
        '<hr><p style="font-size:12px">A retro toolkit for the 93/94 community.<br>Card data &amp; images courtesy of <a href="https://scryfall.com" target="_blank" rel="noopener">Scryfall</a>.</p>' +
        '<p style="font-size:12px">Built by <a href="https://tedkwartler.com/" target="_blank" rel="noopener">Ted Kwartler</a>.</p>' +
        '<button class="btn95" style="margin-top:6px" onclick="window.MoxOS.close(\'about\')">OK</button></div>';
      window.MoxOS.center(w.el);
    }
  };

  // ---------- Old School Precons ----------
  Apps.precons = {
    name: "Old School Precons", glyph: "🃏", title: "Old School Precons", width: 560, height: 460,
    build: function (w) {
      w.body.innerHTML = '<p class="muted">Loading decklists...</p>';
      fetch("data/decks.json").then(function (r) { return r.json(); }).then(function (data) {
        renderList(w, data.decks);
      }).catch(function () { w.body.innerHTML = "<p>Could not load decks.json.</p>"; });
    }
  };
  function renderList(w, decks) {
    var wrap = h('<div></div>');
    wrap.appendChild(h('<p>Classic <b>Old School 93/94</b> archetypes, legal for the <b>NEOS / Atlantic</b> pool. Double-click a deck to open it. <span class="muted">(Community/archetype lists, not an official product.)</span></p>'));
    var grid = h('<div class="deck-list"></div>');
    decks.forEach(function (d, i) {
      var leg = checkLegality(d.main);
      var tile = h('<div class="deck-tile"><div class="dt-ico">🃏</div><b>' + esc(d.name) + '</b>' +
        '<div class="pips">' + pip(d.colors) + '</div>' +
        '<small>' + esc(d.archetype || "") + '</small><br>' +
        '<span class="legal-badge ' + (leg.ok ? "legal-ok" : "legal-no") + '">' + (leg.ok ? "Atlantic legal" : "check rules") + '</span></div>');
      tile.addEventListener("click", function () { openDeck(d); });
      grid.appendChild(tile);
    });
    wrap.appendChild(grid);
    w.body.innerHTML = ""; w.body.appendChild(wrap);
  }

  function openDeck(d) {
    var id = "deck_" + Scry.key(d.name).replace(/[^a-z0-9]/g, "");
    if (document.querySelector('[data-win="' + id + '"]')) { window.MoxOS.open(id); return; }
    var w = window.MoxOS.createWindow({ id: id, title: d.name, glyph: "🃏", width: 620, height: 500 });
    w.el.setAttribute("data-win", id);
    var leg = checkLegality(d.main);
    var total = leg.total;
    // mana curve
    var body = h('<div></div>');
    body.appendChild(h('<div class="row" style="justify-content:space-between"><h3 style="margin:0">' + esc(d.name) + ' <span class="pips">' + pip(d.colors) + '</span></h3>' +
      '<span class="legal-badge ' + (leg.ok ? "legal-ok" : "legal-no") + '">' + (leg.ok ? "LEGAL for Atlantic 93/94" : "NOT legal") + '</span></div>'));
    body.appendChild(h('<p class="muted" style="margin:4px 0">' + esc(d.archetype || "") + (d.author ? " &middot; by " + esc(d.author) : "") + " &middot; " + total + " cards</p>"));
    if (d.notes) body.appendChild(h('<p style="margin:4px 0;font-size:12px">' + esc(d.notes) + "</p>"));
    if (!leg.ok) body.appendChild(h('<div class="sunken" style="padding:6px;color:#a00;font-size:12px">⚠ ' + leg.issues.map(esc).join("<br>") + "</div>"));

    var tabs = h('<div class="menubar" style="margin-top:6px"><span data-t="list">Decklist</span><span data-t="cards">Card Images</span><span data-t="stats">Stats</span></div>');
    var pane = h('<div style="margin-top:6px"></div>');
    body.appendChild(tabs); body.appendChild(pane);
    w.body.innerHTML = ""; w.body.appendChild(body);

    function renderTab(t) {
      pane.innerHTML = "";
      if (t === "list") {
        var mk = function (title, rows) {
          if (!rows || !rows.length) return;
          var count = rows.reduce(function (a, r) { return a + r[0]; }, 0);
          var html = '<div><b>' + title + ' (' + count + ')</b><table class="deck"><tbody>';
          rows.forEach(function (r) {
            var nl = low(r[1]);
            var tag = restrictedL.indexOf(nl) >= 0 ? ' <span style="color:#b8860b">\u25c6R</span>' : (bannedL.indexOf(nl) >= 0 ? ' <span style="color:#a00">\u2716B</span>' : "");
            html += '<tr><td class="qty">' + r[0] + '</td><td><a data-card="' + esc(r[1]) + '">' + esc(r[1]) + '</a>' + tag + '</td></tr>';
          });
          html += '</tbody></table></div>';
          var sec = h(html);
          sec.querySelectorAll('a[data-card]').forEach(function (a) { a.addEventListener('click', function () { showSingle(a.getAttribute('data-card')); }); });
          pane.appendChild(sec);
        };
        mk("Mainboard", d.main); mk("Sideboard", d.side);
        pane.appendChild(h('<p class="muted" style="font-size:11px;margin-top:6px">◆R = restricted (max 1) &middot; click a card name to preview</p>'));
      } else if (t === "cards") {
        pane.appendChild(h('<p class="muted">Fetching original-art printings from Scryfall...</p>'));
        var names = d.main.map(function (r) { return r[1]; });
        Scry.getCards(names).then(function (map) {
          pane.innerHTML = "";
          var grid = h('<div class="card-grid"></div>');
          d.main.forEach(function (r) {
            var c = map[Scry.key(r[1])];
            var img = h('<img loading="lazy" alt="' + esc(r[1]) + '" title="' + r[0] + "x " + esc(r[1]) + '" src="' + (c && c.small ? c.small : "") + '">');
            if (c && c.normal) window.MoxOS.cardHover(img, c.normal);
            if (!c || c.notFound) { img.style.padding = "8px"; img.alt = "(" + r[1] + " not found)"; }
            grid.appendChild(img);
          });
          pane.appendChild(grid);
        });
      } else {
        // stats: mana curve of nonland spells
        var buckets = [0, 0, 0, 0, 0, 0, 0], lands = 0;
        var names = d.main.map(function (r) { return r[1]; });
        pane.appendChild(h('<p class="muted">Computing curve...</p>'));
        Scry.getCards(names).then(function (map) {
          d.main.forEach(function (r) {
            var c = map[Scry.key(r[1])]; if (!c) return;
            if (/land/i.test(c.type_line)) { lands += r[0]; return; }
            var cmc = Math.min(6, Math.round(c.cmc || 0));
            buckets[cmc] += r[0];
          });
          var max = Math.max(1, Math.max.apply(null, buckets));
          var curve = '<div class="curve">';
          buckets.forEach(function (v, i) {
            curve += '<div class="bar" style="height:' + (v / max * 100) + '%"><b>' + (v || "") + '</b><span>' + (i === 6 ? "6+" : i) + "</span></div>";
          });
          curve += "</div>";
          pane.innerHTML = '<b>Mana curve (nonland)</b>' + curve +
            '<p style="margin-top:22px"><b>Lands:</b> ' + lands + ' &middot; <b>Spells:</b> ' + (leg.total - lands) + '</p>' +
            '<p><b>Restricted cards used:</b> ' + d.main.filter(function (r) { return restrictedL.indexOf(low(r[1])) >= 0; }).map(function (r) { return r[1]; }).join(", ") || "none" + '</p>';
        });
      }
    }
    tabs.querySelectorAll("span").forEach(function (s) { s.addEventListener("click", function () { renderTab(s.dataset.t); }); });
    renderTab("list");
  }

  function showSingle(name) {
    var id = "card_" + Scry.key(name).replace(/[^a-z0-9]/g, "");
    if (document.querySelector('[data-win="' + id + '"]')) { window.MoxOS.open(id); return; }
    var w = window.MoxOS.createWindow({ id: id, title: name, glyph: "🃏", width: 250, height: 360 });
    w.el.setAttribute("data-win", id);
    w.body.innerHTML = '<p class="muted">Loading...</p>';
    Scry.getCards([name]).then(function (map) {
      var c = map[Scry.key(name)];
      if (c && c.normal) w.body.innerHTML = '<img src="' + c.normal + '" alt="' + esc(name) + '" style="width:100%;border-radius:8px"><p class="muted" style="font-size:11px;text-align:center">' + esc(c.set_name) + "</p>";
      else w.body.innerHTML = "<p>Card not found on Scryfall.</p>";
      window.MoxOS.center(w.el);
    });
  }

  // ---------- Pack Builder ----------
  var setPool = {};
  Apps.packbuilder = {
    name: "Pack Builder", glyph: "📦", title: "Pack Builder", width: 560, height: 480,
    build: function (w) {
      var setOpts = ATLANTIC.sets.map(function (s, i) { return '<option value="' + ATLANTIC.setCodes[i] + '">' + s + "</option>"; }).join("");
      w.body.innerHTML =
        '<fieldset class="g95"><legend>Crack a pack</legend>' +
        '<div class="row"><label>Set: <select class="field95" id="pbSet">' + setOpts + '</select></label>' +
        '<label>Cards: <input class="field95" id="pbSize" type="number" value="15" min="1" max="45" style="width:52px"></label>' +
        '<button class="btn95" id="pbGo">Open Pack</button></div>' +
        '<p class="muted" style="font-size:11px;margin:6px 0 0">Weighted by rarity. Old sets vary; this is a fun approximation.</p></fieldset>' +
        '<div id="pbOut"><div class="uc"><img src="assets/gifs/under-construction.gif" height="30"><p>Pick a set and open a pack!</p></div></div>';
      var out = w.body.querySelector("#pbOut");
      w.body.querySelector("#pbGo").onclick = function () {
        var code = w.body.querySelector("#pbSet").value, size = Math.max(1, Math.min(45, +w.body.querySelector("#pbSize").value || 15));
        out.innerHTML = '<p class="muted">Shuffling ' + code.toUpperCase() + '...</p>';
        loadSet(code).then(function (cards) {
          if (!cards.length) { out.innerHTML = "<p>No cards found for that set.</p>"; return; }
          var pack = buildPack(cards, size);
          var grid = h('<div class="card-grid"></div>');
          pack.forEach(function (c) {
            var img = h('<img loading="lazy" alt="' + esc(c.name) + '" title="' + esc(c.name) + " (" + c.rarity + ')" src="' + c.small + '">');
            if (c.normal) window.MoxOS.cardHover(img, c.normal);
            grid.appendChild(img);
          });
          out.innerHTML = "<p><b>" + pack.length + " cards</b> &middot; hover to zoom</p>";
          out.appendChild(grid);
        });
      };
    }
  };
  function loadSet(code) {
    if (setPool[code]) return Promise.resolve(setPool[code]);
    // fetch all pages
    var all = [];
    function page(url) {
      return fetch(url).then(function (r) { return r.ok ? r.json() : { data: [] }; }).then(function (j) {
        (j.data || []).forEach(function (c) { all.push(slimLite(c)); });
        if (j.has_more && j.next_page) return new Promise(function (res) { setTimeout(res, 90); }).then(function () { return page(j.next_page); });
      });
    }
    return page("https://api.scryfall.com/cards/search?order=set&unique=cards&q=" + encodeURIComponent("e:" + code + " game:paper"))
      .then(function () { setPool[code] = all; return all; }).catch(function () { return []; });
  }
  function slimLite(c) {
    var iu = c.image_uris || (c.card_faces && c.card_faces[0] && c.card_faces[0].image_uris) || {};
    return { name: c.name, rarity: c.rarity, small: iu.small || iu.normal || "", normal: iu.normal || iu.small || "" };
  }
  function buildPack(cards, size) {
    var by = { common: [], uncommon: [], rare: [], mythic: [] };
    cards.forEach(function (c) { (by[c.rarity] || (by.common)).push(c); });
    function pick(arr, n) { var r = [], p = arr.slice(); for (var i = 0; i < n && p.length; i++) r.push(p.splice(Math.floor(Math.random() * p.length), 1)[0]); return r; }
    var rares = by.rare.concat(by.mythic);
    var out = [];
    if (rares.length) out = out.concat(pick(rares, 1));
    out = out.concat(pick(by.uncommon, Math.min(3, size - out.length)));
    out = out.concat(pick(by.common, size - out.length));
    // if still short (small sets), top up from all
    if (out.length < size) out = out.concat(pick(cards, size - out.length));
    return out.slice(0, size);
  }

  // ---------- Pack Images ----------
  Apps.packimages = {
    name: "Pack Images", glyph: "🖼️", title: "Pack Images", width: 520, height: 420,
    build: function (w) {
      var sets = ["Arabian_Nights", "Antiquities", "Legends", "The_Dark", "Fallen_Empires", "Unlimited", "Revised", "Ice_Age"];
      var grid = h('<div class="card-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))"></div>');
      sets.forEach(function (s) {
        var t = h('<div style="text-align:center"><img loading="lazy" src="assets/sets/' + s + '.jpg" alt="' + s + '" style="width:100%;border:2px solid #808080"><div style="font-size:12px">' + s.replace(/_/g, " ") + "</div></div>");
        grid.appendChild(t);
      });
      w.body.innerHTML = "<p>Original set art (booster/box images).</p>";
      w.body.appendChild(grid);
    }
  };

  // ---------- Rotisserie Draft ----------
  Apps.rotisserie = {
    name: "Rotisserie Draft", glyph: "🍗", title: "Rotisserie Draft", width: 560, height: 480,
    build: function (w) {
      w.body.innerHTML =
        '<fieldset class="g95"><legend>Setup</legend>' +
        '<div class="row"><label>Players (comma separated):<br><input class="field95" id="rdPlayers" value="Alice, Bob, Carol" style="width:240px"></label>' +
        '<label>Deck size:<input class="field95" id="rdSize" type="number" value="40" min="1" max="99" style="width:52px"></label></div>' +
        '<button class="btn95" id="rdStart" style="margin-top:8px">Start Draft</button></fieldset>' +
        '<div id="rdArea"></div>';
      w.body.querySelector("#rdStart").onclick = function () {
        var players = w.body.querySelector("#rdPlayers").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
        var size = +w.body.querySelector("#rdSize").value || 40;
        if (players.length < 2) { alert("Need at least 2 players."); return; }
        startDraft(w.body.querySelector("#rdArea"), players, size);
      };
    }
  };
  function startDraft(area, players, size) {
    var picks = [], drafted = {}, pickNo = 0, total = players.length * size;
    function currentPlayer() {
      // snake order
      var round = Math.floor(pickNo / players.length);
      var idx = pickNo % players.length;
      if (round % 2 === 1) idx = players.length - 1 - idx;
      return idx;
    }
    area.innerHTML =
      '<div class="sunken" id="rdTurn" style="padding:6px;margin:8px 0;font-weight:bold"></div>' +
      '<div class="row"><input class="field95" id="rdCard" placeholder="Type a card name and press Draft" style="flex:1"><button class="btn95" id="rdDraft">Draft</button>' +
      '<button class="btn95" id="rdUndo">Undo</button><button class="btn95" id="rdExport">Export</button></div>' +
      '<div id="rdMsg" class="muted" style="font-size:12px;min-height:16px;margin:4px 0"></div>' +
      '<div id="rdBoards" style="display:grid;grid-template-columns:repeat(' + Math.min(players.length, 4) + ',1fr);gap:8px"></div>';
    var turn = area.querySelector("#rdTurn"), msg = area.querySelector("#rdMsg"), boards = area.querySelector("#rdBoards"), input = area.querySelector("#rdCard");
    function refresh() {
      if (pickNo >= total) { turn.textContent = "Draft complete! " + total + " cards drafted."; }
      else turn.innerHTML = "Pick #" + (pickNo + 1) + " &middot; <b>" + esc(players[currentPlayer()]) + "</b> to draft (" + (players.length * size - pickNo) + " left)";
      boards.innerHTML = "";
      players.forEach(function (p, pi) {
        var mine = picks.filter(function (x) { return x.player === pi; });
        var col = h('<div class="sunken" style="padding:6px"><b>' + esc(p) + " (" + mine.length + "/" + size + ')</b><div style="font-size:12px;max-height:150px;overflow:auto"></div></div>');
        var list = col.querySelector("div");
        mine.forEach(function (x) { var a = h('<div><a>' + esc(x.card.name) + "</a></div>"); a.querySelector("a").onclick = function () { showSingle(x.card.name); }; list.appendChild(a); });
        boards.appendChild(col);
      });
    }
    function draft() {
      if (pickNo >= total) { msg.textContent = "Draft is complete."; return; }
      var name = input.value.trim(); if (!name) return;
      if (drafted[Scry.key(name)]) { msg.textContent = '"' + name + '" is already drafted.'; return; }
      msg.textContent = "Looking up " + name + "...";
      Scry.getCards([name]).then(function (map) {
        var c = map[Scry.key(name)];
        if (!c || c.notFound) { msg.textContent = 'Card "' + name + '" not found.'; return; }
        drafted[Scry.key(c.name)] = true;
        picks.push({ card: c, player: currentPlayer() });
        pickNo++; input.value = ""; msg.textContent = c.name + " drafted."; input.focus(); refresh();
      });
    }
    area.querySelector("#rdDraft").onclick = draft;
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") draft(); });
    area.querySelector("#rdUndo").onclick = function () {
      var last = picks.pop(); if (!last) return; delete drafted[Scry.key(last.card.name)]; pickNo--; msg.textContent = "Removed " + last.card.name; refresh();
    };
    area.querySelector("#rdExport").onclick = function () {
      var txt = players.map(function (p, pi) { return p + ":\n" + picks.filter(function (x) { return x.player === pi; }).map(function (x) { return "1 " + x.card.name; }).join("\n"); }).join("\n\n");
      var w2 = window.MoxOS.createWindow({ id: "rdexport", title: "Draft Export", glyph: "📄", width: 320, height: 320 });
      w2.body.innerHTML = '<textarea class="field95" style="width:100%;height:100%;resize:none">' + esc(txt) + "</textarea>";
      window.MoxOS.center(w2.el);
    };
    refresh(); input.focus();
  }

  // ---------- Links ----------
  Apps.links = {
    name: "OS MtG Links", glyph: "🔗", title: "OS MtG Links - the web ring", width: 440, height: 380,
    build: function (w) {
      var links = [
        ["Eternal Central (93/94 rules)", "https://www.eternalcentral.com/9394rules/"],
        ["The Sentinel: Atlantic 93/94", "https://sentineloldschoolmtg.com/atlantic-93-94/"],
        ["Old School MTG blog", "http://oldschool-mtg.blogspot.com/"],
        ["Scryfall (card database)", "https://scryfall.com/"],
        ["Ted Kwartler (site author)", "https://tedkwartler.com/"]
      ];
      w.body.innerHTML = '<p><img src="assets/gifs/under-construction.gif" height="24"> The Old School web ring:</p>';
      var ul = h('<ul style="margin:0 0 0 18px;padding:0;line-height:1.9"></ul>');
      links.forEach(function (l) { ul.appendChild(h('<li><a href="' + l[1] + '" target="_blank" rel="noopener">' + esc(l[0]) + "</a></li>")); });
      w.body.appendChild(ul);
      w.body.appendChild(h('<p class="muted" style="font-size:11px;margin-top:10px">Want your Old School site added? Sign the guestbook. (Guestbook is under construction.)</p>'));
    }
  };

  window.MoxApps = Apps;
})();
