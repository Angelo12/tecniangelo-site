// QueLocal, página de producto. Todo aquí es un extra: sin este archivo la
// página se lee completa, con los pasos uno debajo del otro.

(function () {
  'use strict';

  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  /* ---------- Menú en pantallas angostas ---------- */
  var menuButton = document.querySelector('.menu-button');
  var menu = document.getElementById('menu');
  if (menuButton && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuButton.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (event) { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setMenu(false); });
  }

  /* ---------- Los pasos del día, como pestañas ---------- */
  $$('[data-steps]').forEach(function (steps) {
    var tabs = $$('[role="tab"]', steps);
    var panels = $$('[role="tabpanel"]', steps);
    var show = function (index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) {
        tabs[index].focus();
        if (tabs[index].scrollIntoView) tabs[index].scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    };
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { show(index, false); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== null) { event.preventDefault(); show(next, true); }
      });
    });
    show(0, false);
  });

  /* ---------- Bloques que pueden faltar ---------- */
  // Un grupo cuyos elementos están todos ocultos se oculta también, para no dejar un hueco.
  var tidy = function () {
    $$('.clips, [data-group], .phones').forEach(function (group) {
      var visible = Array.prototype.some.call(group.children, function (child) { return !child.hidden; });
      group.hidden = !visible;
    });
  };
  // Las imágenes opcionales se ocultan solas al fallar (onerror en el HTML); aquí solo se recoge el hueco.
  document.addEventListener('error', function (event) {
    if (event.target && event.target.tagName === 'IMG') setTimeout(tidy, 0);
  }, true);

  // Un video se muestra solo si su archivo existe.
  var exists = function (url) {
    return fetch(url, { method: 'HEAD' }).then(function (response) { return response.ok; });
  };
  var checks = [];
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    // Las imágenes opcionales se comprueban de una vez, para que la página no
    // cambie de alto mientras alguien baja hacia una sección.
    $$('[data-optional]').forEach(function (block) {
      var image = block.querySelector('img');
      if (!image) return;
      checks.push(exists(image.getAttribute('src')).then(function (found) {
        if (!found) block.hidden = true;
      }).catch(function () { /* sin red: se deja como está */ }));
    });
    $$('figure[data-video]').forEach(function (figure) {
      var video = figure.querySelector('video');
      var source = figure.querySelector('source');
      if (!video || !source) return;
      checks.push(exists(source.getAttribute('src')).then(function (found) {
        if (!found) { figure.hidden = true; return null; }
        var poster = video.getAttribute('poster');
        if (!poster) return null;
        return exists(poster).then(function (hasPoster) {
          // Sin póster, que al menos cargue el primer cuadro.
          if (!hasPoster) { video.removeAttribute('poster'); video.preload = 'metadata'; }
        });
      }).catch(function () { /* sin red: se deja como está */ }));
    });
  }
  Promise.all(checks).then(tidy);

  // Un solo video sonando a la vez.
  document.addEventListener('play', function (event) {
    $$('video').forEach(function (video) { if (video !== event.target) video.pause(); });
  }, true);

  /* ---------- Visor de imágenes ---------- */
  var viewer = document.getElementById('visor');
  if (viewer && typeof viewer.showModal === 'function') {
    var big = viewer.querySelector('img');
    var caption = viewer.querySelector('.viewer-caption');
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a.shot');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      var small = link.querySelector('img');
      var figure = link.closest('figure');
      var text = figure && figure.querySelector('figcaption') ? figure.querySelector('figcaption').textContent : (small ? small.alt : '');
      big.src = link.getAttribute('href');
      big.alt = small ? small.alt : '';
      caption.textContent = text;
      viewer.showModal();
    });
    viewer.addEventListener('click', function (event) { if (event.target === viewer) viewer.close(); });
    viewer.addEventListener('close', function () { big.removeAttribute('src'); });
  }

  /* ---------- Entrada suave de cada sección ---------- */
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !calm) {
    document.documentElement.classList.add('reveal');
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); seen.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    $$('.section').forEach(function (section) { seen.observe(section); });
  }

  /* ---------- Los colores de la marca, en la maqueta ---------- */
  // Las mismas reglas que usa el programa: el acento vale en claro y en oscuro,
  // el fondo decide el tema, y un tono difícil se mueve hasta que el texto se lea.
  var PRESETS = {
    fogon: { accent: '#ff8a3d', background: '#0d0d0d' },
    mar: { accent: '#3aa0ff', background: '#07182b' },
    bosque: { accent: '#46c487', background: '#0b1a13' },
    vino: { accent: '#e8587f', background: '#1d0a12' },
    oro: { accent: '#e9b949', background: '#101010' },
    cacao: { accent: '#d98a4e', background: '#1c120c' },
    crema: { accent: '#c2410c', background: '#f6efe4' },
    menta: { accent: '#0f8a6a', background: '#eef6f1' },
    cielo: { accent: '#1f6fd0', background: '#eef3fa' }
  };
  var WHITE = { r: 255, g: 255, b: 255 };
  var BLACK = { r: 0, g: 0, b: 0 };
  var DARK_INK = { r: 20, g: 16, b: 12 };

  var parseHex = function (hex) {
    var value = parseInt(hex.replace('#', ''), 16);
    return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
  };
  var toHex = function (c) {
    var part = function (n) { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0'); };
    return '#' + part(c.r) + part(c.g) + part(c.b);
  };
  var mix = function (a, b, t) { return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t }; };
  var luminance = function (c) {
    var channel = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
  };
  var contrast = function (a, b) {
    var la = luminance(a);
    var lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  var readableBackground = function (picked) {
    var dark = luminance(picked) < 0.3;
    var color = picked;
    for (var i = 0; i < 40; i += 1) {
      var l = luminance(color);
      if (dark ? l <= 0.085 : l >= 0.62) break;
      color = mix(color, dark ? BLACK : WHITE, 0.07);
    }
    return { dark: dark, color: color };
  };
  var readableOn = function (accent, surface, dark) {
    var color = accent;
    for (var i = 0; i < 24 && contrast(color, surface) < 4.5; i += 1) color = mix(color, dark ? WHITE : BLACK, 0.08);
    return color;
  };

  var mock = document.getElementById('maqueta');
  var paint = function (name) {
    var preset = PRESETS[name];
    if (!mock || !preset) return;
    var plane = readableBackground(parseHex(preset.background));
    var accent = parseHex(preset.accent);
    var toward = plane.dark ? WHITE : BLACK;
    var surface = plane.dark ? mix(plane.color, WHITE, 0.055) : mix(plane.color, WHITE, 0.72);
    var set = function (key, value) { mock.style.setProperty(key, value); };
    mock.setAttribute('data-theme', plane.dark ? 'dark' : 'light');
    set('--m-plane', toHex(plane.color));
    set('--m-s1', toHex(surface));
    set('--m-s2', toHex(mix(plane.color, toward, plane.dark ? 0.095 : 0.03)));
    set('--m-s3', toHex(mix(plane.color, toward, plane.dark ? 0.14 : 0.075)));
    set('--m-accent', toHex(accent));
    set('--m-ink', contrast(accent, DARK_INK) >= contrast(accent, WHITE) ? toHex(DARK_INK) : '#ffffff');
    set('--m-accent-text', toHex(readableOn(accent, surface, plane.dark)));
    set('--m-wash', 'rgba(' + accent.r + ', ' + accent.g + ', ' + accent.b + ', ' + (plane.dark ? 0.16 : 0.12) + ')');
  };
  $$('input[name="marca"]').forEach(function (input) {
    input.addEventListener('change', function () { if (input.checked) paint(input.value); });
    if (input.checked) paint(input.value);
  });
})();
