// Homepage behaviour, ported from the original index.html script with as few changes as possible.
// initHome() runs after the page mounts and returns a cleanup that removes every listener,
// observer, timer and GSAP animation, so client-side navigation and React's dev remount stay clean.
import { readLang, saveLang } from "@/lib/lang";

export function initHome(gsapLib, ScrollTriggerLib) {
    var root = document.documentElement;
    var ac = new AbortController();
    var listen = { signal: ac.signal };
    var observers = [];
    var chipTimer = null, ctx = null, motionOn = false, disposed = false;
    function cleanup() {
      disposed = true;
      ac.abort();
      observers.forEach(function (o) { o.disconnect(); });
      clearInterval(chipTimer);
      clearTimeout(cupTimer);
      cancelAnimationFrame(totalRaf);
      if (ctx) ctx.revert();
      root.classList.remove('anim');
    }
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Working rates from docs/BRIEF.md, applied like tax brackets: SAR per unit per year.
    var BRACKETS = [
      { upTo: 100, rate: 50 },
      { upTo: 300, rate: 40 },
      { upTo: Infinity, rate: 30 }
    ];

    var T = {
      ar: {
        sar: 'ريال',
        daily: '{daily} ريال يوميًا لمكتبك بالكامل.',
        dailyTiny: 'أقل من ريال يوميًا لمكتبك بالكامل.',
        coffee: ' أقل من سعر كوب قهوة',
        paper: ' أقل من تكلفة الورق والحبر لطباعة عقودك',
        bracketSub: '{units} وحدة = {total} ريال',
        title: 'عقدي | Aqdi',
        chips: [
          ['تم دفع إيجار وحدة 12', 'مدى · 16,000 ريال', 'ok'],
          ['طلب صيانة جديد', 'وحدة 4، مبنى ج · المكيف', 'warn'],
          ['وافق المستأجر على التجديد', 'وحدة 9، مبنى ب', 'ok']
        ]
      },
      en: {
        sar: 'SAR',
        daily: '{daily} SAR a day for your whole office.',
        dailyTiny: 'Less than 1 Saudi riyal a day for your whole office.',
        coffee: ' Less than a cup of coffee',
        paper: ' Less than the paper and ink for printing your contracts',
        bracketSub: '{units} units = {total} SAR',
        title: 'Aqdi | عقدي',
        chips: [
          ['Unit 12 rent paid', 'mada · 16,000 SAR', 'ok'],
          ['New repair request', 'Unit 4, Building C · AC', 'warn'],
          ['Renewal accepted', 'Unit 9, Building B', 'ok']
        ]
      }
    };

    // Dates: Hijri (Umm al-Qura) first, then Gregorian with the month name.
    // Arabic: Hijri in Arabic digits, Gregorian in Western digits.
    var HIJRI_EN = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah',
                    'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'];
    var DATE_OPTS = { day: 'numeric', month: 'long', year: 'numeric' };
    function part(parts, type) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
      return '';
    }
    function formatDate(d, lang) {
      try {
        if (lang === 'ar') {
          var h = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', DATE_OPTS).formatToParts(d);
          var g = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', DATE_OPTS).formatToParts(d);
          return part(h, 'day') + ' ' + part(h, 'month') + ' ' + part(h, 'year') + 'هـ · ' +
                 part(g, 'day') + ' ' + part(g, 'month') + ' ' + part(g, 'year') + 'م';
        }
        var he = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(d);
        var ge = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d).replace('Sept', 'Sep');
        return part(he, 'day') + ' ' + HIJRI_EN[parseInt(part(he, 'month'), 10) - 1] + ' ' + part(he, 'year') + ' · ' + ge;
      } catch {
        return d.toDateString();
      }
    }

    // Prices use Western digits and a comma separator in both languages.
    var NUM = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
    function fill(str, vars) {
      return str.replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; });
    }
    function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
    function fromIso(iso) { return new Date(iso + 'T12:00:00'); }

    function renderDates() {
      each('[data-date]', function (el) {
        var d = new Date();
        d.setDate(d.getDate() + parseInt(el.getAttribute('data-date'), 10));
        el.textContent = formatDate(d, root.lang);
      });
      // Fixed dates and amounts in the import and tenant examples.
      each('[data-iso]', function (el) { el.textContent = formatDate(fromIso(el.getAttribute('data-iso')), root.lang); });
      each('[data-sar]', function (el) { el.textContent = NUM.format(parseInt(el.getAttribute('data-sar'), 10)) + ' ' + T[root.lang].sar; });
      // Days left on the example tenant's lease, counted from today.
      each('[data-days-until]', function (el) {
        var days = Math.max(0, Math.ceil((fromIso(el.getAttribute('data-days-until')) - new Date()) / 864e5));
        el.textContent = days;
        var ring = document.getElementById('days-ring');
        if (ring) ring.style.setProperty('--off', String(100 - Math.min(100, Math.round(days / 365 * 100))));
      });
    }

    function yearlyTotal(units) {
      var total = 0, from = 0;
      for (var i = 0; i < BRACKETS.length && units > from; i++) {
        total += (Math.min(units, BRACKETS[i].upTo) - from) * BRACKETS[i].rate;
        from = BRACKETS[i].upTo;
      }
      return total;
    }

    // Small coffee cup that pops in when the daily price is under a coffee.
    var COFFEE_SVG = '<svg viewBox="0 0 32 32" width="30" height="30">' +
      '<g fill="none" stroke="#f5efe6" stroke-width="1.6" stroke-linecap="round">' +
      '<path class="steam" d="M12 9c-1.5-1.5 1.5-2.5 0-4"/><path class="steam" d="M16 9c-1.5-1.5 1.5-2.5 0-4"/><path class="steam" d="M20 9c-1.5-1.5 1.5-2.5 0-4"/></g>' +
      '<path d="M7 12h17v6a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7z" fill="#f5efe6"/>' +
      '<path d="M24 14h1.5a3 3 0 0 1 0 6H23.5" fill="none" stroke="#f5efe6" stroke-width="2"/>' +
      '<rect x="8.5" y="12.5" width="14" height="2.2" rx="1.1" fill="#7a5a44"/>' +
      '<path d="M5 27h21" stroke="#f5efe6" stroke-width="2" stroke-linecap="round"/></svg>';
    // A printed contract page that crumples into a ball, for 21 to 60 SAR a day.
    var PAPER_SVG = '<svg viewBox="0 0 32 32" width="30" height="30">' +
      '<g class="paper-sheet">' +
      '<path d="M9 4h11l5 5v19H9z" fill="#f5efe6"/><path d="M20 4v5h5z" fill="#d9cdbd"/>' +
      '<g stroke="#9a8b7e" stroke-width="1.3" stroke-linecap="round"><path d="M12 13h10"/><path d="M12 17h10"/><path d="M12 21h5"/></g>' +
      '<path d="M21.5 19.5c1.5 1.9 2.3 3 2.3 4a2.3 2.3 0 0 1-4.6 0c0-1 .8-2.1 2.3-4z" fill="#2b3a55"/></g>' +
      '<g class="paper-ball">' +
      '<path d="M6.5 17.5l4-8.5 7-2 6 3.5 2.8 7-2.8 7-7 2.8-6.8-2.8z" fill="#f5efe6"/>' +
      '<g fill="none" stroke="#b5a796" stroke-width="1.2" stroke-linecap="round"><path d="M10.5 11.5l5.5 5.5 7-4"/><path d="M9 22l7-4 5.5 7"/><path d="M16 17l.7 8.5"/><path d="M21 17.5l4 1"/></g></g></svg>';
    var showCup = false, cupTimer = null;

    var range = document.getElementById('units-range');
    var unitsInput = document.getElementById('units-num');
    var totalEl = document.getElementById('total-price');
    var shownTotal = 0, totalRaf = null;
    // The yearly total counts up or down to the new number instead of jumping.
    function tweenTotal(to, sar) {
      cancelAnimationFrame(totalRaf);
      var from = shownTotal, t0 = performance.now(), dur = reduceMotion || from === to ? 0 : 450;
      function frame(now) {
        var p = dur ? Math.min(1, (now - t0) / dur) : 1;
        shownTotal = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        totalEl.textContent = NUM.format(shownTotal) + ' ' + sar;
        if (p < 1) totalRaf = requestAnimationFrame(frame);
      }
      frame(t0);
    }
    // Each price row shows how many of your units fall in it and what they cost.
    function renderBrackets(units) {
      var rows = document.querySelectorAll('#brackets .bracket');
      var from = 0;
      for (var i = 0; i < rows.length; i++) {
        var inRow = Math.max(0, Math.min(units, BRACKETS[i].upTo) - from);
        rows[i].classList.toggle('on', inRow > 0);
        rows[i].querySelector('.sub').textContent = inRow > 0 ? fill(T[root.lang].bracketSub, { units: NUM.format(inRow), total: NUM.format(inRow * BRACKETS[i].rate) }) : '';
        from = BRACKETS[i].upTo;
      }
      document.getElementById('brackets').classList.add('live');
    }
    function renderPrice() {
      var t = T[root.lang];
      var units = Math.floor(parseFloat(unitsInput.value));
      if (!(units > 0)) {
        cancelAnimationFrame(totalRaf);
        totalEl.textContent = '—';
        document.getElementById('daily').textContent = '';
        return;
      }
      var total = yearlyTotal(units);
      var daily = Math.round(total / 365);
      tweenTotal(total, t.sar);
      renderBrackets(units);
      var dailyEl = document.getElementById('daily');
      // Up to 20 SAR a day compares to a coffee, up to 60 to the paper and ink for printing contracts.
      var tip = daily >= 1 && daily <= 20 ? 'coffee' : daily > 20 && daily <= 60 ? 'paper' : null;
      dailyEl.textContent = (daily < 1 ? t.dailyTiny : fill(t.daily, { daily: NUM.format(daily) })) + (tip ? t[tip] : '');
      if (tip && showCup) {
        var cup = document.createElement('span');
        cup.className = 'coffee' + (tip === 'paper' ? ' tip-paper' : '');
        cup.setAttribute('aria-hidden', 'true');
        cup.innerHTML = tip === 'paper' ? PAPER_SVG : COFFEE_SVG;
        dailyEl.appendChild(cup);
      }
    }
    // The cup only appears after the visitor enters a unit count, popping in once they pause.
    function onUnitsChanged() {
      showCup = false;
      renderPrice();
      clearTimeout(cupTimer);
      cupTimer = setTimeout(function () {
        showCup = true;
        renderPrice();
        var cup = document.querySelector('#daily .coffee');
        if (cup) cup.classList.add('pop');
      }, 450);
    }
    range.addEventListener('input', function () { unitsInput.value = range.value; onUnitsChanged(); }, listen);
    unitsInput.addEventListener('input', function () { range.value = Math.min(600, unitsInput.value || 1); onUnitsChanged(); }, listen);

    // Hero notification chip: cycles through a few things that just happened in the office.
    var chipIndex = 0;
    var chipText = document.getElementById('chip-text'), chipDot = document.getElementById('chip-dot');
    function renderChip() {
      var c = T[root.lang].chips[chipIndex];
      chipText.innerHTML = '';
      chipText.appendChild(document.createTextNode(c[0]));
      var s = document.createElement('small'); s.textContent = c[1]; chipText.appendChild(s);
      chipDot.style.background = c[2] === 'ok' ? '' : 'var(--amber-bg)';
      chipDot.style.color = c[2] === 'ok' ? '' : 'var(--amber)';
    }
    if (!reduceMotion) {
      chipTimer = setInterval(function () {
        chipText.classList.add('out');
        setTimeout(function () {
          chipIndex = (chipIndex + 1) % T[root.lang].chips.length;
          renderChip();
          chipText.classList.remove('out');
        }, 260);
      }, 3800);
    }

    // Stories: the stage shows the scene for whichever step is crossing the reading line.
    each('[data-story]', function (story) {
      var stage = story.querySelector('[data-stage]');
      var steps = story.querySelectorAll('.step');
      var dots = story.querySelectorAll('.stage-dots i');
      var fillEl = story.querySelector('.rail-fill');
      function activate(n) {
        if (stage.getAttribute('data-step') === n) return;
        stage.setAttribute('data-step', n);
        for (var i = 0; i < steps.length; i++) steps[i].classList.toggle('active', steps[i].getAttribute('data-step') === n);
        for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('on', j === n - 1);
        // The rail fills down to the step you're on.
        if (fillEl) fillEl.style.transform = 'scaleY(' + ((n - 1) / (steps.length - 1)) + ')';
      }
      // On phones the stage sits at the top, so the reading line is lower down the screen.
      var wide = window.matchMedia('(min-width: 960px)').matches;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) activate(e.target.getAttribute('data-step')); });
      }, { rootMargin: wide ? '-48% 0px -48% 0px' : '-72% 0px -24% 0px' });
      for (var i = 0; i < steps.length; i++) io.observe(steps[i]);
      observers.push(io);
    });

    // FAQ: answers open smoothly in place.
    each('.faq-q', function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.parentNode, open = !item.classList.contains('open');
        item.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }, listen);
    });

    // Nav: shadow once scrolled, and a pill that glides to the section you're reading.
    var nav = document.getElementById('nav');
    var pill = document.getElementById('nav-pill');
    var activeNav = null;
    function placePill() {
      var a = activeNav && document.querySelector('[data-nav="' + activeNav + '"]');
      if (!a) { pill.style.opacity = '0'; return; }
      pill.style.width = a.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
      pill.style.opacity = '1';
    }
    window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true, signal: ac.signal });
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) activeNav = e.target.id;
        else if (activeNav === e.target.id) activeNav = null;
      });
      each('.nav-links a', function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === activeNav); });
      placePill();
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['how', 'tenants', 'pricing', 'faq'].forEach(function (id) { navIo.observe(document.getElementById(id)); });
    observers.push(navIo);
    window.addEventListener('resize', placePill, listen);

    function setLang(lang) {
      root.lang = lang;
      root.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.title = T[lang].title;
      saveLang(lang);
      renderDates();
      renderPrice();
      renderChip();
      placePill();
      if (motionOn) try { ScrollTriggerLib.refresh(); } catch {}
    }
    setLang(readLang());
    // Switching language fades the page out and back so the layout flip isn't jarring.
    document.getElementById('lang-toggle').addEventListener('click', function () {
      var next = root.lang === 'ar' ? 'en' : 'ar';
      if (reduceMotion) { setLang(next); return; }
      document.body.classList.add('switching');
      setTimeout(function () {
        setLang(next);
        requestAnimationFrame(function () { document.body.classList.remove('switching'); });
      }, 180);
    }, listen);

    // Closing logo draws its lines when it comes into view.
    var closing = document.getElementById('closing');
    var closingIo = new IntersectionObserver(function (entries, o) {
      if (entries[0].isIntersecting) { closing.classList.add('in'); o.disconnect(); }
    }, { rootMargin: '0px 0px -25% 0px' });
    closingIo.observe(closing);
    observers.push(closingIo);

    // Motion layer. Without GSAP, or with reduced motion, everything above still works and nothing is hidden.
    if (!gsapLib || !ScrollTriggerLib || reduceMotion) return cleanup;
    var gsap = gsapLib;
    gsap.registerPlugin(ScrollTriggerLib);
    motionOn = true;
    ctx = gsap.context(function () {

      root.classList.add('anim');
      // Split headings into words (never letters: Arabic letters must stay joined).
      // The reveal itself is CSS: GSAP measuring hidden-language words would shuffle the spaces between them.
      each('[data-split] [lang]', function (span) {
        var words = span.textContent.trim().split(/\s+/);
        span.textContent = '';
        words.forEach(function (w, i) {
          var el = document.createElement('span');
          el.className = 'w';
          el.style.setProperty('--wi', i);
          el.textContent = w;
          span.appendChild(el);
          if (i < words.length - 1) span.appendChild(document.createTextNode(' '));
        });
      });
      var CLEAR = { opacity: 1, y: 0, filter: 'blur(0px)' };
      // GSAP may write into the vars objects it's given, so each call gets a fresh copy.
      function clear(extra) { return Object.assign({}, CLEAR, extra); }
      var heroTitle = document.querySelector('.hero h1');

      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('nav .wrap', { y: -16, opacity: 0, duration: .7 })
        .call(function () { heroTitle.classList.add('in'); }, null, .1)
        .from('.hero .lede, .hero .cta-row, .hero .trust', { opacity: 0, y: 18, filter: 'blur(6px)', duration: .9, stagger: .12 }, .45)
        .from('.hero .arch', { opacity: 0, scale: .94, duration: 1.2 }, .2)
        .from('.hero .mock', { opacity: 0, y: 60, rotationX: 12, transformPerspective: 1400, duration: 1.3 }, .35)
        .from('.hero .stat', { opacity: 0, y: 14, duration: .7, stagger: .08 }, .85)
        .from('.hero .row', { opacity: 0, y: 12, duration: .7, stagger: .1 }, 1.05)
        .from('.hero-chip', { opacity: 0, y: -12, scale: .92, duration: .7, ease: 'back.out(1.8)' }, 1.7);
      each('.hero .stat b[data-count]', function (b) {
        var to = parseInt(b.getAttribute('data-count'), 10), suffix = b.getAttribute('data-suffix') || '', o = { v: 0 };
        tl.to(o, { v: to, duration: 1.4, ease: 'power2.out', onUpdate: function () { b.textContent = Math.round(o.v) + suffix; } }, .9);
      });

      // Hero dashboard tilts gently toward the pointer.
      var heroStage = document.getElementById('hero-stage');
      var mock = heroStage.querySelector('.mock');
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var rx = gsap.quickTo(mock, 'rotationX', { duration: .9, ease: 'power3' });
        var ry = gsap.quickTo(mock, 'rotationY', { duration: .9, ease: 'power3' });
        heroStage.addEventListener('pointermove', function (e) {
          var r = heroStage.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - .5) * 7);
          rx(-((e.clientY - r.top) / r.height - .5) * 7);
        }, listen);
        heroStage.addEventListener('pointerleave', function () { rx(0); ry(0); }, listen);
      }
      gsap.to('.hero .arch', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

      // Section headings blur in word by word.
      each('section [data-split]', function (h) {
        ScrollTriggerLib.create({ trigger: h, start: 'top 86%', once: true, onEnter: function () { h.classList.add('in'); } });
      });

      // Everything else rises into place as it scrolls in.
      gsap.set('[data-reveal]', { opacity: 0, y: 30, filter: 'blur(6px)' });
      ScrollTriggerLib.batch('[data-reveal]', {
        start: 'top 90%', once: true,
        onEnter: function (batch) { gsap.to(batch, clear({ duration: 1, ease: 'power3.out', stagger: .09, overwrite: true })); }
      });
      each('.audience-card .rules li', function (li, i) {
        gsap.from(li, { opacity: 0, x: root.dir === 'rtl' ? 14 : -14, duration: .7, ease: 'power3.out', delay: (i % 4) * .08 + .25,
          scrollTrigger: { trigger: li.parentNode, start: 'top 88%', once: true } });
      });

      // Story stages rise in the first time they come into view.
      each('[data-story]', function (story) {
        gsap.from(story.querySelector('.stage-frame'), { opacity: 0, y: 40, scale: .97, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: story, start: 'top 85%', once: true } });
      });

      // Fonts change line lengths; re-measure once they're in.
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!disposed) ScrollTriggerLib.refresh(); });
    });
    return cleanup;
}
