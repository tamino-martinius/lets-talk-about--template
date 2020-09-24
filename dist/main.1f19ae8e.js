// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"assets/vendor/slides.js":[function(require,module,exports) {
/*
  Google HTML5 slides template

  Authors: Luke Mahé (code)
           Marcin Wichary (code and design)

           Dominic Mazzoni (browser compatibility)
           Charles Chen (ChromeVox support)

  URL: http://code.google.com/p/html5slides/
*/
var SLIDE_CLASSES = ['far-past', 'past', 'current', 'next', 'far-next'];
var PM_TOUCH_SENSITIVITY = 15;
var curSlide;
/* ---------------------------------------------------------------------- */

/* classList polyfill by Eli Grey
 * (http://purl.eligrey.com/github/classList.js/blob/master/classList.js) */

if (typeof document !== 'undefined' && !('classList' in document.createElement('a'))) {
  (function (view) {
    var classListProp = 'classList',
        protoProp = 'prototype',
        elemCtrProto = (view.HTMLElement || view.Element)[protoProp],
        objCtr = Object;
    strTrim = String[protoProp].trim || function () {
      return this.replace(/^\s+|\s+$/g, '');
    }, arrIndexOf = Array[protoProp].indexOf || function (item) {
      for (var i = 0, len = this.length; i < len; i++) {
        if (i in this && this[i] === item) {
          return i;
        }
      }

      return -1;
    }, // Vendors: please allow content code to instantiate DOMExceptions
    DOMEx = function DOMEx(type, message) {
      this.name = type;
      this.code = DOMException[type];
      this.message = message;
    }, checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
      if (token === '') {
        throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified');
      }

      if (/\s/.test(token)) {
        throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character');
      }

      return arrIndexOf.call(classList, token);
    }, ClassList = function ClassList(elem) {
      var trimmedClasses = strTrim.call(elem.className),
          classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [];

      for (var i = 0, len = classes.length; i < len; i++) {
        this.push(classes[i]);
      }

      this._updateClassName = function () {
        elem.className = this.toString();
      };
    }, classListProto = ClassList[protoProp] = [], classListGetter = function classListGetter() {
      return new ClassList(this);
    }; // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.

    DOMEx[protoProp] = Error[protoProp];

    classListProto.item = function (i) {
      return this[i] || null;
    };

    classListProto.contains = function (token) {
      token += '';
      return checkTokenAndGetIndex(this, token) !== -1;
    };

    classListProto.add = function (token) {
      token += '';

      if (checkTokenAndGetIndex(this, token) === -1) {
        this.push(token);

        this._updateClassName();
      }
    };

    classListProto.remove = function (token) {
      token += '';
      var index = checkTokenAndGetIndex(this, token);

      if (index !== -1) {
        this.splice(index, 1);

        this._updateClassName();
      }
    };

    classListProto.toggle = function (token) {
      token += '';

      if (checkTokenAndGetIndex(this, token) === -1) {
        this.add(token);
      } else {
        this.remove(token);
      }
    };

    classListProto.toString = function () {
      return this.join(' ');
    };

    if (objCtr.defineProperty) {
      var classListPropDesc = {
        get: classListGetter,
        enumerable: true,
        configurable: true
      };

      try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
      } catch (ex) {
        // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7ff5ec54) {
          classListPropDesc.enumerable = false;
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
      }
    } else if (objCtr[protoProp].__defineGetter__) {
      elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }
  })(self);
}
/* ---------------------------------------------------------------------- */

/* Slide movement */


function getSlideEl(no) {
  if (no < 0 || no >= slideEls.length) {
    return null;
  }

  return slideEls[no];
}

function updateSlideClass(slideNo, className) {
  var el = getSlideEl(slideNo);

  if (!el) {
    return;
  }

  if (className) {
    el.classList.add(className);
  }

  for (var i in SLIDE_CLASSES) {
    if (className != SLIDE_CLASSES[i]) {
      el.classList.remove(SLIDE_CLASSES[i]);
    }
  }
}

function updateSlides() {
  for (var i = 0; i < slideEls.length; i++) {
    switch (i) {
      case curSlide - 2:
        updateSlideClass(i, 'far-past');
        break;

      case curSlide - 1:
        updateSlideClass(i, 'past');
        break;

      case curSlide:
        updateSlideClass(i, 'current');
        break;

      case curSlide + 1:
        updateSlideClass(i, 'next');
        break;

      case curSlide + 2:
        updateSlideClass(i, 'far-next');
        break;

      default:
        updateSlideClass(i);
        break;
    }
  }

  triggerLeaveEvent(curSlide - 1);
  triggerEnterEvent(curSlide);
  window.setTimeout(function () {
    // Hide after the slide
    disableSlideFrames(curSlide - 2);
  }, 301);
  enableSlideFrames(curSlide - 1);
  enableSlideFrames(curSlide + 2);

  if (isChromeVoxActive()) {
    speakAndSyncToNode(slideEls[curSlide]);
  }

  updateHash();
}

function buildNextItem() {
  var toBuild = slideEls[curSlide].querySelectorAll('.to-build');

  if (!toBuild.length) {
    return false;
  }

  toBuild[0].classList.remove('to-build');

  if (isChromeVoxActive()) {
    speakAndSyncToNode(toBuild[0]);
  }

  return true;
}

function prevSlide() {
  if (curSlide > 0) {
    curSlide--;
    updateSlides();
  }
}

function nextSlide() {
  if (buildNextItem()) {
    return;
  }

  if (curSlide < slideEls.length - 1) {
    curSlide++;
    updateSlides();
  }
}

function triggerEnterEvent(no) {
  var el = getSlideEl(no);

  if (!el) {
    return;
  }

  var onEnter = el.getAttribute('onslideenter');

  if (onEnter) {
    new Function(onEnter).call(el);
  }

  var evt = document.createEvent('Event');
  evt.initEvent('slideenter', true, true);
  evt.slideNumber = no + 1; // Make it readable

  el.dispatchEvent(evt);
}

function triggerLeaveEvent(no) {
  var el = getSlideEl(no);

  if (!el) {
    return;
  }

  var onLeave = el.getAttribute('onslideleave');

  if (onLeave) {
    new Function(onLeave).call(el);
  }

  var evt = document.createEvent('Event');
  evt.initEvent('slideleave', true, true);
  evt.slideNumber = no + 1; // Make it readable

  el.dispatchEvent(evt);
}
/* Touch events */


function handleTouchStart(event) {
  if (event.touches.length == 1) {
    touchDX = 0;
    touchDY = 0;
    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;
    document.body.addEventListener('touchmove', handleTouchMove, true);
    document.body.addEventListener('touchend', handleTouchEnd, true);
  }
}

function handleTouchMove(event) {
  if (event.touches.length > 1) {
    cancelTouch();
  } else {
    touchDX = event.touches[0].pageX - touchStartX;
    touchDY = event.touches[0].pageY - touchStartY;
  }
}

function handleTouchEnd(event) {
  var dx = Math.abs(touchDX);
  var dy = Math.abs(touchDY);

  if (dx > PM_TOUCH_SENSITIVITY && dy < dx * 2 / 3) {
    if (touchDX > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  }

  cancelTouch();
}

function cancelTouch() {
  document.body.removeEventListener('touchmove', handleTouchMove, true);
  document.body.removeEventListener('touchend', handleTouchEnd, true);
}
/* Preloading frames */


function disableSlideFrames(no) {
  var el = getSlideEl(no);

  if (!el) {
    return;
  }

  var frames = el.getElementsByTagName('iframe');

  for (var i = 0, frame; frame = frames[i]; i++) {
    disableFrame(frame);
  }
}

function enableSlideFrames(no) {
  var el = getSlideEl(no);

  if (!el) {
    return;
  }

  var frames = el.getElementsByTagName('iframe');

  for (var i = 0, frame; frame = frames[i]; i++) {
    enableFrame(frame);
  }
}

function disableFrame(frame) {
  frame.src = 'about:blank';
}

function enableFrame(frame) {
  var src = frame._src;

  if (frame.src != src && src != 'about:blank') {
    frame.src = src;
  }
}

function setupFrames() {
  var frames = document.querySelectorAll('iframe');

  for (var i = 0, frame; frame = frames[i]; i++) {
    frame._src = frame.src;
    disableFrame(frame);
  }

  enableSlideFrames(curSlide);
  enableSlideFrames(curSlide + 1);
  enableSlideFrames(curSlide + 2);
}

function setupInteraction() {
  /* Clicking and tapping */
  var el = document.createElement('div');
  el.className = 'slide-area';
  el.id = 'prev-slide-area';
  el.addEventListener('click', prevSlide, false);
  document.querySelector('section.slides').appendChild(el);
  var el = document.createElement('div');
  el.className = 'slide-area';
  el.id = 'next-slide-area';
  el.addEventListener('click', nextSlide, false);
  document.querySelector('section.slides').appendChild(el);
  /* Swiping */

  document.body.addEventListener('touchstart', handleTouchStart, false);
}
/* ChromeVox support */


function isChromeVoxActive() {
  if (typeof cvox == 'undefined') {
    return false;
  }

  return true;
}

function speakAndSyncToNode(node) {
  if (!isChromeVoxActive()) {
    return;
  }

  cvox.ChromeVox.navigationManager.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);
  cvox.ChromeVox.navigationManager.syncToNode(node);
  cvox.ChromeVoxUserCommands.finishNavCommand('');
  var target = node;

  while (target.firstChild) {
    target = target.firstChild;
  }

  cvox.ChromeVox.navigationManager.syncToNode(target);
}

function speakNextItem() {
  if (!isChromeVoxActive()) {
    return;
  }

  cvox.ChromeVox.navigationManager.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);
  cvox.ChromeVox.navigationManager.next(true);

  if (!cvox.DomUtil.isDescendantOfNode(cvox.ChromeVox.navigationManager.getCurrentNode(), slideEls[curSlide])) {
    var target = slideEls[curSlide];

    while (target.firstChild) {
      target = target.firstChild;
    }

    cvox.ChromeVox.navigationManager.syncToNode(target);
    cvox.ChromeVox.navigationManager.next(true);
  }

  cvox.ChromeVoxUserCommands.finishNavCommand('');
}

function speakPrevItem() {
  if (!isChromeVoxActive()) {
    return;
  }

  cvox.ChromeVox.navigationManager.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);
  cvox.ChromeVox.navigationManager.previous(true);

  if (!cvox.DomUtil.isDescendantOfNode(cvox.ChromeVox.navigationManager.getCurrentNode(), slideEls[curSlide])) {
    var target = slideEls[curSlide];

    while (target.lastChild) {
      target = target.lastChild;
    }

    cvox.ChromeVox.navigationManager.syncToNode(target);
    cvox.ChromeVox.navigationManager.previous(true);
  }

  cvox.ChromeVoxUserCommands.finishNavCommand('');
}
/* Hash functions */


function getCurSlideFromHash() {
  var slideNo = parseInt(location.hash.substr(1));

  if (slideNo) {
    curSlide = slideNo - 1;
  } else {
    curSlide = 0;
  }
}

function updateHash() {
  location.replace("#".concat(curSlide + 1));
}
/* Event listeners */


function handleBodyKeyDown(event) {
  switch (event.keyCode) {
    case 39: // right arrow

    case 13: // Enter

    case 32: // space

    case 34:
      // PgDn
      nextSlide();
      event.preventDefault();
      break;

    case 37: // left arrow

    case 8: // Backspace

    case 33:
      // PgUp
      prevSlide();
      event.preventDefault();
      break;

    case 40:
      // down arrow
      if (isChromeVoxActive()) {
        speakNextItem();
      } else {
        nextSlide();
      }

      event.preventDefault();
      break;

    case 38:
      // up arrow
      if (isChromeVoxActive()) {
        speakPrevItem();
      } else {
        prevSlide();
      }

      event.preventDefault();
      break;
  }
}

function addEventListeners() {
  document.addEventListener('keydown', handleBodyKeyDown, false);
  document.addEventListener('click', nextSlide);
}
/* Initialization */


function addPrettify() {
  var els = document.querySelectorAll('pre');

  for (var i = 0, el; el = els[i]; i++) {
    if (!el.classList.contains('noprettyprint')) {
      el.classList.add('prettyprint');
    }
  }
}

function addGeneralStyle() {
  var el = document.createElement('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = "".concat(PERMANENT_URL_PREFIX, "styles.css");
  document.body.appendChild(el);
  var el = document.createElement('meta');
  el.name = 'viewport';
  el.content = 'width=1100,height=750';
  document.querySelector('head').appendChild(el);
  var el = document.createElement('meta');
  el.name = 'apple-mobile-web-app-capable';
  el.content = 'yes';
  document.querySelector('head').appendChild(el);
}

function makeBuildLists() {
  for (var i = curSlide, slide; slide = slideEls[i]; i++) {
    var selector = '.build > *';

    if (slide.classList.contains('build')) {
      selector += ':not(:first-child)';
    }

    var items = slide.querySelectorAll(selector);

    for (var j = 0, item; item = items[j]; j++) {
      if (item.classList) {
        item.classList.add('to-build');
      }
    }
  }
}

function handleDomLoaded() {
  slideEls = document.querySelectorAll('section.slides > article');
  setupFrames();
  addPrettify();
  addEventListeners();
  updateSlides();
  setupInteraction();
  makeBuildLists();
  document.body.classList.add('loaded');
}

function initialize() {
  getCurSlideFromHash();

  if (window._DEBUG) {
    PERMANENT_URL_PREFIX = '../';
  }

  if (window._DCL) {
    handleDomLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', handleDomLoaded, false);
  }
} // If ?debug exists then load the script relative instead of absolute


if (!window._DEBUG && document.location.href.indexOf('?debug') !== -1) {
  document.addEventListener('DOMContentLoaded', function () {
    // Avoid missing the DomContentLoaded event
    window['_DCL'] = true;
  }, false);
  window._DEBUG = true;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '../slides.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s); // Remove this script

  s.parentNode.removeChild(s);
} else {
  initialize();
}

var options = {
  threshold: [0, 1.0]
};

var callback = function callback(entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting && entry.target.parentElement.classList.contains('current')) {
      entry.target.play();
    } else {
      entry.target.pause();
    }
  });
};

var observer = new IntersectionObserver(callback, options);
var bgImages = document.querySelectorAll('img.bg');
bgImages.forEach(function (bgImage) {
  bgImage.parentElement.style.backgroundImage = "url('".concat(bgImage.src, "')");
  bgImage.parentElement.classList.add('image');

  if (bgImage.classList.contains('cover')) {
    bgImage.parentElement.classList.add('cover');
  }

  bgImage.remove();
}); // get a list of all videos on the page

var videos = document.querySelectorAll('video'); // Observe each of those elements

videos.forEach(function (video) {
  return observer.observe(video);
});
},{}],"assets/vendor/prettify.js":[function(require,module,exports) {
!function () {
  /*
  Copyright (C) 2013 Google Inc.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  Copyright (C) 2006 Google Inc.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */
  (function () {
    function ba(g) {
      function k() {
        try {
          M.doScroll("left");
        } catch (g) {
          t.setTimeout(k, 50);
          return;
        }

        z("poll");
      }

      function z(k) {
        if ("readystatechange" != k.type || "complete" == A.readyState) ("load" == k.type ? t : A)[B](p + k.type, z, !1), !q && (q = !0) && g.call(t, k.type || k);
      }

      var Y = A.addEventListener,
          q = !1,
          C = !0,
          x = Y ? "addEventListener" : "attachEvent",
          B = Y ? "removeEventListener" : "detachEvent",
          p = Y ? "" : "on";
      if ("complete" == A.readyState) g.call(t, "lazy");else {
        if (A.createEventObject && M.doScroll) {
          try {
            C = !t.frameElement;
          } catch (da) {}

          C && k();
        }

        A[x](p + "DOMContentLoaded", z, !1);
        A[x](p + "readystatechange", z, !1);
        t[x](p + "load", z, !1);
      }
    }

    function U() {
      V && ba(function () {
        var g = N.length;
        ca(g ? function () {
          for (var k = 0; k < g; ++k) {
            (function (g) {
              t.setTimeout(function () {
                t.exports[N[g]].apply(t, arguments);
              }, 0);
            })(k);
          }
        } : void 0);
      });
    }

    for (var t = window, A = document, M = A.documentElement, O = A.head || A.getElementsByTagName("head")[0] || M, B = "", F = A.getElementsByTagName("script"), q = F.length; 0 <= --q;) {
      var P = F[q],
          Z = P.src.match(/^[^?#]*\/run_prettify\.js(\?[^#]*)?(?:#.*)?$/);

      if (Z) {
        B = Z[1] || "";
        P.parentNode.removeChild(P);
        break;
      }
    }

    var V = !0,
        H = [],
        Q = [],
        N = [];
    B.replace(/[?&]([^&=]+)=([^&]+)/g, function (g, k, z) {
      z = decodeURIComponent(z);
      k = decodeURIComponent(k);
      "autorun" == k ? V = !/^[0fn]/i.test(z) : "lang" == k ? H.push(z) : "skin" == k ? Q.push(z) : "callback" == k && N.push(z);
    });
    q = 0;

    for (B = H.length; q < B; ++q) {
      (function () {
        var g = A.createElement("script");

        g.onload = g.onerror = g.onreadystatechange = function () {
          !g || g.readyState && !/loaded|complete/.test(g.readyState) || (g.onerror = g.onload = g.onreadystatechange = null, --T, T || t.setTimeout(U, 0), g.parentNode && g.parentNode.removeChild(g), g = null);
        };

        g.type = "text/javascript";
        g.src = "https://cdn.rawgit.com/google/code-prettify/master/loader/lang-" + encodeURIComponent(H[q]) + ".js";
        O.insertBefore(g, O.firstChild);
      })(H[q]);
    }

    for (var T = H.length, F = [], q = 0, B = Q.length; q < B; ++q) {
      F.push("https://cdn.rawgit.com/google/code-prettify/master/loader/skins/" + encodeURIComponent(Q[q]) + ".css");
    }

    F.push("https://cdn.rawgit.com/google/code-prettify/master/loader/prettify.css");

    (function (g) {
      function k(q) {
        if (q !== z) {
          var t = A.createElement("link");
          t.rel = "stylesheet";
          t.type = "text/css";
          q + 1 < z && (t.error = t.onerror = function () {
            k(q + 1);
          });
          t.href = g[q];
          O.appendChild(t);
        }
      }

      var z = g.length;
      k(0);
    })(F);

    var ca = function () {
      window.PR_SHOULD_USE_CONTINUATION = !0;
      var g;

      (function () {
        function k(a) {
          function d(e) {
            var b = e.charCodeAt(0);
            if (92 !== b) return b;
            var a = e.charAt(1);
            return (b = W[a]) ? b : "0" <= a && "7" >= a ? parseInt(e.substring(1), 8) : "u" === a || "x" === a ? parseInt(e.substring(2), 16) : e.charCodeAt(1);
          }

          function f(e) {
            if (32 > e) return (16 > e ? "\\x0" : "\\x") + e.toString(16);
            e = String.fromCharCode(e);
            return "\\" === e || "-" === e || "]" === e || "^" === e ? "\\" + e : e;
          }

          function b(e) {
            var b = e.substring(1, e.length - 1).match(/\\u[0-9A-Fa-f]{4}|\\x[0-9A-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\s\S]|-|[^-\\]/g);
            e = [];
            var a = "^" === b[0],
                c = ["["];
            a && c.push("^");

            for (var a = a ? 1 : 0, h = b.length; a < h; ++a) {
              var l = b[a];
              if (/\\[bdsw]/i.test(l)) c.push(l);else {
                var l = d(l),
                    n;
                a + 2 < h && "-" === b[a + 1] ? (n = d(b[a + 2]), a += 2) : n = l;
                e.push([l, n]);
                65 > n || 122 < l || (65 > n || 90 < l || e.push([Math.max(65, l) | 32, Math.min(n, 90) | 32]), 97 > n || 122 < l || e.push([Math.max(97, l) & -33, Math.min(n, 122) & -33]));
              }
            }

            e.sort(function (e, a) {
              return e[0] - a[0] || a[1] - e[1];
            });
            b = [];
            h = [];

            for (a = 0; a < e.length; ++a) {
              l = e[a], l[0] <= h[1] + 1 ? h[1] = Math.max(h[1], l[1]) : b.push(h = l);
            }

            for (a = 0; a < b.length; ++a) {
              l = b[a], c.push(f(l[0])), l[1] > l[0] && (l[1] + 1 > l[0] && c.push("-"), c.push(f(l[1])));
            }

            c.push("]");
            return c.join("");
          }

          function g(e) {
            for (var a = e.source.match(/(?:\[(?:[^\x5C\x5D]|\\[\s\S])*\]|\\u[A-Fa-f0-9]{4}|\\x[A-Fa-f0-9]{2}|\\[0-9]+|\\[^ux0-9]|\(\?[:!=]|[\(\)\^]|[^\x5B\x5C\(\)\^]+)/g), c = a.length, d = [], h = 0, l = 0; h < c; ++h) {
              var n = a[h];
              "(" === n ? ++l : "\\" === n.charAt(0) && (n = +n.substring(1)) && (n <= l ? d[n] = -1 : a[h] = f(n));
            }

            for (h = 1; h < d.length; ++h) {
              -1 === d[h] && (d[h] = ++k);
            }

            for (l = h = 0; h < c; ++h) {
              n = a[h], "(" === n ? (++l, d[l] || (a[h] = "(?:")) : "\\" === n.charAt(0) && (n = +n.substring(1)) && n <= l && (a[h] = "\\" + d[n]);
            }

            for (h = 0; h < c; ++h) {
              "^" === a[h] && "^" !== a[h + 1] && (a[h] = "");
            }

            if (e.ignoreCase && I) for (h = 0; h < c; ++h) {
              n = a[h], e = n.charAt(0), 2 <= n.length && "[" === e ? a[h] = b(n) : "\\" !== e && (a[h] = n.replace(/[a-zA-Z]/g, function (a) {
                a = a.charCodeAt(0);
                return "[" + String.fromCharCode(a & -33, a | 32) + "]";
              }));
            }
            return a.join("");
          }

          for (var k = 0, I = !1, m = !1, J = 0, c = a.length; J < c; ++J) {
            var r = a[J];
            if (r.ignoreCase) m = !0;else if (/[a-z]/i.test(r.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ""))) {
              I = !0;
              m = !1;
              break;
            }
          }

          for (var W = {
            b: 8,
            t: 9,
            n: 10,
            v: 11,
            f: 12,
            r: 13
          }, u = [], J = 0, c = a.length; J < c; ++J) {
            r = a[J];
            if (r.global || r.multiline) throw Error("" + r);
            u.push("(?:" + g(r) + ")");
          }

          return new RegExp(u.join("|"), m ? "gi" : "g");
        }

        function q(a, d) {
          function f(a) {
            var c = a.nodeType;

            if (1 == c) {
              if (!b.test(a.className)) {
                for (c = a.firstChild; c; c = c.nextSibling) {
                  f(c);
                }

                c = a.nodeName.toLowerCase();
                if ("br" === c || "li" === c) g[m] = "\n", I[m << 1] = k++, I[m++ << 1 | 1] = a;
              }
            } else if (3 == c || 4 == c) c = a.nodeValue, c.length && (c = d ? c.replace(/\r\n?/g, "\n") : c.replace(/[ \t\r\n]+/g, " "), g[m] = c, I[m << 1] = k, k += c.length, I[m++ << 1 | 1] = a);
          }

          var b = /(?:^|\s)nocode(?:\s|$)/,
              g = [],
              k = 0,
              I = [],
              m = 0;
          f(a);
          return {
            a: g.join("").replace(/\n$/, ""),
            c: I
          };
        }

        function t(a, d, f, b, g) {
          f && (a = {
            h: a,
            l: 1,
            j: null,
            m: null,
            a: f,
            c: null,
            i: d,
            g: null
          }, b(a), g.push.apply(g, a.g));
        }

        function A(a) {
          for (var d = void 0, f = a.firstChild; f; f = f.nextSibling) {
            var b = f.nodeType,
                d = 1 === b ? d ? a : f : 3 === b ? T.test(f.nodeValue) ? a : d : d;
          }

          return d === a ? void 0 : d;
        }

        function C(a, d) {
          function f(a) {
            for (var m = a.i, k = a.h, c = [m, "pln"], r = 0, W = a.a.match(g) || [], u = {}, e = 0, q = W.length; e < q; ++e) {
              var D = W[e],
                  w = u[D],
                  h = void 0,
                  l;
              if ("string" === typeof w) l = !1;else {
                var n = b[D.charAt(0)];
                if (n) h = D.match(n[1]), w = n[0];else {
                  for (l = 0; l < p; ++l) {
                    if (n = d[l], h = D.match(n[1])) {
                      w = n[0];
                      break;
                    }
                  }

                  h || (w = "pln");
                }
                !(l = 5 <= w.length && "lang-" === w.substring(0, 5)) || h && "string" === typeof h[1] || (l = !1, w = "src");
                l || (u[D] = w);
              }
              n = r;
              r += D.length;

              if (l) {
                l = h[1];
                var E = D.indexOf(l),
                    G = E + l.length;
                h[2] && (G = D.length - h[2].length, E = G - l.length);
                w = w.substring(5);
                t(k, m + n, D.substring(0, E), f, c);
                t(k, m + n + E, l, F(w, l), c);
                t(k, m + n + G, D.substring(G), f, c);
              } else c.push(m + n, w);
            }

            a.g = c;
          }

          var b = {},
              g;

          (function () {
            for (var f = a.concat(d), m = [], p = {}, c = 0, r = f.length; c < r; ++c) {
              var q = f[c],
                  u = q[3];
              if (u) for (var e = u.length; 0 <= --e;) {
                b[u.charAt(e)] = q;
              }
              q = q[1];
              u = "" + q;
              p.hasOwnProperty(u) || (m.push(q), p[u] = null);
            }

            m.push(/[\0-\uffff]/);
            g = k(m);
          })();

          var p = d.length;
          return f;
        }

        function x(a) {
          var d = [],
              f = [];
          a.tripleQuotedStrings ? d.push(["str", /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/, null, "'\""]) : a.multiLineStrings ? d.push(["str", /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, null, "'\"`"]) : d.push(["str", /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, null, "\"'"]);
          a.verbatimStrings && f.push(["str", /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
          var b = a.hashComments;
          b && (a.cStyleComments ? (1 < b ? d.push(["com", /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, "#"]) : d.push(["com", /^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/, null, "#"]), f.push(["str", /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/, null])) : d.push(["com", /^#[^\r\n]*/, null, "#"]));
          a.cStyleComments && (f.push(["com", /^\/\/[^\r\n]*/, null]), f.push(["com", /^\/\*[\s\S]*?(?:\*\/|$)/, null]));

          if (b = a.regexLiterals) {
            var g = (b = 1 < b ? "" : "\n\r") ? "." : "[\\S\\s]";
            f.push(["lang-regex", RegExp("^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*(" + ("/(?=[^/*" + b + "])(?:[^/\\x5B\\x5C" + b + "]|\\x5C" + g + "|\\x5B(?:[^\\x5C\\x5D" + b + "]|\\x5C" + g + ")*(?:\\x5D|$))+/") + ")")]);
          }

          (b = a.types) && f.push(["typ", b]);
          b = ("" + a.keywords).replace(/^ | $/g, "");
          b.length && f.push(["kwd", new RegExp("^(?:" + b.replace(/[\s,]+/g, "|") + ")\\b"), null]);
          d.push(["pln", /^\s+/, null, " \r\n\t\xA0"]);
          b = "^.[^\\s\\w.$@'\"`/\\\\]*";
          a.regexLiterals && (b += "(?!s*/)");
          f.push(["lit", /^@[a-z_$][a-z_$@0-9]*/i, null], ["typ", /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null], ["pln", /^[a-z_$][a-z_$@0-9]*/i, null], ["lit", /^(?:0x[a-f0-9]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+\-]?\d+)?)[a-z]*/i, null, "0123456789"], ["pln", /^\\[\s\S]?/, null], ["pun", new RegExp(b), null]);
          return C(d, f);
        }

        function B(a, d, f) {
          function b(a) {
            var c = a.nodeType;
            if (1 == c && !k.test(a.className)) {
              if ("br" === a.nodeName) g(a), a.parentNode && a.parentNode.removeChild(a);else for (a = a.firstChild; a; a = a.nextSibling) {
                b(a);
              }
            } else if ((3 == c || 4 == c) && f) {
              var d = a.nodeValue,
                  p = d.match(q);
              p && (c = d.substring(0, p.index), a.nodeValue = c, (d = d.substring(p.index + p[0].length)) && a.parentNode.insertBefore(m.createTextNode(d), a.nextSibling), g(a), c || a.parentNode.removeChild(a));
            }
          }

          function g(a) {
            function b(a, c) {
              var d = c ? a.cloneNode(!1) : a,
                  n = a.parentNode;

              if (n) {
                var n = b(n, 1),
                    e = a.nextSibling;
                n.appendChild(d);

                for (var f = e; f; f = e) {
                  e = f.nextSibling, n.appendChild(f);
                }
              }

              return d;
            }

            for (; !a.nextSibling;) {
              if (a = a.parentNode, !a) return;
            }

            a = b(a.nextSibling, 0);

            for (var d; (d = a.parentNode) && 1 === d.nodeType;) {
              a = d;
            }

            c.push(a);
          }

          for (var k = /(?:^|\s)nocode(?:\s|$)/, q = /\r\n?|\n/, m = a.ownerDocument, p = m.createElement("li"); a.firstChild;) {
            p.appendChild(a.firstChild);
          }

          for (var c = [p], r = 0; r < c.length; ++r) {
            b(c[r]);
          }

          d === (d | 0) && c[0].setAttribute("value", d);
          var t = m.createElement("ol");
          t.className = "linenums";
          d = Math.max(0, d - 1 | 0) || 0;

          for (var r = 0, u = c.length; r < u; ++r) {
            p = c[r], p.className = "L" + (r + d) % 10, p.firstChild || p.appendChild(m.createTextNode("\xA0")), t.appendChild(p);
          }

          a.appendChild(t);
        }

        function p(a, d) {
          for (var f = d.length; 0 <= --f;) {
            var b = d[f];
            X.hasOwnProperty(b) ? R.console && console.warn("cannot override language handler %s", b) : X[b] = a;
          }
        }

        function F(a, d) {
          a && X.hasOwnProperty(a) || (a = /^\s*</.test(d) ? "default-markup" : "default-code");
          return X[a];
        }

        function H(a) {
          var d = a.j;

          try {
            var f = q(a.h, a.l),
                b = f.a;
            a.a = b;
            a.c = f.c;
            a.i = 0;
            F(d, b)(a);
            var g = /\bMSIE\s(\d+)/.exec(navigator.userAgent),
                g = g && 8 >= +g[1],
                d = /\n/g,
                p = a.a,
                k = p.length,
                f = 0,
                m = a.c,
                t = m.length,
                b = 0,
                c = a.g,
                r = c.length,
                x = 0;
            c[r] = k;
            var u, e;

            for (e = u = 0; e < r;) {
              c[e] !== c[e + 2] ? (c[u++] = c[e++], c[u++] = c[e++]) : e += 2;
            }

            r = u;

            for (e = u = 0; e < r;) {
              for (var A = c[e], D = c[e + 1], w = e + 2; w + 2 <= r && c[w + 1] === D;) {
                w += 2;
              }

              c[u++] = A;
              c[u++] = D;
              e = w;
            }

            c.length = u;
            var h = a.h;
            a = "";
            h && (a = h.style.display, h.style.display = "none");

            try {
              for (; b < t;) {
                var l = m[b + 2] || k,
                    n = c[x + 2] || k,
                    w = Math.min(l, n),
                    E = m[b + 1],
                    G;

                if (1 !== E.nodeType && (G = p.substring(f, w))) {
                  g && (G = G.replace(d, "\r"));
                  E.nodeValue = G;
                  var aa = E.ownerDocument,
                      v = aa.createElement("span");
                  v.className = c[x + 1];
                  var B = E.parentNode;
                  B.replaceChild(v, E);
                  v.appendChild(E);
                  f < l && (m[b + 1] = E = aa.createTextNode(p.substring(w, l)), B.insertBefore(E, v.nextSibling));
                }

                f = w;
                f >= l && (b += 2);
                f >= n && (x += 2);
              }
            } finally {
              h && (h.style.display = a);
            }
          } catch (y) {
            R.console && console.log(y && y.stack || y);
          }
        }

        var R = window,
            K = ["break,continue,do,else,for,if,return,while"],
            L = [[K, "auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"], "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],
            S = [L, "alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],
            M = [L, "abstract,assert,boolean,byte,extends,finally,final,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],
            N = [L, "abstract,as,base,bool,by,byte,checked,decimal,delegate,descending,dynamic,event,finally,fixed,foreach,from,group,implicit,in,interface,internal,into,is,let,lock,null,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"],
            L = [L, "debugger,eval,export,function,get,instanceof,null,set,undefined,var,with,Infinity,NaN"],
            O = [K, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],
            P = [K, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],
            K = [K, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"],
            Q = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,
            T = /\S/,
            U = x({
          keywords: [S, N, M, L, "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END", O, P, K],
          hashComments: !0,
          cStyleComments: !0,
          multiLineStrings: !0,
          regexLiterals: !0
        }),
            X = {};
        p(U, ["default-code"]);
        p(C([], [["pln", /^[^<?]+/], ["dec", /^<!\w[^>]*(?:>|$)/], ["com", /^<\!--[\s\S]*?(?:-\->|$)/], ["lang-", /^<\?([\s\S]+?)(?:\?>|$)/], ["lang-", /^<%([\s\S]+?)(?:%>|$)/], ["pun", /^(?:<[%?]|[%?]>)/], ["lang-", /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i], ["lang-js", /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i], ["lang-css", /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i], ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]]), "default-markup htm html mxml xhtml xml xsl".split(" "));
        p(C([["pln", /^[\s]+/, null, " \t\r\n"], ["atv", /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, "\"'"]], [["tag", /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i], ["atn", /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i], ["lang-uq.val", /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/], ["pun", /^[=<>\/]+/], ["lang-js", /^on\w+\s*=\s*\"([^\"]+)\"/i], ["lang-js", /^on\w+\s*=\s*\'([^\']+)\'/i], ["lang-js", /^on\w+\s*=\s*([^\"\'>\s]+)/i], ["lang-css", /^style\s*=\s*\"([^\"]+)\"/i], ["lang-css", /^style\s*=\s*\'([^\']+)\'/i], ["lang-css", /^style\s*=\s*([^\"\'>\s]+)/i]]), ["in.tag"]);
        p(C([], [["atv", /^[\s\S]+/]]), ["uq.val"]);
        p(x({
          keywords: S,
          hashComments: !0,
          cStyleComments: !0,
          types: Q
        }), "c cc cpp cxx cyc m".split(" "));
        p(x({
          keywords: "null,true,false"
        }), ["json"]);
        p(x({
          keywords: N,
          hashComments: !0,
          cStyleComments: !0,
          verbatimStrings: !0,
          types: Q
        }), ["cs"]);
        p(x({
          keywords: M,
          cStyleComments: !0
        }), ["java"]);
        p(x({
          keywords: K,
          hashComments: !0,
          multiLineStrings: !0
        }), ["bash", "bsh", "csh", "sh"]);
        p(x({
          keywords: O,
          hashComments: !0,
          multiLineStrings: !0,
          tripleQuotedStrings: !0
        }), ["cv", "py", "python"]);
        p(x({
          keywords: "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",
          hashComments: !0,
          multiLineStrings: !0,
          regexLiterals: 2
        }), ["perl", "pl", "pm"]);
        p(x({
          keywords: P,
          hashComments: !0,
          multiLineStrings: !0,
          regexLiterals: !0
        }), ["rb", "ruby"]);
        p(x({
          keywords: L,
          cStyleComments: !0,
          regexLiterals: !0
        }), ["javascript", "js"]);
        p(x({
          keywords: "all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",
          hashComments: 3,
          cStyleComments: !0,
          multilineStrings: !0,
          tripleQuotedStrings: !0,
          regexLiterals: !0
        }), ["coffee"]);
        p(C([], [["str", /^[\s\S]+/]]), ["regex"]);
        var V = R.PR = {
          createSimpleLexer: C,
          registerLangHandler: p,
          sourceDecorator: x,
          PR_ATTRIB_NAME: "atn",
          PR_ATTRIB_VALUE: "atv",
          PR_COMMENT: "com",
          PR_DECLARATION: "dec",
          PR_KEYWORD: "kwd",
          PR_LITERAL: "lit",
          PR_NOCODE: "nocode",
          PR_PLAIN: "pln",
          PR_PUNCTUATION: "pun",
          PR_SOURCE: "src",
          PR_STRING: "str",
          PR_TAG: "tag",
          PR_TYPE: "typ",
          prettyPrintOne: function prettyPrintOne(a, d, f) {
            f = f || !1;
            d = d || null;
            var b = document.createElement("div");
            b.innerHTML = "<pre>" + a + "</pre>";
            b = b.firstChild;
            f && B(b, f, !0);
            H({
              j: d,
              m: f,
              h: b,
              l: 1,
              a: null,
              i: null,
              c: null,
              g: null
            });
            return b.innerHTML;
          },
          prettyPrint: g = g = function g(a, d) {
            function f() {
              for (var b = R.PR_SHOULD_USE_CONTINUATION ? c.now() + 250 : Infinity; r < p.length && c.now() < b; r++) {
                for (var d = p[r], k = h, q = d; q = q.previousSibling;) {
                  var m = q.nodeType,
                      v = (7 === m || 8 === m) && q.nodeValue;
                  if (v ? !/^\??prettify\b/.test(v) : 3 !== m || /\S/.test(q.nodeValue)) break;

                  if (v) {
                    k = {};
                    v.replace(/\b(\w+)=([\w:.%+-]+)/g, function (a, b, c) {
                      k[b] = c;
                    });
                    break;
                  }
                }

                q = d.className;

                if ((k !== h || u.test(q)) && !e.test(q)) {
                  m = !1;

                  for (v = d.parentNode; v; v = v.parentNode) {
                    if (w.test(v.tagName) && v.className && u.test(v.className)) {
                      m = !0;
                      break;
                    }
                  }

                  if (!m) {
                    d.className += " prettyprinted";
                    m = k.lang;

                    if (!m) {
                      var m = q.match(t),
                          C;
                      !m && (C = A(d)) && z.test(C.tagName) && (m = C.className.match(t));
                      m && (m = m[1]);
                    }

                    if (x.test(d.tagName)) v = 1;else var v = d.currentStyle,
                        y = g.defaultView,
                        v = (v = v ? v.whiteSpace : y && y.getComputedStyle ? y.getComputedStyle(d, null).getPropertyValue("white-space") : 0) && "pre" === v.substring(0, 3);
                    y = k.linenums;
                    (y = "true" === y || +y) || (y = (y = q.match(/\blinenums\b(?::(\d+))?/)) ? y[1] && y[1].length ? +y[1] : !0 : !1);
                    y && B(d, y, v);
                    H({
                      j: m,
                      h: d,
                      m: y,
                      l: v,
                      a: null,
                      i: null,
                      c: null,
                      g: null
                    });
                  }
                }
              }

              r < p.length ? R.setTimeout(f, 250) : "function" === typeof a && a();
            }

            for (var b = d || document.body, g = b.ownerDocument || document, b = [b.getElementsByTagName("pre"), b.getElementsByTagName("code"), b.getElementsByTagName("xmp")], p = [], k = 0; k < b.length; ++k) {
              for (var m = 0, q = b[k].length; m < q; ++m) {
                p.push(b[k][m]);
              }
            }

            var b = null,
                c = Date;
            c.now || (c = {
              now: function now() {
                return +new Date();
              }
            });
            var r = 0,
                t = /\blang(?:uage)?-([\w.]+)(?!\S)/,
                u = /\bprettyprint\b/,
                e = /\bprettyprinted\b/,
                x = /pre|xmp/i,
                z = /^code$/i,
                w = /^(?:pre|code|xmp)$/i,
                h = {};
            f();
          }
        },
            S = R.define;
        "function" === typeof S && S.amd && S("google-code-prettify", [], function () {
          return V;
        });
      })();

      return g;
    }();

    T || t.setTimeout(U, 0);
  })();
}();
},{}],"main.js":[function(require,module,exports) {
"use strict";

require("./assets/vendor/slides");

require("./assets/vendor/prettify");
},{"./assets/vendor/slides":"assets/vendor/slides.js","./assets/vendor/prettify":"assets/vendor/prettify.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51240" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map