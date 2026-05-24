const openButton = document.querySelector("[data-video-open]");
const modal = document.querySelector("[data-video-modal]");
const closeButtons = document.querySelectorAll("[data-video-close]");
const iframe = document.querySelector("[data-video-iframe]");

// YouTube embed can show Error 153 when the page is opened as file://.
// For reliable testing, open this folder through a local server:
// python3 -m http.server 8000
// then open http://localhost:8000
const videoUrl = "https://www.youtube-nocookie.com/embed/GNjSu8IjiYY?autoplay=1&rel=0&modestbranding=1";

function openVideoModal() {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  iframe.src = videoUrl;
}

function closeVideoModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  iframe.src = "";
}

openButton.addEventListener("click", openVideoModal);

closeButtons.forEach((button) => {
  button.addEventListener("click", closeVideoModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeVideoModal();
  }
});

// Quiz Logic
const quizPreview = document.querySelector("[data-quiz-preview]");

if (quizPreview) {
  const quizSteps = [...quizPreview.querySelectorAll("[data-step]")];
  const quizOptions = [...quizPreview.querySelectorAll("[data-answer]")];
  const quizMethods = [...quizPreview.querySelectorAll("[data-contact-method]")];
  const quizProgressBar = quizPreview.querySelector("[data-progress-bar]");
  const quizProgressLabel = quizPreview.querySelector("[data-progress-label]");
  const quizProgressNote = quizPreview.querySelector("[data-progress-note]");
  const quizNextButton = quizPreview.querySelector("[data-next]");
  const quizBackButton = quizPreview.querySelector("[data-back]");
  const quizActions = quizPreview.querySelector("[data-actions]");
  const quizContactInput = quizPreview.querySelector("[data-contact-input]");
  const quizContactLabel = quizPreview.querySelector("[data-contact-label]");
  const quizContactHelper = quizPreview.querySelector("[data-contact-helper]");
  const quizResultScreen = quizPreview.querySelector("[data-result-screen]");
  const quizRestartButton = quizPreview.querySelector("[data-restart]");
  const quizAnswers = {};
  let currentQuizStep = 1;
  let quizAutoAdvanceTimer = null;

  function getActiveQuizStep() {
    return quizSteps.find((step) => Number(step.dataset.step) === currentQuizStep);
  }

  function updateQuizProgress() {
    const total = quizSteps.length;
    const remaining = Math.max(0, total - currentQuizStep);
    quizProgressBar.style.width = `${(currentQuizStep / total) * 100}%`;
    quizProgressLabel.textContent = `Крок ${currentQuizStep} з ${total}`;
    quizProgressNote.textContent = remaining === 1 ? "залишилось 1 питання" : `залишилось ${remaining} питання`;
  }

  function hasValidQuizContact() {
    return Boolean(quizAnswers.contactMethod && quizContactInput.value.trim().length >= 3);
  }

  function updateQuizControls() {
    quizBackButton.hidden = currentQuizStep === 1;
    quizNextButton.textContent = currentQuizStep === quizSteps.length ? "Отримати рекомендацію" : "Далі";

    if (currentQuizStep === quizSteps.length) {
      quizNextButton.disabled = !hasValidQuizContact();
      return;
    }

    const activeStep = getActiveQuizStep();
    quizNextButton.disabled = !activeStep.querySelector(".option.is-selected");
  }

  function showQuizStep(stepNumber) {
    currentQuizStep = Math.min(Math.max(1, stepNumber), quizSteps.length);
    quizSteps.forEach((step) => {
      step.classList.toggle("is-active", Number(step.dataset.step) === currentQuizStep);
    });
    updateQuizProgress();
    updateQuizControls();
  }

  function chooseQuizOption(option) {
    const activeStep = option.closest("[data-step]");
    activeStep.querySelectorAll(".option").forEach((item) => item.classList.remove("is-selected"));
    option.classList.add("is-selected");
    quizAnswers[option.dataset.answer] = option.dataset.value;
    if (option.dataset.model) quizAnswers.model = option.dataset.model;
    updateQuizControls();

    window.clearTimeout(quizAutoAdvanceTimer);
    quizAutoAdvanceTimer = window.setTimeout(() => {
      if (currentQuizStep < quizSteps.length) showQuizStep(currentQuizStep + 1);
    }, 420);
  }

  function chooseQuizMethod(method) {
    quizMethods.forEach((item) => item.classList.remove("is-selected"));
    method.classList.add("is-selected");
    quizAnswers.contactMethod = method.dataset.contactMethod;
    quizContactInput.placeholder = quizAnswers.contactMethod === "Telegram" ? "+380... або @username" : "+380...";

    if (quizAnswers.contactMethod === "Telegram") {
      quizContactLabel.textContent = "Ваш телефон або Telegram";
      quizContactHelper.textContent = "Вкажіть телефон або Telegram-нік, щоб менеджер міг написати.";
    } else if (quizAnswers.contactMethod === "Viber") {
      quizContactLabel.textContent = "Телефон, на якому є Viber";
      quizContactHelper.textContent = "Вкажіть номер телефону, привʼязаний до Viber.";
    } else {
      quizContactLabel.textContent = "Ваш номер телефону для звінка";
      quizContactHelper.textContent = "Вкажіть номер телефону, щоб менеджер міг звʼязатися.";
    }

    updateQuizControls();
    quizContactInput.focus();
  }

  function getQuizRecommendation() {
    if (quizAnswers.load === "До 100 кг" || quizAnswers.purpose === "Для закладу або виробництва") return "Big 2.0";
    if (quizAnswers.load === "До 10 кг" && quizAnswers.purpose === "Для дому") return "Family 2.0";
    return quizAnswers.model || "Classic 2.0";
  }

  function showQuizResult() {
    const recommendation = getQuizRecommendation();
    quizPreview.querySelector("[data-steps]").hidden = true;
    quizActions.hidden = true;
    quizResultScreen.classList.add("is-visible");
    quizPreview.querySelector("[data-result-title]").textContent = recommendation;
    quizPreview.querySelector("[data-result-text]").textContent = `Під вашу задачу попередньо підходить ${recommendation}. Менеджер уточнить продукти, обсяг і надішле комплектацію з актуальною ціною.`;
    quizPreview.querySelector("[data-summary-purpose]").textContent = quizAnswers.purpose || "Потрібна консультація";
    quizPreview.querySelector("[data-summary-product]").textContent = quizAnswers.product || "Універсальна комплектація";
    quizPreview.querySelector("[data-summary-contact]").textContent = `${quizAnswers.contactMethod}: ${quizContactInput.value.trim()}`;
    quizProgressBar.style.width = "100%";
    quizProgressLabel.textContent = "Готово";
    quizProgressNote.textContent = "рекомендація сформована";
  }

  quizOptions.forEach((option) => option.addEventListener("click", () => chooseQuizOption(option)));
  quizMethods.forEach((method) => method.addEventListener("click", () => chooseQuizMethod(method)));
  quizContactInput.addEventListener("input", updateQuizControls);

  quizNextButton.addEventListener("click", () => {
    if (quizNextButton.disabled) return;
    if (currentQuizStep === quizSteps.length) {
      quizAnswers.contact = quizContactInput.value.trim();
      showQuizResult();
    } else {
      showQuizStep(currentQuizStep + 1);
    }
  });

  quizBackButton.addEventListener("click", () => {
    window.clearTimeout(quizAutoAdvanceTimer);
    showQuizStep(currentQuizStep - 1);
  });

  quizRestartButton.addEventListener("click", () => {
    Object.keys(quizAnswers).forEach((key) => delete quizAnswers[key]);
    quizOptions.forEach((item) => item.classList.remove("is-selected"));
    quizMethods.forEach((item) => item.classList.remove("is-selected"));
    quizContactInput.value = "";
    quizPreview.querySelector("[data-steps]").hidden = false;
    quizActions.hidden = false;
    quizResultScreen.classList.remove("is-visible");
    showQuizStep(1);
  });

  showQuizStep(1);
}

// TikTok Video Modal Logic
const tiktokModal = document.querySelector("[data-tiktok-modal]");
const tiktokCloseButtons = document.querySelectorAll("[data-tiktok-close]");
const videoTriggers = document.querySelectorAll(".video-trigger");
const tiktokEmbedContainer = document.querySelector("[data-tiktok-embed-container]");
const tiktokLink = document.querySelector(".tiktok-link");
let activeTikTokIframe = null;

function buildTikTokPlayerUrl(videoId) {
  // Detect mobile devices — mobile browsers (iOS Safari, Android Chrome)
  // block autoplay WITH SOUND. So on mobile we disable autoplay
  // and let the user press Play (user gesture allows sound).
  // On desktop we keep autoplay because most desktop browsers allow it.
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const params = new URLSearchParams({
    autoplay: isMobile ? "0" : "1",
    muted: "0",
    controls: "1",
    volume_control: "1",
    fullscreen_button: "1",
    rel: "0",
    progress_bar: "1",
    closed_caption: "1",
    description: "1",
  });

  return `https://www.tiktok.com/player/v1/${videoId}?${params.toString()}`;
}

function sendTikTokPlayerCommand(type) {
  if (!activeTikTokIframe?.contentWindow) return;

  activeTikTokIframe.contentWindow.postMessage({
    type,
    "x-tiktok-player": true,
  }, "*");
}

function requestTikTokFullscreen() {
  const fullscreenTarget = document.querySelector(".tiktok-modal-window") || tiktokModal;

  if (!document.fullscreenElement && fullscreenTarget?.requestFullscreen) {
    fullscreenTarget.requestFullscreen().catch(() => {
      tiktokModal.classList.add("fullscreen-fallback");
    });
  } else {
    tiktokModal.classList.add("fullscreen-fallback");
  }
}

function openTikTokModal(videoId, profile) {
  tiktokModal.classList.add("is-open");
  tiktokModal.classList.add("fullscreen-fallback");
  tiktokModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  // Clear container first
  tiktokEmbedContainer.innerHTML = "";

  // Create iframe with TikTok embed - using oEmbed endpoint
  const iframe = document.createElement("iframe");
  iframe.src = buildTikTokPlayerUrl(videoId);
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.setAttribute("frameborder", "0");
  iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write; gyroscope; accelerometer";
  iframe.setAttribute("allowfullscreen", "");
  iframe.setAttribute("loading", "lazy");
  iframe.style.borderRadius = "8px";

  activeTikTokIframe = iframe;
  tiktokEmbedContainer.appendChild(iframe);

  // Open the exact TikTok video if the embed is blocked or slow.
  tiktokLink.href = `https://www.tiktok.com/@${profile}/video/${videoId}`;

  // The click that opens the modal counts as user intent, so ask the player
  // to start with sound as soon as possible and again after it is ready.
  requestTikTokFullscreen();

  // Mobile detection — on mobile we DON'T programmatically call play,
  // because browsers treat programmatic play as non-user-gesture and force mute.
  // User must press play themselves inside the TikTok player → sound works.
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isMobile) {
    sendTikTokPlayerCommand("play");
  }
  sendTikTokPlayerCommand("unMute");

  iframe.addEventListener("load", () => {
    if (!isMobile) {
      sendTikTokPlayerCommand("play");
    }
    sendTikTokPlayerCommand("unMute");
  });

  if (window.tiktok && window.tiktok.embed) {
    setTimeout(() => {
      window.tiktok.embed.lib.render(tiktokEmbedContainer);
    }, 500);
  }
}

function closeTikTokModal() {
  tiktokModal.classList.remove("is-open");
  tiktokModal.classList.remove("fullscreen-fallback");
  tiktokModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
  tiktokEmbedContainer.innerHTML = "";
  activeTikTokIframe = null;
}

window.addEventListener("message", (event) => {
  if (!event.data?.["x-tiktok-player"]) return;

  if (event.data.type === "onPlayerReady") {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    // On mobile: don't auto-play (browser forces mute) — let user press play.
    // On desktop: auto-play with sound.
    if (!isMobile) {
      sendTikTokPlayerCommand("play");
    }
    sendTikTokPlayerCommand("unMute");
  }
});

videoTriggers.forEach((trigger) => {
  const profile = trigger.dataset.profile;
  trigger.setAttribute("aria-label", `Дивитися відео клієнта @${profile}`);

  trigger.addEventListener("click", () => {
    const videoId = trigger.dataset.videoId;
    const profile = trigger.dataset.profile;
    openTikTokModal(videoId, profile);
  });
});

tiktokCloseButtons.forEach((button) => {
  button.addEventListener("click", closeTikTokModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && tiktokModal.classList.contains("is-open")) {
    closeTikTokModal();
  }
});

// Certificates Slider
const certificateSlider = document.querySelector("[data-certificates-slider]");
const certificatesTrack = document.querySelector("[data-certificates-track]");
const certificateSlides = document.querySelectorAll("[data-certificate-open]");
const certificatesPrevButton = document.querySelector("[data-certificates-prev]");
const certificatesNextButton = document.querySelector("[data-certificates-next]");
const certificateModal = document.querySelector("[data-certificate-modal]");
const certificateModalImage = document.querySelector("[data-certificate-modal-image]");
const certificateCloseButtons = document.querySelectorAll("[data-certificate-close]");

let certificateIndex = 0;

function getCertificatesPerView() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 980) return 2;
  return 3;
}

function getMaxCertificateIndex() {
  return Math.max(0, certificateSlides.length - getCertificatesPerView());
}

function updateCertificatesSlider() {
  if (!certificateSlider || !certificatesTrack || certificateSlides.length === 0) return;

  certificateIndex = Math.min(Math.max(0, certificateIndex), getMaxCertificateIndex());
  certificatesTrack.style.transform = `translate3d(-${certificateSlides[certificateIndex].offsetLeft}px, 0, 0)`;
  certificateSlider.dataset.currentIndex = String(certificateIndex);

  if (certificatesPrevButton) {
    certificatesPrevButton.disabled = certificateIndex === 0;
  }

  if (certificatesNextButton) {
    certificatesNextButton.disabled = certificateIndex === getMaxCertificateIndex();
  }
}

function openCertificateModal(button) {
  if (!certificateModal || !certificateModalImage) return;

  const image = button.querySelector("img");
  certificateModalImage.src = button.dataset.fullImage || image?.src || "";
  certificateModalImage.alt = image?.alt || "Сертифікат Drevos";
  certificateModal.classList.add("is-open");
  certificateModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCertificateModal() {
  if (!certificateModal || !certificateModalImage) return;

  certificateModal.classList.remove("is-open");
  certificateModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  certificateModalImage.src = "";
  certificateModalImage.alt = "";
}

if (certificateSlider && certificatesTrack && certificateSlides.length > 0) {
  const requestedStartIndex = Number.parseInt(certificateSlider.dataset.startIndex || "0", 10);
  certificateIndex = Math.max(Number.isNaN(requestedStartIndex) ? 0 : requestedStartIndex, getMaxCertificateIndex());

  certificatesPrevButton?.addEventListener("click", () => {
    certificateIndex -= 1;
    updateCertificatesSlider();
  });

  certificatesNextButton?.addEventListener("click", () => {
    certificateIndex += 1;
    updateCertificatesSlider();
  });

  certificateSlides.forEach((slide) => {
    slide.addEventListener("click", () => openCertificateModal(slide));
  });

  certificateCloseButtons.forEach((button) => {
    button.addEventListener("click", closeCertificateModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && certificateModal?.classList.contains("is-open")) {
      closeCertificateModal();
    }
  });

  window.addEventListener("resize", updateCertificatesSlider);
  window.addEventListener("load", updateCertificatesSlider);
  updateCertificatesSlider();
  requestAnimationFrame(() => {
    certificatesTrack.classList.add("is-ready");
  });
}

// Custom Modals Management
function initCustomModals() {
  const modalButtons = document.querySelectorAll(".bullet-modal-btn");
  const modals = document.querySelectorAll(".custom-modal");

  // Open modal
  modalButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal
  modals.forEach((modal) => {
    const backdrop = modal.querySelector(".custom-modal-backdrop");
    const closeBtn = modal.querySelector(".custom-modal-close");

    const closeModal = () => {
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    if (backdrop) backdrop.addEventListener("click", closeModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    });

    // Form submission
    const form = modal.querySelector(".custom-modal-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = form.querySelector('input[name="name"]').value;
        const contact = form.querySelector('input[name="contact"]').value;
        const formType = form.getAttribute("data-form-type");

        // You can add form submission logic here (send to server, etc.)
        console.log("Form submitted:", { formType, name, contact });

        // Reset form and close modal
        form.reset();
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Optional: show success message
        alert("Спасибо! Ваша заявка отправлена.");
      });
    }
  });
}

// Initialize custom modals
document.addEventListener("DOMContentLoaded", initCustomModals);
initCustomModals();
