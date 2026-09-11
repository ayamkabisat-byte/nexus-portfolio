import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initWorldLibrary } from '../src/scripts/world-library.ts';

// Small event/clock fixture: exercise the real controller without network or a browser dependency.
class Element {
  constructor(parent = null) {
    this.parent = parent;
    this.listeners = new Map(); this.selectors = new Map(); this.attributes = new Map();
    this.dataset = {}; this.hidden = false; this.inert = false; this.isConnected = true;
    const classes = new Set();
    this.classList = { add: (...v) => v.forEach(x => classes.add(x)), remove: (...v) => v.forEach(x => classes.delete(x)), contains: v => classes.has(v), toggle: (v, on) => on ? classes.add(v) : classes.delete(v) };
    this.style = { setProperty() {} };
  }
  addEventListener(type, fn, options = {}) {
    if (options.signal?.aborted) return;
    const entry = { fn, capture: options.capture || false, signal: options.signal };
    const list = this.listeners.get(type) || []; list.push(entry); this.listeners.set(type, list);
  }
  querySelectorAll(selector) { return this.selectors.get(selector) || []; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  map(selector, nodes) { this.selectors.set(selector, nodes); return nodes; }
  setAttribute(key, value) { this.attributes.set(key, value); }
  getAttribute(key) { return this.attributes.get(key); }
  toggleAttribute(key, on) { if (key === 'inert') this.inert = on; }
  contains(node) { return node === this || !!node?.parent && this.contains(node.parent); }
  closest() { return this.hidden || this.inert ? this : this.parent?.closest() || null; }
  focus() {
    const previous = document.activeElement;
    document.activeElement = this;
    if (previous) fire(previous, 'focusout', { relatedTarget: this });
    fire(this, 'focusin', { relatedTarget: previous });
  }
}
function fire(target, type, properties = {}) {
  const event = { type, detail: 1, button: 0, isPrimary: true, pointerId: 1, ...properties, defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; } };
  const chain = []; for (let node = target; node; node = node.parent) chain.push(node);
  const dispatch = (nodes, capture) => {
    for (const node of nodes) for (const listener of node.listeners.get(type) || []) {
      if (event.stopped) return;
      if (listener.capture === capture && !listener.signal?.aborted) listener.fn(event);
    }
  };
  dispatch([...chain].reverse(), true); dispatch(chain, false);
  return event;
}
function fixture() {
  globalThis.HTMLElement = Element; globalThis.Node = Element;
  const win = new Element(); const doc = new Element(win); doc.hidden = false;
  const root = new Element(doc); const reel = new Element(root);
  const timers = new Map(); const frames = new Map(); let nextId = 0;
  const motion = new Element(); motion.matches = false;
  const mobile = new Element(); mobile.matches = false;
  Object.assign(win, {
    matchMedia: q => q.includes('reduced-motion') ? motion : mobile,
    setTimeout: fn => { timers.set(++nextId, fn); return nextId; }, clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => { frames.set(++nextId, fn); return nextId; }, cancelAnimationFrame: id => frames.delete(id),
  });
  globalThis.window = win; globalThis.document = doc;
  let observe;
  globalThis.IntersectionObserver = class { constructor(fn) { observe = fn; } observe() {} disconnect() { observe = () => {}; } };
  const node = (parent, selector) => { const n = new Element(parent); parent.map(selector, [n]); return n; };
  root.map('[data-world-reel]', [reel]);
  const pause = node(root, '[data-world-pause]');
  node(root, '[data-world-counter]'); node(root, '[data-world-status]'); node(root, '[data-world-announcement]');
  const books = root.map('[data-reel-book]', Array.from({ length: 6 }, (_, i) => { const n = new Element(reel); n.dataset.bookSlug = `book-${i}`; return n; }));
  const panels = root.map('[data-world-panel]', books.map((book) => {
    const panel = new Element(root); panel.dataset.bookSlug = book.dataset.bookSlug;
    const desktop = node(panel, '[data-desktop-brief]'); const mobileBrief = node(panel, '[data-mobile-brief]');
    const close1 = node(desktop, '[data-book-close]'); const close2 = node(mobileBrief, '[data-book-close]');
    panel.map('[data-book-close]', [close1, close2]); node(panel, '[data-book-toggle]'); return panel;
  }));
  const summaries = root.map('[data-world-summary]', books.map(() => new Element(root)));
  root.map('[data-preview-book]', summaries.map((summary, i) => { const b = new Element(summary); b.dataset.previewBook = String(i); return b; }));
  const prev = node(root, '[data-world-prev]'); const next = node(root, '[data-world-next]');
  const cleanup = initWorldLibrary(root);
  const visible = value => observe([{ isIntersecting: value }]);
  const flushFrames = () => { for (const [id, fn] of [...frames]) { frames.delete(id); fn(); } };
  const tick = () => { for (const [id, fn] of [...timers]) { timers.delete(id); fn(); } };
  return { root, reel, books, panels, summaries, prev, next, pause, win, doc, motion, mobile, timers, frames, visible, flushFrames, tick, cleanup };
}

test('rotation only runs in view, pauses for hover/focus, and respects explicit pause', () => {
  const f = fixture(); assert.equal(f.timers.size, 0);
  f.visible(true); assert.equal(f.timers.size, 1);
  f.tick(); assert.equal(f.root.dataset.activeBook, 'book-1');
  fire(f.root, 'mouseenter'); fire(f.next, 'click'); assert.equal(f.timers.size, 0);
  fire(f.root, 'mouseleave'); assert.equal(f.timers.size, 1);
  f.books[2].focus(); assert.equal(f.timers.size, 0);
  fire(f.root, 'focusout', { relatedTarget: new Element() });
  fire(f.pause, 'click'); assert.equal(f.pause.textContent, 'Play rotation');
  f.doc.hidden = true; fire(f.doc, 'visibilitychange'); f.doc.hidden = false; fire(f.doc, 'visibilitychange');
  fire(f.root, 'mouseenter'); fire(f.root, 'mouseleave'); assert.equal(f.timers.size, 0);
  fire(f.pause, 'click'); assert.equal(f.timers.size, 1);
  f.motion.matches = true; fire(f.motion, 'change'); assert.equal(f.timers.size, 0); assert.equal(f.pause.disabled, true);
  f.cleanup();
});

test('single click opens, moves focus, makes reel inert, and Escape restores focus', () => {
  const f = fixture(); f.books[0].focus(); fire(f.books[0], 'click'); f.flushFrames();
  assert.equal(f.root.classList.contains('is-book-open'), true); assert.equal(f.reel.inert, true);
  assert.equal(f.panels[0].inert, false); assert.equal(f.summaries[0].hidden, true);
  assert.equal(f.doc.activeElement, f.panels[0].querySelector('[data-desktop-brief]').querySelector('[data-book-close]'));
  fire(f.root, 'keydown', { key: 'Escape' });
  assert.equal(f.reel.inert, false); assert.equal(f.panels[0].inert, true); assert.equal(f.doc.activeElement, f.books[0]);
  f.cleanup();
});

test('Home/End select without opening; arrows wrap and reset inactive expanded state', () => {
  const f = fixture(); fire(f.books[0], 'keydown', { key: 'Home' }); assert.equal(f.root.classList.contains('is-book-open'), false);
  fire(f.books[0], 'keydown', { key: 'ArrowLeft' }); assert.equal(f.root.dataset.activeBook, 'book-5');
  fire(f.books[5], 'click'); fire(f.next, 'click');
  assert.equal(f.root.dataset.activeBook, 'book-0'); assert.equal(f.books[5].getAttribute('aria-expanded'), 'false');
  assert.equal(f.panels.filter(p => !p.hidden).length, 1); f.cleanup();
});

test('swipe changes selection without accidental click; next ordinary tap still opens', () => {
  const f = fixture();
  fire(f.books[0], 'pointerdown', { clientX: 200, clientY: 100 });
  fire(f.win, 'pointermove', { clientX: 120, clientY: 103 });
  fire(f.win, 'pointerup', { clientX: 120, clientY: 103 });
  const click = fire(f.books[0], 'click'); assert.equal(click.defaultPrevented, true);
  assert.equal(f.root.dataset.activeBook, 'book-1'); assert.equal(f.root.classList.contains('is-book-open'), false);
  fire(f.books[1], 'pointerdown', { clientX: 120, clientY: 103 });
  fire(f.win, 'pointerup', { clientX: 120, clientY: 103 }); fire(f.books[1], 'click');
  assert.equal(f.root.classList.contains('is-book-open'), true); f.cleanup();
});

test('mobile switches focus to the readable brief and cleanup cancels pending work', () => {
  const f = fixture(); fire(f.books[0], 'click'); f.flushFrames();
  f.mobile.matches = true; fire(f.mobile, 'change'); f.flushFrames();
  const panel = f.panels[0];
  assert.equal(panel.querySelector('[data-desktop-brief]').inert, true);
  assert.equal(f.doc.activeElement, panel.querySelector('[data-mobile-brief]').querySelector('[data-book-close]'));
  f.cleanup(); assert.equal(f.frames.size, 0); assert.equal(f.timers.size, 0);
  fire(f.next, 'click'); assert.equal(f.root.dataset.activeBook, 'book-0');
  assert.equal(f.root.classList.contains('is-ready'), false);
});

test('incomplete markup leaves the fallback active', () => {
  const root = new Element(); const cleanup = initWorldLibrary(root);
  assert.equal(root.classList.contains('is-ready'), false); cleanup();
});
