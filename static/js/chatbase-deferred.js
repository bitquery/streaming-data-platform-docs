/**
 * Load Chatbase only after the first user interaction (or a short idle
 * timeout). Keeps the chatbot available in production without paying the
 * embed cost on every initial page load.
 */
(function deferChatbase() {
  if (typeof window === "undefined") return;

  var CHATBOT_ID = "Vz0cwoEYRJW6n5B2JeSeu";
  var SCRIPT_SRC = "https://www.chatbase.co/embed.min.js";
  var loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    cleanup();

    if (!window.chatbaseConfig) {
      window.chatbaseConfig = { chatbotId: CHATBOT_ID };
    }

    var s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.id = CHATBOT_ID;
    s.setAttribute("domain", "www.chatbase.co");
    document.body.appendChild(s);
  }

  var events = ["pointerdown", "keydown", "touchstart", "scroll"];

  function cleanup() {
    events.forEach(function (evt) {
      window.removeEventListener(evt, load, { capture: true });
    });
    if (idleId && window.cancelIdleCallback) {
      window.cancelIdleCallback(idleId);
    }
    if (timer) clearTimeout(timer);
  }

  events.forEach(function (evt) {
    window.addEventListener(evt, load, { once: true, passive: true, capture: true });
  });

  var idleId = null;
  var timer = setTimeout(load, 8000);
  if (window.requestIdleCallback) {
    idleId = window.requestIdleCallback(load, { timeout: 10000 });
  }
})();
