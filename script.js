// ==UserScript==
// @name         chatgpt-page-translate-button
// @description  🍓 let ChatGPT translate the web page you are reading in one click
// @author       mefengl
// @version      0.1.4
// @namespace    https://github.com/mefengl
// @require      https://cdn.jsdelivr.net/npm/moz-readability@0.2.1/Readability.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_addValueChangeListener

// @name:en      ChatGPT Page Translate Button
// @description:en 🍓 let ChatGPT translate the web page you are reading in one click
// @name:zh-CN   ChatGPT 页面翻译按钮
// @description:zh-CN 🍓 让 ChatGPT 一键翻译您正在阅读的网页
// @name:es      Botón de traducción de página de ChatGPT
// @description:es 🍓 permite que ChatGPT traduzca la página web que estás leyendo con un solo clic
// @name:hi      ChatGPT पृष्ठ अनुवाद बटन
// @description:hi 🍓 ChatGPT को वेबपेज जो आप पढ़ रहे हैं को एक क्लिक में अनुवाद करने दें
// @name:ar      زر ترجمة الصفحة لـ ChatGPT
// @description:ar 🍓 دع ChatGPT يترجم صفحة الويب التي تقرأها بنقرة واحدة
// @name:pt      Botão de tradução de página do ChatGPT
// @description:pt 🍓 permita que o ChatGPT traduza a página da web que você está lendo com um clique
// @name:ru      Кнопка перевода страницы ChatGPT
// @description:ru 🍓 позволяет ChatGPT переводить веб-страницу, которую вы читаете, одним щелчком мыши
// @name:ja      ChatGPTページ翻訳ボタン
// @description:ja 🍓 ChatGPTで読んでいるWebページをワンクリックで翻訳
// @name:de      ChatGPT-Seitenübersetzungs-Button
// @description:de 🍓 Lassen Sie ChatGPT die Webseite, die Sie gerade lesen, mit einem Klick übersetzen
// @name:fr      Bouton de traduction de page ChatGPT
// @description:fr 🍓 laissez ChatGPT traduire la page Web que vous lisez en un seul clic
// ==/UserScript==
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ../../packages/chatkit/dist/index.mjs
  function getTextarea() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const textareas = form.querySelectorAll("textarea");
    const result = textareas[0];
    return result;
  }
  function getSubmitButton() {
    const textarea = getTextarea();
    if (!textarea)
      return;
    return textarea.nextElementSibling;
  }
  function getRegenerateButton() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const buttons = form.querySelectorAll("button");
    const result = Array.from(buttons).find((button) => {
      var _a;
      return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("regenerate");
    });
    return result;
  }
  function getStopGeneratingButton() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const buttons = form.querySelectorAll("button");
    const result = Array.from(buttons).find((button) => {
      var _a;
      return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("stop generating");
    });
    return result;
  }
  function getLastResponseElement() {
    const responseElements = document.querySelectorAll(".group.w-full");
    return responseElements[responseElements.length - 1];
  }
  function getLastResponse() {
    const lastResponseElement = getLastResponseElement();
    if (!lastResponseElement)
      return;
    const lastResponse = lastResponseElement.textContent;
    return lastResponse;
  }
  function getTextareaValue() {
    var _a;
    return ((_a = getTextarea()) == null ? void 0 : _a.value) || "";
  }
  function setTextarea(message) {
    const textarea = getTextarea();
    if (!textarea)
      return;
    textarea.value = message;
    textarea.dispatchEvent(new Event("input"));
  }
  function send(message) {
    setTextarea(message);
    const textarea = getTextarea();
    if (!textarea)
      return;
    textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  }
  function regenerate() {
    const regenerateButton = getRegenerateButton();
    if (!regenerateButton)
      return;
    regenerateButton.click();
  }
  function onSend(callback) {
    const textarea = getTextarea();
    if (!textarea)
      return;
    textarea.addEventListener("keydown", function(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        callback();
      }
    });
    const sendButton = getSubmitButton();
    if (!sendButton)
      return;
    sendButton.addEventListener("mousedown", callback);
  }
  function isGenerating() {
    var _a, _b;
    return ((_b = (_a = getSubmitButton()) == null ? void 0 : _a.firstElementChild) == null ? void 0 : _b.childElementCount) === 3;
  }
  function waitForIdle() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!isGenerating()) {
          clearInterval(interval);
          resolve();
        }
      }, 1e3);
    });
  }
  function setListener(key = "prompt_texts") {
    let last_trigger_time = +/* @__PURE__ */ new Date();
    if (location.href.includes("chat.openai")) {
      GM_addValueChangeListener(key, (name, old_value, new_value) => __async(this, null, function* () {
        if (+/* @__PURE__ */ new Date() - last_trigger_time < 500) {
          return;
        }
        last_trigger_time = +/* @__PURE__ */ new Date();
        setTimeout(() => __async(this, null, function* () {
          const prompt_texts = new_value;
          if (prompt_texts.length > 0) {
            let firstTime = true;
            while (prompt_texts.length > 0) {
              if (!firstTime) {
                yield new Promise((resolve) => setTimeout(resolve, 2e3));
              }
              if (!firstTime && chatgpt.isGenerating()) {
                continue;
              }
              firstTime = false;
              const prompt_text = prompt_texts.shift() || "";
              chatgpt.send(prompt_text);
            }
          }
        }), 0);
        GM_setValue(key, []);
      }));
    }
  }
  var chatgpt = {
    getTextarea,
    getSubmitButton,
    getRegenerateButton,
    getStopGeneratingButton,
    getLastResponseElement,
    getLastResponse,
    getTextareaValue,
    setTextarea,
    send,
    regenerate,
    onSend,
    isGenerating,
    waitForIdle,
    setListener
  };
  var chatgpt_default = chatgpt;

  // src/createButton/index.ts
  function createButton(callback) {
    if (window.location.href.includes("chat.openai")) {
      return;
    }
    const hideRight = document.title.match(/[\u4e00-\u9fa5]/) ? "-130px" : "-120px";
    const button = document.createElement("button");
    button.innerHTML = "\u7F51\u9875\u7FFB\u8BD1";
    button.style.position = "fixed";
    button.style.width = "140px";
    button.style.top = "120px";
    button.style.right = hideRight;
    button.style.zIndex = "999999";
    button.style.backgroundColor = "#4285f4";
    button.style.color = "#fff";
    button.style.opacity = "0.8";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.padding = "10px 16px";
    button.style.fontSize = "18px";
    button.style.cursor = "pointer";
    button.style.transition = "right 0.3s";
    document.body.appendChild(button);
    button.addEventListener("mouseenter", () => {
      button.style.right = "-10px";
    });
    button.addEventListener("mouseleave", () => {
      button.style.right = hideRight;
    });
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        button.style.display = "none";
      } else {
        button.style.display = "block";
      }
    });
    button.addEventListener("click", callback);
  }
  var createButton_default = createButton;

  // src/SimpleArticleSegmentation/index.ts
  var MIN_PARAGRAPH_LENGTH = 1600;
  var MAX_PARAGRAPH_LENGTH = 1800;
  var SimpleArticleSegmentation = class {
    constructor(text) {
      this.text = text;
    }
    segment() {
      const paragraphs = [];
      const sentences = this.text.split(new RegExp("(?<=[.!?])\\s+"));
      let paragraph = "";
      for (const sentence of sentences) {
        if (paragraph.length + sentence.length + 1 <= MAX_PARAGRAPH_LENGTH) {
          paragraph += (paragraph.length > 0 ? " " : "") + sentence;
        } else {
          if (paragraph.length >= MIN_PARAGRAPH_LENGTH) {
            paragraphs.push(paragraph);
            paragraph = sentence;
          } else {
            paragraph += " " + sentence;
          }
        }
      }
      if (paragraph.length >= MIN_PARAGRAPH_LENGTH) {
        paragraphs.push(paragraph);
      }
      return paragraphs;
    }
  };
  var SimpleArticleSegmentation_default = SimpleArticleSegmentation;

  // src/getParagraphs/index.ts
  function getParagraphs() {
    try {
      let docClone = document.cloneNode(true);
      let article = new Readability(docClone).parse();
      if (article && article.textContent) {
        const segmenter = new SimpleArticleSegmentation_default(article.textContent);
        const paragraphs = segmenter.segment();
        return paragraphs;
      } else {
        console.warn("Readability.js could not extract any text content from this page.");
        return [];
      }
    } catch (error) {
      console.error("An error occurred while using Readability.js:", error);
      return [];
    }
  }
  var getParagraphs_default = getParagraphs;

  // src/index.ts
  function initialize() {
    return __async(this, null, function* () {
      yield new Promise((resolve) => window.addEventListener("load", resolve));
      yield new Promise((resolve) => setTimeout(resolve, 1e3));
    });
  }
  function main() {
    return __async(this, null, function* () {
      yield initialize();
      const key = "prompt_texts";
      chatgpt_default.setListener(key);
      const translateWeb = () => __async(this, null, function* () {
        const paragraphs = getParagraphs_default();
        const prompt_texts = paragraphs.map((paragraph) => {
          return `${paragraph}
translate above paragraph to Chinese with compact and intuitive format:`;
        });
        GM_setValue(key, prompt_texts);
      });
      createButton_default(translateWeb);
    });
  }
  (function() {
    main();
  })();
})();
