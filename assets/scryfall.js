/* Scryfall helper - fetch oldest (original-art) printings, cached in localStorage */
(function () {
  "use strict";
  var CACHE_KEY = "mox_cards_v2";
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch (e) { cache = {}; }
  var saveTimer = null;
  function persist() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {} }, 400); }

  var queue = Promise.resolve();
  function throttled(fn) { var p = queue.then(function () { return new Promise(function (r) { setTimeout(r, 90); }); }).then(fn); queue = p.catch(function () {}); return p; }

  function imgOf(card) {
    if (!card) return null;
    if (card.image_uris) return card.image_uris;
    if (card.card_faces && card.card_faces[0] && card.card_faces[0].image_uris) return card.card_faces[0].image_uris;
    return null;
  }
  function slim(card) {
    var iu = imgOf(card) || {};
    return {
      name: card.name, mana_cost: card.mana_cost || "", cmc: card.cmc || 0,
      type_line: card.type_line || "", colors: card.colors || [], color_identity: card.color_identity || [],
      rarity: card.rarity || "", set: card.set || "", set_name: card.set_name || "", released_at: card.released_at || "",
      normal: iu.normal || iu.large || iu.small || "", small: iu.small || iu.normal || "",
      scry: card.scryfall_uri || "", notFound: false
    };
  }
  function key(n) { return n.toLowerCase().replace(/\s+/g, " ").trim(); }

  function fetchOldest(name) {
    var q = '!"' + name.replace(/"/g, "") + '" game:paper';
    var url = "https://api.scryfall.com/cards/search?order=released&dir=asc&unique=prints&q=" + encodeURIComponent(q);
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (j && j.data && j.data.length) return slim(j.data[0]);
      return { name: name, notFound: true };
    }).catch(function () { return { name: name, notFound: true }; });
  }

  // Get many cards -> resolves {keyName: cardData}
  function getCards(names) {
    var uniq = [], seen = {};
    names.forEach(function (n) { var k = key(n); if (!seen[k]) { seen[k] = 1; uniq.push(n); } });
    var out = {};
    var need = [];
    uniq.forEach(function (n) { var k = key(n); if (cache[k]) out[k] = cache[k]; else need.push(n); });
    return Promise.all(need.map(function (n) {
      return throttled(function () { return fetchOldest(n); }).then(function (c) {
        var k = key(n); cache[k] = c; out[k] = c; persist(); return c;
      });
    })).then(function () { return out; });
  }

  // General search (for pack builder / rotisserie)
  function search(query, opts) {
    opts = opts || {};
    var url = "https://api.scryfall.com/cards/search?q=" + encodeURIComponent(query) +
      (opts.order ? "&order=" + opts.order : "") + (opts.unique ? "&unique=" + opts.unique : "");
    return throttled(function () {
      return fetch(url).then(function (r) { return r.ok ? r.json() : { data: [] }; }).then(function (j) {
        return (j.data || []).map(slim);
      }).catch(function () { return []; });
    });
  }

  window.Scry = { getCards: getCards, search: search, key: key, cache: cache };
})();
