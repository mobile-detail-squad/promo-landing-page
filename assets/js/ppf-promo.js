(() => {
  'use strict';

  // Replace only with tested, Fieldd-generated service links. The current generic
  // booking entry does not preselect a package or configure a deposit.
  const bookingConfig = Object.freeze({
    partial: 'https://book.mobiledetailsquad.com',
    full: 'https://book.mobiledetailsquad.com',
    vehicle: 'tel:+15878872081'
  });

  // Panel outlines traced on ppf-vehicle-studio-v2 (1536 x 1024). Pins are % of the image box.
  const panels = {
    hood: { label: 'Hood', pin: [27, 47], pts: '430,385 560,395 700,405 820,415 905,428 860,470 800,510 740,540 700,558 640,566 560,581 470,596 410,606 330,601 250,593 160,586 115,576 80,546 95,500 150,455 230,425 330,400' },
    hoodLead: { label: 'Leading hood', pin: [23, 54], pts: '80,546 115,576 160,586 250,593 330,601 410,606 470,596 560,581 640,566 700,558 690,522 600,506 480,492 360,478 240,474 140,492' },
    fender: { label: 'Front fender', pin: [52, 57], pts: '700,558 768,495 905,428 925,450 920,560 910,660 900,715 880,690 880,640 840,575 790,553 740,565 700,600 685,640' },
    fenderLead: { label: 'Fender edge', pin: [49, 60], pts: '700,558 740,540 772,528 765,585 725,622 690,642 685,640 700,600' },
    bumper: { label: 'Front bumper', pin: [17, 73], pts: '80,548 115,578 160,588 250,595 330,603 410,610 470,598 560,582 640,567 700,560 690,640 680,700 660,760 640,820 610,850 500,860 380,850 250,830 120,800 40,770 25,700 30,640 45,590' },
    headlights: { label: 'Headlights', pin: [38, 63], pts: '415,603 470,593 560,578 640,565 690,560 690,600 640,625 560,640 470,635 420,615 M60,545 100,540 108,582 78,592' },
    mirrors: { label: 'Mirrors', pin: [67, 38], pts: '962,400 975,375 1020,365 1085,370 1095,395 1070,430 1000,440 965,425 M432,350 445,332 480,335 482,360 450,370 432,362' },
    doors: { label: 'Doors', pin: [73, 56], pts: '915,432 1050,440 1170,430 1330,400 1340,560 1330,650 1300,700 1170,735 1050,752 915,752 905,650 915,520' },
    rear: { label: 'Rear quarter', pin: [87, 50], pts: '1330,400 1420,330 1480,345 1505,380 1520,450 1532,540 1526,620 1500,680 1440,702 1400,702 1340,655 1340,560' },
    roof: { label: 'Roof', pin: [57, 22], pts: '610,240 700,205 820,192 960,192 1080,198 1150,215 1100,236 960,229 820,231 700,246' }
  };

  // Partial Front pricing is provisional pending confirmation with John.
  const packages = {
    partial: {
      name: 'Partial Front PPF', eyebrow: 'Comparing', price: 'from $950 CAD', priceNote: '· $150 deposit, credited', priceNumber: 950,
      link: 'Book Partial Front', on: ['hoodLead', 'fenderLead', 'bumper', 'mirrors'],
      chips: [['Leading hood', 1], ['Fender edges', 1], ['Front bumper', 1], ['Mirrors', 1], ['Full hood', 0], ['Headlights', 0]],
      bonus: 'Winter extras are not included with Partial Front.', bonusMuted: true,
      alt: 'Illustration of a sedan with Partial Front PPF coverage highlighted: leading hood and fender edges, front bumper and mirrors'
    },
    full: {
      name: 'Full Front PPF', eyebrow: 'Winter special', price: '$1,595 CAD', priceNote: '· $250 deposit, credited', priceNumber: 1595,
      link: 'Reserve Full Front', on: ['hood', 'fender', 'bumper', 'headlights', 'mirrors'],
      chips: [['Full hood', 1], ['Front fenders', 1], ['Front bumper', 1], ['Headlights', 1], ['Mirrors', 1]],
      bonus: 'Includes the free Interior Reset Detail and Windshield Ceramic Glass Treatment.', bonusMuted: false,
      alt: 'Illustration of a sedan with Full Front PPF coverage highlighted: hood, front fenders, front bumper, headlights and mirrors'
    },
    vehicle: {
      name: 'Full Vehicle PPF', eyebrow: 'Comparing', price: 'Custom quote', priceNote: '· priced for your vehicle', priceNumber: null,
      link: 'Call for a quote', on: ['hood', 'fender', 'bumper', 'headlights', 'mirrors', 'doors', 'rear', 'roof'],
      chips: [['Everything in Full Front', 1], ['Doors', 1], ['Roof', 1], ['Rear quarters & bumper', 1]],
      bonus: 'Winter extras apply to the Full Front special. Ask us about pairing them with a full wrap.', bonusMuted: true,
      alt: 'Illustration of a sedan with Full Vehicle PPF coverage highlighted across all painted body panels'
    }
  };

  // Forward only campaign attribution to HTTPS booking links. Never customer data.
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid'];
  const incoming = new URLSearchParams(window.location.search);
  const destinations = {};
  Object.keys(bookingConfig).forEach((key) => {
    const destination = new URL(bookingConfig[key]);
    if (destination.protocol === 'https:') {
      campaignKeys.forEach((field) => {
        const value = incoming.get(field);
        if (value && value.length <= 300) destination.searchParams.set(field, value);
      });
    }
    destinations[key] = destination.toString();
  });

  function track(event, details) {
    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push({ event, ...details });
    }
  }

  // Build overlay paths and pins.
  const g = document.getElementById('panels');
  const pinsEl = document.getElementById('pins');
  Object.entries(panels).forEach(([key, p]) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', p.pts.split('M').map((seg) => {
      const pts = seg.trim().split(/\s+/);
      return 'M' + pts[0] + ' L' + pts.slice(1).join(' L') + ' Z';
    }).join(' '));
    path.dataset.panel = key;
    g.appendChild(path);
    const pin = document.createElement('span');
    pin.className = 'pin'; pin.dataset.panel = key; pin.textContent = p.label;
    pin.style.left = p.pin[0] + '%'; pin.style.top = p.pin[1] + '%';
    pinsEl.appendChild(pin);
  });

  const tabs = Array.from(document.querySelectorAll('.seg-btn'));
  const stagePanel = document.getElementById('stage-panel');
  const stageLink = document.getElementById('sel-link');
  let active = 'full';

  function select(key, shouldTrack = true) {
    const pkg = packages[key];
    if (!pkg) return;
    active = key;
    tabs.forEach((b) => {
      const on = b.dataset.pkg === key;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    stagePanel.setAttribute('aria-labelledby', 'tab-' + key);
    document.querySelectorAll('[data-panel]').forEach((el) => el.classList.toggle('on', pkg.on.includes(el.dataset.panel)));
    document.getElementById('car').setAttribute('aria-label', pkg.alt);
    document.getElementById('sel-eyebrow').textContent = pkg.eyebrow;
    document.getElementById('stage-title').textContent = pkg.name;
    const price = document.getElementById('sel-price');
    price.textContent = pkg.price + ' ';
    const note = document.createElement('span'); note.textContent = pkg.priceNote; price.appendChild(note);
    document.getElementById('chips').replaceChildren(...pkg.chips.map(([text, on]) => {
      const li = document.createElement('li'); li.textContent = text; if (!on) li.className = 'off'; return li;
    }));
    const bonus = document.getElementById('sel-bonus');
    bonus.textContent = pkg.bonus; bonus.classList.toggle('muted', pkg.bonusMuted);
    stageLink.textContent = pkg.link + ' ';
    const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '→'; stageLink.appendChild(arrow);
    stageLink.href = destinations[key];
    if (shouldTrack) track('ppf_package_select', { package: key, advertised_price_cad: pkg.priceNumber });
  }

  tabs.forEach((tab, index) => {
    tab.disabled = false;
    tab.addEventListener('click', () => select(tab.dataset.pkg));
    tab.addEventListener('keydown', (event) => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      tabs[target].focus();
      select(tabs[target].dataset.pkg);
    });
  });

  // Every "Reserve" action books the Full Front special; the stage link follows the comparison.
  document.querySelectorAll('[data-book]').forEach((link) => {
    link.href = destinations.full;
    link.addEventListener('click', () => track('ppf_booking_click', { placement: link.dataset.placement, package: 'full', advertised_price_cad: 1595 }));
  });
  stageLink.addEventListener('click', () => track(active === 'vehicle' ? 'ppf_quote_click' : 'ppf_booking_click', {
    placement: 'stage', package: active, advertised_price_cad: packages[active].priceNumber
  }));

  select('full', false);
})();
