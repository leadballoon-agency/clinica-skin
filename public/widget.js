/**
 * Follow Up Systems — Video Widget Embed
 *
 * Usage:
 * <script src="https://followupsystems.co.uk/widget.js"
 *   data-key="CLIENT_KEY"
 *   data-project="PROJECT_ID"
 *   data-whatsapp="+447..."
 *   data-booking="https://link.clinic.co.uk/widget/booking/..."
 *   data-agent="true">
 * </script>
 *
 * Triggers on ?v=welcome (or any video slot in the URL query string).
 */
(function () {
  'use strict';

  // Double-init guard
  if (window.__fusWidgetLoaded) return;
  window.__fusWidgetLoaded = true;

  var currentScript =
    document.currentScript ||
    document.querySelector('script[data-key][src*="widget.js"]');

  function attr(name) {
    return currentScript && currentScript.getAttribute(name);
  }

  var config = {
    key: attr('data-key') || '',
    project: attr('data-project') || '',
    whatsapp: attr('data-whatsapp') || '',
    booking: attr('data-booking') || '',
    agent: attr('data-agent') === 'true',
    preview: attr('data-preview') === 'true',
  };

  if (!config.key) return;

  // API base — explicit override, or auto-detect from script src
  var API_BASE = (function () {
    var explicit = attr('data-api');
    if (explicit) return explicit.replace(/\/$/, '');
    try {
      var src = attr('src');
      if (src && src.startsWith('http')) return new URL(src).origin;
    } catch (e) {}
    return window.location.origin;
  })();

  // ─── Anonymous ID + Event Tracking ──────────────────────────────────────────
  var ANON_KEY = 'fus_aid';
  var anonymousId = (function () {
    try {
      var id = localStorage.getItem(ANON_KEY);
      if (!id) {
        id = 'fus_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem(ANON_KEY, id);
      }
      return id;
    } catch (e) {
      return null;
    }
  })();

  // Capture fbclid from URL for Meta CAPI
  (function captureFbclid() {
    try {
      var params = new URLSearchParams(window.location.search);
      var fbclid = params.get('fbclid');
      if (fbclid) {
        var fbc = 'fb.1.' + Date.now() + '.' + fbclid;
        document.cookie = '_fbc=' + fbc + ';path=/;max-age=7776000;SameSite=Lax';
        localStorage.setItem('fus_fbc', fbc);
        localStorage.setItem('fus_fbclid', fbclid);
      }
      // Capture _fbp if Meta pixel set it
      var fbpMatch = document.cookie.match(/(^|;)\s*_fbp=([^;]+)/);
      if (fbpMatch) localStorage.setItem('fus_fbp', fbpMatch[2]);
    } catch (e) {}
  })();

  function fusTrack(event, metadata) {
    try {
      // Enrich metadata with page URL and Meta click/browser IDs for CAPI
      var enriched = metadata || {};
      enriched.pageUrl = window.location.href;
      try {
        var fbc = localStorage.getItem('fus_fbc');
        var fbp = localStorage.getItem('fus_fbp');
        var fbclid = localStorage.getItem('fus_fbclid');
        if (fbc) enriched.fbc = fbc;
        if (fbp) enriched.fbp = fbp;
        if (fbclid) enriched.fbclid = fbclid;
      } catch (e) {}

      var payload = JSON.stringify({
        key: config.key,
        anonymousId: anonymousId,
        event: event,
        slot: enriched.slot || null,
        metadata: enriched,
        projectId: config.project || null,
      });
      // Use sendBeacon for reliability (fire-and-forget, survives page unload)
      if (navigator.sendBeacon) {
        var blob = new Blob([payload], { type: 'text/plain' });
        navigator.sendBeacon(API_BASE + '/api/widget/events', blob);
      } else {
        fetch(API_BASE + '/api/widget/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(function () {});
      }
    } catch (e) {}
  }

  // Check URL for ?v= and ?lid= parameters
  var urlParams;
  try {
    urlParams = new URLSearchParams(window.location.search);
  } catch (e) {
    return;
  }
  var videoSlot = urlParams.get('v');

  // If ?lid= is present, this visitor came from a follow-up sequence — store it
  var LID_KEY = 'fus_lid';
  var NAME_KEY = 'fus_name';
  var leadId = urlParams.get('lid');
  if (leadId) {
    try { localStorage.setItem(LID_KEY, leadId); } catch (e) {}
  } else {
    try { leadId = localStorage.getItem(LID_KEY); } catch (e) {}
  }

  // If ?name= is present, store for personalisation across sessions
  var visitorName = urlParams.get('name');
  if (visitorName) {
    try { localStorage.setItem(NAME_KEY, visitorName); } catch (e) {}
  } else {
    try { visitorName = localStorage.getItem(NAME_KEY); } catch (e) {}
  }

  // Fetch widget config from API (pass anonymousId + leadId for personalised welcome)
  var widgetUrl = API_BASE + '/api/widget/' + encodeURIComponent(config.key);
  if (anonymousId) widgetUrl += '?aid=' + encodeURIComponent(anonymousId);
  if (leadId) widgetUrl += (widgetUrl.indexOf('?') > -1 ? '&' : '?') + 'lid=' + encodeURIComponent(leadId);
  if (visitorName) widgetUrl += (widgetUrl.indexOf('?') > -1 ? '&' : '?') + 'name=' + encodeURIComponent(visitorName);
  if (config.project) widgetUrl += (widgetUrl.indexOf('?') > -1 ? '&' : '?') + 'pid=' + encodeURIComponent(config.project);
  widgetUrl += (widgetUrl.indexOf('?') > -1 ? '&' : '?') + '_t=' + Date.now();
  console.log('[FUS] Init: videoSlot=' + videoSlot + ', key=' + config.key + ', url=' + widgetUrl.substring(0, 80));
  fetch(widgetUrl, { cache: 'no-store' })
    .then(function (res) {
      console.log('[FUS] API response: ' + res.status);
      if (!res.ok) return null;
      return res.json();
    })
    .then(function (data) {
      if (!data) { console.log('[FUS] No data returned'); return; }
      console.log('[FUS] Data received: videos=' + Object.keys(data.videos || {}).join(',') + ', videoSlot=' + videoSlot);

      // Show video modal if ?v= param
      var showingVideoOverlay = false;
      if (videoSlot) {
        var video = data.videos && data.videos[videoSlot];
        console.log('[FUS] Video lookup: slot=' + videoSlot + ', found=' + !!video + ', url=' + (video ? video.url.substring(0, 60) : 'none'));
        if (video && video.url) {
          fusTrack('video_shown', { slot: videoSlot });
          showingVideoOverlay = true;
          console.log('[FUS] Calling renderModal');
          renderModal(data, video, { agentInOverlay: !!data.agentInOverlay, videoSlot: videoSlot });
          console.log('[FUS] renderModal completed');
        }
      } else {
        console.log('[FUS] No videoSlot — skipping modal');
      }

      // Show standalone agent chat bubble — but NOT if agent is embedded in the video overlay
      if (config.agent && data.agentEnabled && !(showingVideoOverlay && data.agentInOverlay)) {
        renderAgentChat(data);
      }
    })
    .catch(function (err) {
      // Log error for debugging but don't break host site
      if (typeof console !== 'undefined' && console.error) console.error('[FUS Widget]', err);
    });

  function renderModal(data, video, opts) {
    opts = opts || {};

    // Inject styles (include agent styles when chat is embedded in overlay)
    var style = document.createElement('style');
    style.textContent = getStyles() + (opts.agentInOverlay ? getAgentStyles() : '');
    document.head.appendChild(style);

    // Backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'fus-backdrop';
    backdrop.addEventListener('click', closeModal);

    // Modal container
    var modal = document.createElement('div');
    modal.className = 'fus-modal';

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'fus-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.addEventListener('click', closeModal);

    // Card
    var card = document.createElement('div');
    card.className = 'fus-card';

    // Video container
    var videoWrap = document.createElement('div');
    videoWrap.className = 'fus-video-wrap';

    var videoEl = document.createElement('video');
    videoEl.src = video.url;
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('autoplay', '');
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.controls = true;
    videoEl.className = 'fus-video';
    // Force play after append (some browsers need this)
    setTimeout(function () { videoEl.play().catch(function () {}); }, 100);

    // Tap-to-unmute overlay
    var unmuteOverlay = document.createElement('button');
    unmuteOverlay.className = 'fus-unmute';
    unmuteOverlay.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>' +
      '<span>Tap to unmute</span>';
    unmuteOverlay.addEventListener('click', function () {
      videoEl.muted = false;
      unmuteOverlay.style.display = 'none';
      fusTrack('video_unmute', { slot: videoSlot });
    });

    videoEl.addEventListener('play', function () {
      if (videoEl.muted) {
        unmuteOverlay.style.display = 'flex';
      }
      fusTrack('video_play', { slot: videoSlot });
    });

    // Track video progress (50% and 100%)
    var tracked50 = false, tracked100 = false;
    videoEl.addEventListener('timeupdate', function () {
      if (!videoEl.duration) return;
      var pct = videoEl.currentTime / videoEl.duration;
      if (!tracked50 && pct >= 0.5) {
        tracked50 = true;
        fusTrack('video_50', { slot: videoSlot, duration: Math.round(videoEl.currentTime), total: Math.round(videoEl.duration) });
      }
      if (!tracked100 && pct >= 0.95) {
        tracked100 = true;
        fusTrack('video_100', { slot: videoSlot, duration: Math.round(videoEl.duration), total: Math.round(videoEl.duration) });
      }
    });

    videoWrap.appendChild(videoEl);
    videoWrap.appendChild(unmuteOverlay);

    // Content area
    var content = document.createElement('div');
    content.className = 'fus-content';

    // Title
    var title = document.createElement('h2');
    title.className = 'fus-title';
    title.textContent = video.title || data.clinicName || '';

    // Subtitle
    var subtitle = document.createElement('p');
    subtitle.className = 'fus-subtitle';
    subtitle.textContent =
      video.subtitle || 'A personal message from ' + (data.clinicName || 'us');

    content.appendChild(title);
    content.appendChild(subtitle);

    // CTAs
    var ctas = document.createElement('div');
    ctas.className = 'fus-ctas';

    // Agent Chat CTA (replaces WhatsApp for £197+ AI Receptionist tier)
    if (opts.agentInOverlay) {
      var chatCta = document.createElement('button');
      chatCta.className = 'fus-cta fus-cta-chat';
      chatCta.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>' +
        '<span>Chat with us</span>';
      chatCta.addEventListener('click', function () {
        fusTrack('cta_agent_chat', { slot: videoSlot });
        showOverlayChat();
      });
      ctas.appendChild(chatCta);
    } else if (config.whatsapp) {
      // WhatsApp CTA (£97 Video Follow-Up tier)
      var waBtn = document.createElement('a');
      waBtn.className = 'fus-cta fus-cta-whatsapp';
      waBtn.href =
        'https://wa.me/' +
        config.whatsapp.replace(/[^0-9]/g, '') +
        '?text=' +
        encodeURIComponent(
          "Hi! I've just watched your video and I'd like to know more."
        );
      waBtn.target = '_blank';
      waBtn.rel = 'noopener';
      waBtn.addEventListener('click', function () {
        fusTrack('cta_whatsapp', { slot: videoSlot });
      });
      waBtn.innerHTML =
        '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
        '<span>Message on WhatsApp</span>';
      ctas.appendChild(waBtn);
    }

    // Booking CTA (always shown)
    if (config.booking) {
      var bookBtn = document.createElement('button');
      bookBtn.className = 'fus-cta fus-cta-book';
      bookBtn.innerHTML =
        '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' +
        '<span>Book a Consultation</span>';
      bookBtn.addEventListener('click', function () {
        fusTrack('cta_booking', { slot: videoSlot });
        showBookingFrame(config.booking);
      });
      ctas.appendChild(bookBtn);
    }

    content.appendChild(ctas);

    // Powered by footer
    if (data.branded) {
      var powered = document.createElement('div');
      powered.className = 'fus-powered';
      powered.innerHTML =
        'Powered by <a href="https://followupsystems.co.uk" target="_blank" rel="noopener">Follow Up Systems</a>';
      content.appendChild(powered);
    }

    card.appendChild(videoWrap);
    card.appendChild(content);
    modal.appendChild(closeBtn);
    modal.appendChild(card);

    // ─── Overlay Agent Chat (£197+ tier) ─────────────────────────────────────
    var overlayChatPanel = null;
    if (opts.agentInOverlay) {
      overlayChatPanel = (function buildOverlayChatPanel() {
        var wrap = document.createElement('div');
        wrap.className = 'fus-overlay-chat';
        wrap.style.display = 'none';

        // Header with back button
        var chatHeader = document.createElement('div');
        chatHeader.className = 'fus-overlay-chat-header';

        var backBtn = document.createElement('button');
        backBtn.className = 'fus-overlay-chat-back';
        backBtn.setAttribute('aria-label', 'Back to video');
        backBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>';
        backBtn.addEventListener('click', hideOverlayChat);

        var headerInfo = document.createElement('div');
        headerInfo.innerHTML =
          '<div class="fus-agent-header-name">' + (data.clinicName || 'Chat') + '</div>' +
          '<div class="fus-agent-header-status">Online</div>';

        chatHeader.appendChild(backBtn);
        chatHeader.appendChild(headerInfo);

        // Messages area
        var chatMessages = document.createElement('div');
        chatMessages.className = 'fus-agent-messages';

        var welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'fus-agent-msg fus-agent-msg-bot';
        welcomeMsg.textContent = data.agentWelcome || 'Hi! How can I help you today?';
        chatMessages.appendChild(welcomeMsg);

        // Input area
        var chatInputArea = document.createElement('div');
        chatInputArea.className = 'fus-agent-input-area';

        var chatInput = document.createElement('textarea');
        chatInput.className = 'fus-agent-input';
        chatInput.placeholder = 'Type a message...';
        chatInput.rows = 1;
        chatInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendOverlayMessage();
          }
        });
        chatInput.addEventListener('input', function () {
          this.style.height = 'auto';
          this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });

        var chatSendBtn = document.createElement('button');
        chatSendBtn.className = 'fus-agent-send';
        chatSendBtn.setAttribute('aria-label', 'Send');
        chatSendBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
        chatSendBtn.addEventListener('click', sendOverlayMessage);

        chatInputArea.appendChild(chatInput);
        chatInputArea.appendChild(chatSendBtn);

        if (data.branded) {
          var chatPowered = document.createElement('div');
          chatPowered.className = 'fus-agent-powered';
          chatPowered.innerHTML = 'Powered by <a href="https://followupsystems.co.uk" target="_blank" rel="noopener">Follow Up Systems</a>';
          chatInputArea.appendChild(chatPowered);
        }

        wrap.appendChild(chatHeader);
        wrap.appendChild(chatMessages);
        wrap.appendChild(chatInputArea);

        // ── Chat state + send logic ──
        var overlaySending = false;
        var overlayConvoId = null;
        try { overlayConvoId = sessionStorage.getItem('fus_convo'); } catch (e) {}

        function addOverlayMsg(text, isUser) {
          var msg = document.createElement('div');
          msg.className = 'fus-agent-msg ' + (isUser ? 'fus-agent-msg-user' : 'fus-agent-msg-bot');
          msg.textContent = text;
          chatMessages.appendChild(msg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
          return msg;
        }

        function sendOverlayMessage() {
          var text = chatInput.value.trim();
          if (!text || overlaySending) return;
          overlaySending = true;
          window.__fusAgentEngaged = true;
          chatInput.value = '';
          chatInput.style.height = 'auto';

          addOverlayMsg(text, true);

          var typingEl = document.createElement('div');
          typingEl.className = 'fus-agent-msg fus-agent-msg-bot fus-agent-typing';
          typingEl.innerHTML = '<span></span><span></span><span></span>';
          chatMessages.appendChild(typingEl);
          chatMessages.scrollTop = chatMessages.scrollHeight;

          var botMsg = null;
          var fullText = '';

          fetch(API_BASE + '/api/agent/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: config.key,
              message: text,
              conversationId: overlayConvoId,
              anonymousId: anonymousId,
              pageUrl: window.location.href,
              videoSlot: opts.videoSlot || null,
              projectId: config.project || null,
            }),
          })
            .then(function (res) {
              if (!res.ok) throw new Error('Chat failed');
              var reader = res.body.getReader();
              var decoder = new TextDecoder();
              var buffer = '';

              function read() {
                reader.read().then(function (result) {
                  if (result.done) {
                    overlaySending = false;
                    return;
                  }
                  buffer += decoder.decode(result.value, { stream: true });
                  var lines = buffer.split('\n');
                  buffer = lines.pop() || '';

                  for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line.startsWith('data: ')) {
                      try {
                        var parsed = JSON.parse(line.slice(6));
                        if (parsed.text) {
                          if (!botMsg) {
                            if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
                            botMsg = addOverlayMsg('', false);
                          }
                          fullText += parsed.text;
                          botMsg.textContent = fullText;
                          chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                        if (parsed.done) {
                          overlayConvoId = parsed.conversationId;
                          try { sessionStorage.setItem('fus_convo', overlayConvoId); } catch (e) {}
                          if (parsed.leadCaptured && botMsg) {
                            var saved = document.createElement('div');
                            saved.className = 'fus-agent-saved';
                            saved.textContent = 'Details saved';
                            botMsg.parentNode.insertBefore(saved, botMsg.nextSibling);
                            setTimeout(function () { saved.style.opacity = '0'; }, 3000);
                            setTimeout(function () { if (saved.parentNode) saved.parentNode.removeChild(saved); }, 3500);
                          }
                          overlaySending = false;
                        }
                        if (parsed.error) {
                          if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
                          addOverlayMsg('Sorry, something went wrong. Please try again.', false);
                          overlaySending = false;
                        }
                      } catch (e) {}
                    }
                  }
                  read();
                }).catch(function () {
                  if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
                  addOverlayMsg('Sorry, something went wrong. Please try again.', false);
                  overlaySending = false;
                });
              }
              read();
            })
            .catch(function () {
              if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
              addOverlayMsg('Sorry, I could not connect. Please try again.', false);
              overlaySending = false;
            });
        }

        wrap.__sendMessage = sendOverlayMessage;
        return wrap;
      })();

      modal.appendChild(overlayChatPanel);

      // Expose overlay chat for persistent bar after modal close
      window.__fusOverlayChat = { panel: overlayChatPanel, sendFn: overlayChatPanel.__sendMessage };
    }

    function showOverlayChat() {
      if (!overlayChatPanel) return;
      card.style.display = 'none';
      videoEl.pause();
      overlayChatPanel.style.display = 'flex';
      var input = overlayChatPanel.querySelector('.fus-agent-input');
      if (input) setTimeout(function () { input.focus(); }, 100);
    }

    function hideOverlayChat() {
      if (!overlayChatPanel) return;
      overlayChatPanel.style.display = 'none';
      card.style.display = '';
    }

    // Reopen bubble (hidden initially, shown after close)
    var bubble = document.createElement('button');
    bubble.className = 'fus-bubble';
    bubble.setAttribute('aria-label', 'Rewatch video');
    if (data.profileImage) {
      bubble.innerHTML =
        '<img src="' + data.profileImage + '" alt="" class="fus-bubble-img">' +
        '<span class="fus-bubble-play"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></span>';
      bubble.classList.add('fus-bubble-profile');
    } else {
      bubble.innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
    }
    bubble.addEventListener('click', function () {
      bubble.classList.remove('fus-visible');
      backdrop.classList.add('fus-visible');
      modal.classList.add('fus-visible');
      // Reset to video view
      card.style.display = '';
      // Only hide overlay chat if it's still in the modal (not moved to persistent)
      if (overlayChatPanel && overlayChatPanel.parentNode === modal) {
        overlayChatPanel.style.display = 'none';
      }
      videoEl.play().catch(function () {});
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    document.body.appendChild(bubble);

    // Animate in
    requestAnimationFrame(function () {
      backdrop.classList.add('fus-visible');
      modal.classList.add('fus-visible');
    });

    // Store references for cleanup
    window.__fusModal = { backdrop: backdrop, modal: modal, videoEl: videoEl, style: style, bubble: bubble };
  }

  function closeModal() {
    var m = window.__fusModal;
    if (!m) return;

    m.videoEl.pause();
    m.backdrop.classList.remove('fus-visible');
    m.modal.classList.remove('fus-visible');

    // If user engaged with agent, show persistent chat bar/bubble instead of video reopen bubble
    if (window.__fusAgentEngaged && window.__fusOverlayChat) {
      setTimeout(function () {
        showPersistentChat();
      }, 350);
    } else {
      // Show reopen bubble after modal fades out
      setTimeout(function () {
        m.bubble.classList.add('fus-visible');
      }, 350);
    }

    // Clean ?v= from URL
    try {
      var url = new URL(window.location.href);
      url.searchParams.delete('v');
      var cleanUrl = url.searchParams.toString()
        ? url.pathname + '?' + url.searchParams.toString()
        : url.pathname;
      window.history.replaceState({}, '', cleanUrl);
    } catch (e) {}
  }

  // ─── Persistent Chat (after overlay agent engagement) ────────────────────
  var persistentChatEl = null;
  var persistentExpanded = false;

  function showPersistentChat() {
    if (persistentChatEl) {
      persistentChatEl.classList.add('fus-visible');
      return;
    }

    var oc = window.__fusOverlayChat;
    if (!oc) return;

    // Detach overlay chat panel from modal and reuse it
    var panel = oc.panel;
    if (panel.parentNode) panel.parentNode.removeChild(panel);

    var isMobile = window.innerWidth < 640;

    // Create persistent container
    var container = document.createElement('div');
    container.className = 'fus-persistent-chat';

    if (isMobile) {
      // Mobile: just a chat bubble
      var mobileBubble = document.createElement('button');
      mobileBubble.className = 'fus-persistent-bubble';
      mobileBubble.setAttribute('aria-label', 'Continue chat');
      mobileBubble.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>';

      mobileBubble.addEventListener('click', function () {
        mobileBubble.style.display = 'none';
        panel.style.display = 'flex';
        panel.className = 'fus-persistent-panel fus-persistent-fullscreen fus-visible';
        // Replace back button to minimize instead of hiding
        var backBtn = panel.querySelector('.fus-overlay-chat-back');
        if (backBtn) {
          backBtn.onclick = function () {
            panel.style.display = 'none';
            panel.className = 'fus-overlay-chat';
            mobileBubble.style.display = '';
          };
        }
        var input = panel.querySelector('.fus-agent-input');
        if (input) setTimeout(function () { input.focus(); }, 100);
        var msgs = panel.querySelector('.fus-agent-messages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      });

      container.appendChild(mobileBubble);
      container.appendChild(panel);
      panel.style.display = 'none';
    } else {
      // Desktop: minimized bar with expand
      var bar = document.createElement('div');
      bar.className = 'fus-persistent-bar';

      var barInfo = document.createElement('div');
      barInfo.className = 'fus-persistent-bar-info';
      barInfo.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>' +
        '<span>Continue your conversation</span>';
      barInfo.style.cursor = 'pointer';
      barInfo.addEventListener('click', expandPersistentChat);

      var barClose = document.createElement('button');
      barClose.className = 'fus-persistent-bar-close';
      barClose.setAttribute('aria-label', 'Close');
      barClose.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
      barClose.addEventListener('click', function (e) {
        e.stopPropagation();
        container.classList.remove('fus-visible');
      });

      bar.appendChild(barInfo);
      bar.appendChild(barClose);

      // Prepare panel for persistent use
      panel.style.display = 'none';
      panel.className = 'fus-persistent-panel';
      var backBtn = panel.querySelector('.fus-overlay-chat-back');
      if (backBtn) {
        backBtn.onclick = function () {
          collapsePersistentChat();
        };
        // Change icon to minimize
        backBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>';
        backBtn.setAttribute('aria-label', 'Minimize chat');
      }

      container.appendChild(bar);
      container.appendChild(panel);
    }

    document.body.appendChild(container);
    persistentChatEl = container;

    // Animate in
    requestAnimationFrame(function () {
      container.classList.add('fus-visible');
    });
  }

  function expandPersistentChat() {
    if (!persistentChatEl || !window.__fusOverlayChat) return;
    var panel = window.__fusOverlayChat.panel;
    var bar = persistentChatEl.querySelector('.fus-persistent-bar');
    if (bar) bar.style.display = 'none';
    panel.style.display = 'flex';
    panel.className = 'fus-persistent-panel fus-visible';
    persistentExpanded = true;
    var input = panel.querySelector('.fus-agent-input');
    if (input) setTimeout(function () { input.focus(); }, 100);
    var msgs = panel.querySelector('.fus-agent-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function collapsePersistentChat() {
    if (!persistentChatEl || !window.__fusOverlayChat) return;
    var panel = window.__fusOverlayChat.panel;
    var bar = persistentChatEl.querySelector('.fus-persistent-bar');
    panel.style.display = 'none';
    panel.className = 'fus-persistent-panel';
    if (bar) bar.style.display = '';
    persistentExpanded = false;
  }

  // Booking iframe sub-modal
  function showBookingFrame(bookingUrl) {
    var m = window.__fusModal;
    if (!m) return;

    fusTrack('booking_frame_opened', { bookingUrl: bookingUrl });

    // Hide the card
    var card = m.modal.querySelector('.fus-card');
    if (card) card.style.display = 'none';

    // Pause video
    m.videoEl.pause();

    // Create booking container
    var bookingWrap = document.createElement('div');
    bookingWrap.className = 'fus-booking-wrap';

    // Header with back button + title
    var header = document.createElement('div');
    header.className = 'fus-booking-header';

    var backBtn = document.createElement('button');
    backBtn.className = 'fus-booking-back';
    backBtn.innerHTML =
      '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>';
    backBtn.addEventListener('click', function () {
      bookingWrap.remove();
      if (card) card.style.display = '';
    });

    var headerTitle = document.createElement('span');
    headerTitle.className = 'fus-booking-title';
    headerTitle.textContent = 'Book a Consultation';

    header.appendChild(backBtn);
    header.appendChild(headerTitle);

    // Iframe
    var iframe = document.createElement('iframe');
    iframe.src = bookingUrl;
    iframe.className = 'fus-booking-iframe';
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('loading', 'lazy');

    // Fallback: if iframe fails to load, open in new tab
    iframe.onerror = function () {
      window.open(bookingUrl, '_blank');
      bookingWrap.remove();
      if (card) card.style.display = '';
    };

    bookingWrap.appendChild(header);
    bookingWrap.appendChild(iframe);
    m.modal.appendChild(bookingWrap);
  }

  // ─── Agent Chat ──────────────────────────────────────────────────────────────
  function renderAgentChat(data) {
    var chatOpen = false;
    var isModal = false;
    var conversationId = null;
    var sending = false;

    // Try restore conversationId from session
    try { conversationId = sessionStorage.getItem('fus_convo'); } catch (e) {}

    // Inject agent styles
    var agentStyle = document.createElement('style');
    agentStyle.textContent = getAgentStyles();
    document.head.appendChild(agentStyle);

    // Overlay (backdrop for modal mode)
    var overlay = document.createElement('div');
    overlay.className = 'fus-agent-overlay';
    overlay.addEventListener('click', function () {
      if (isModal) toggleModal();
      else closeChat();
    });

    // Chat bubble
    var chatBubble = document.createElement('button');
    chatBubble.className = 'fus-agent-bubble';
    chatBubble.setAttribute('aria-label', 'Chat with us');
    chatBubble.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>';

    // Chat panel — starts as mini (corner), can expand to modal (centered)
    var panel = document.createElement('div');
    panel.className = 'fus-agent-panel';

    // Header
    var header = document.createElement('div');
    header.className = 'fus-agent-header';
    header.innerHTML =
      '<div class="fus-agent-header-info">' +
        '<div class="fus-agent-header-name">' + (data.clinicName || 'Chat') + '</div>' +
        '<div class="fus-agent-header-status">Online</div>' +
      '</div>' +
      '<div class="fus-agent-header-actions">' +
        '<button class="fus-agent-expand" aria-label="Expand chat">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>' +
        '</button>' +
        '<button class="fus-agent-close" aria-label="Close chat">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>';

    var expandBtn = header.querySelector('.fus-agent-expand');
    expandBtn.addEventListener('click', toggleModal);
    header.querySelector('.fus-agent-close').addEventListener('click', closeChat);

    // Messages area
    var messagesEl = document.createElement('div');
    messagesEl.className = 'fus-agent-messages';

    // Welcome message
    var welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'fus-agent-msg fus-agent-msg-bot';
    welcomeMsg.textContent = data.agentWelcome || 'Hi! How can I help you today?';
    messagesEl.appendChild(welcomeMsg);

    // Input area
    var inputArea = document.createElement('div');
    inputArea.className = 'fus-agent-input-area';

    var input = document.createElement('textarea');
    input.className = 'fus-agent-input';
    input.placeholder = 'Type a message...';
    input.rows = 1;
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    input.addEventListener('input', function () {
      // Auto-resize
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    var sendBtn = document.createElement('button');
    sendBtn.className = 'fus-agent-send';
    sendBtn.setAttribute('aria-label', 'Send');
    sendBtn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
    sendBtn.addEventListener('click', sendMessage);

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);

    // Powered by
    if (data.branded) {
      var powered = document.createElement('div');
      powered.className = 'fus-agent-powered';
      powered.innerHTML = 'Powered by <a href="https://followupsystems.co.uk" target="_blank" rel="noopener">Follow Up Systems</a>';
      inputArea.appendChild(powered);
    }

    panel.appendChild(header);
    panel.appendChild(messagesEl);
    panel.appendChild(inputArea);

    document.body.appendChild(overlay);
    document.body.appendChild(chatBubble);
    document.body.appendChild(panel);

    // Animate bubble in
    requestAnimationFrame(function () {
      chatBubble.classList.add('fus-visible');
    });

    chatBubble.addEventListener('click', openChat);

    function openChat() {
      chatOpen = true;
      panel.classList.add('fus-visible');
      chatBubble.classList.add('fus-agent-bubble-hidden');
      input.focus();
      fusTrack('agent_chat_opened');
    }

    function closeChat() {
      chatOpen = false;
      if (isModal) {
        isModal = false;
        overlay.classList.remove('fus-open');
        panel.classList.remove('fus-modal');
        // Swap expand icon back
        expandBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
        expandBtn.setAttribute('aria-label', 'Expand chat');
      }
      panel.classList.remove('fus-visible');
      chatBubble.classList.remove('fus-agent-bubble-hidden');
    }

    function toggleModal() {
      if (isModal) {
        // Collapse back to mini
        isModal = false;
        overlay.classList.remove('fus-open');
        panel.classList.remove('fus-modal');
        // Swap to expand icon
        expandBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
        expandBtn.setAttribute('aria-label', 'Expand chat');
      } else {
        // Expand to modal
        isModal = true;
        overlay.classList.add('fus-open');
        panel.classList.add('fus-modal');
        // Swap to collapse icon
        expandBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
        expandBtn.setAttribute('aria-label', 'Collapse chat');
      }
      input.focus();
    }

    function addMessage(text, isUser) {
      var msg = document.createElement('div');
      msg.className = 'fus-agent-msg ' + (isUser ? 'fus-agent-msg-user' : 'fus-agent-msg-bot');
      msg.textContent = text;
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return msg;
    }

    function sendMessage() {
      var text = input.value.trim();
      if (!text || sending) return;

      // Auto-expand to modal on first message
      if (!isModal) toggleModal();

      sending = true;
      input.value = '';
      input.style.height = 'auto';

      addMessage(text, true);

      // Show typing indicator
      var typingEl = document.createElement('div');
      typingEl.className = 'fus-agent-msg fus-agent-msg-bot fus-agent-typing';
      typingEl.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typingEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;

      // Stream response via SSE
      var botMsg = null;
      var fullText = '';

      fetch(API_BASE + '/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: config.key,
          message: text,
          conversationId: conversationId,
          anonymousId: anonymousId,
          pageUrl: window.location.href,
          projectId: config.project || null,
        }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Chat failed');
          var reader = res.body.getReader();
          var decoder = new TextDecoder();
          var buffer = '';

          function read() {
            reader.read().then(function (result) {
              if (result.done) {
                sending = false;
                return;
              }
              buffer += decoder.decode(result.value, { stream: true });
              var lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.startsWith('data: ')) {
                  try {
                    var parsed = JSON.parse(line.slice(6));
                    if (parsed.text) {
                      // Remove typing indicator on first text
                      if (!botMsg) {
                        if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
                        botMsg = addMessage('', false);
                      }
                      fullText += parsed.text;
                      botMsg.textContent = fullText;
                      messagesEl.scrollTop = messagesEl.scrollHeight;
                    }
                    if (parsed.done) {
                      conversationId = parsed.conversationId;
                      try { sessionStorage.setItem('fus_convo', conversationId); } catch (e) {}
                      // Show subtle confirmation if lead was captured
                      if (parsed.leadCaptured && botMsg) {
                        var saved = document.createElement('div');
                        saved.className = 'fus-agent-saved';
                        saved.textContent = 'Details saved';
                        botMsg.parentNode.insertBefore(saved, botMsg.nextSibling);
                        setTimeout(function () { saved.style.opacity = '0'; }, 3000);
                        setTimeout(function () { if (saved.parentNode) saved.parentNode.removeChild(saved); }, 3500);
                      }
                      sending = false;
                    }
                    if (parsed.error) {
                      if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
                      addMessage('Sorry, something went wrong. Please try again.', false);
                      sending = false;
                    }
                  } catch (e) {}
                }
              }
              read();
            }).catch(function () {
              if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
              addMessage('Sorry, something went wrong. Please try again.', false);
              sending = false;
            });
          }
          read();
        })
        .catch(function () {
          if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
          addMessage('Sorry, I could not connect. Please try again.', false);
          sending = false;
        });
    }
  }

  function getAgentStyles() {
    return (
      '@keyframes fus-dot-pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}' +
      // Overlay backdrop (modal mode only)
      '.fus-agent-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:999998}' +
      '.fus-agent-overlay.fus-open{display:block}' +
      // Chat bubble — bottom right
      '.fus-agent-bubble{position:fixed;bottom:24px;right:24px;z-index:999997;width:56px;height:56px;border-radius:50%;background:#1a1a2e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(26,26,46,.4);opacity:0;transform:scale(.8);pointer-events:none;transition:all .3s ease}' +
      '.fus-agent-bubble.fus-visible{opacity:1;transform:scale(1);pointer-events:auto}' +
      '.fus-agent-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(26,26,46,.5)}' +
      '.fus-agent-bubble-hidden{opacity:0!important;transform:scale(.6)!important;pointer-events:none!important}' +
      // Chat panel — mini mode (corner, default)
      '.fus-agent-panel{position:fixed;bottom:90px;right:24px;z-index:999999;width:380px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.2);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(16px) scale(.95);pointer-events:none;transition:all .3s ease;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
      '.fus-agent-panel.fus-visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
      // Chat panel — modal mode (centered, expanded)
      '.fus-agent-panel.fus-modal{position:fixed;top:50%;left:50%;bottom:auto;right:auto;transform:translate(-50%,-50%) scale(.95);width:90vw;max-width:600px;height:70vh;max-height:600px;border-radius:20px;box-shadow:0 25px 60px rgba(0,0,0,.5)}' +
      '.fus-agent-panel.fus-modal.fus-visible{transform:translate(-50%,-50%) scale(1)}' +
      // Header
      '.fus-agent-header{display:flex;align-items:center;justify-content:space-between;padding:14px 12px 10px 16px;background:#1a1a2e;color:#fff;flex-shrink:0}' +
      '.fus-agent-header-name{font-size:15px;font-weight:600;line-height:1.3}' +
      '.fus-agent-header-status{font-size:12px;opacity:.8;margin-top:1px}' +
      '.fus-agent-header-actions{display:flex;gap:4px;align-items:center}' +
      '.fus-agent-expand{background:rgba(255,255,255,.1);border:none;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;transition:background .2s;flex-shrink:0}' +
      '.fus-agent-expand:hover{background:rgba(255,255,255,.2)}' +
      '.fus-agent-close{background:rgba(255,255,255,.1);border:none;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;transition:background .2s;flex-shrink:0}' +
      '.fus-agent-close:hover{background:rgba(255,255,255,.2)}' +
      // Messages
      '.fus-agent-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}' +
      '.fus-agent-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap}' +
      '.fus-agent-panel.fus-modal .fus-agent-msg{font-size:15px}' +
      '.fus-agent-panel.fus-modal .fus-agent-messages{padding:20px}' +
      '.fus-agent-panel.fus-modal .fus-agent-header-name{font-size:16px}' +
      '.fus-agent-msg-bot{background:#f1f5f9;color:#1e293b;border-bottom-left-radius:4px;align-self:flex-start}' +
      '.fus-agent-msg-user{background:#1a1a2e;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
      // Typing indicator
      '.fus-agent-typing{display:flex;gap:4px;padding:12px 18px}' +
      '.fus-agent-typing span{width:7px;height:7px;background:#94a3b8;border-radius:50%;animation:fus-dot-pulse 1.2s infinite}' +
      '.fus-agent-typing span:nth-child(2){animation-delay:.2s}' +
      '.fus-agent-typing span:nth-child(3){animation-delay:.4s}' +
      // Saved confirmation
      '.fus-agent-saved{text-align:center;font-size:11px;color:#64748b;padding:4px 0;transition:opacity .5s ease}' +
      // Input area
      '.fus-agent-input-area{padding:12px;border-top:1px solid #e2e8f0;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;flex-wrap:wrap}' +
      '.fus-agent-input{flex:1;min-width:0;border:1px solid #e2e8f0;border-radius:12px;padding:10px 14px;font-size:14px;font-family:inherit;resize:none;outline:none;max-height:100px;line-height:1.4;box-sizing:border-box}' +
      '.fus-agent-input:focus{border-color:#1a1a2e;box-shadow:0 0 0 2px rgba(26,26,46,.15)}' +
      '.fus-agent-send{width:36px;height:36px;border-radius:10px;background:#1a1a2e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;transition:background .2s;flex-shrink:0}' +
      '.fus-agent-send:hover{background:#111122}' +
      '.fus-agent-powered{width:100%;text-align:center;padding-top:6px;font-size:10px;color:#94a3b8}' +
      '.fus-agent-powered a{color:#94a3b8;text-decoration:none}' +
      '.fus-agent-powered a:hover{color:#1a1a2e}' +
      // Mobile — full screen for both modes
      '@media(max-width:480px){' +
        '.fus-agent-panel.fus-visible{bottom:0;right:0;width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0;transform:none}' +
        '.fus-agent-panel.fus-modal{top:0;left:0;width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0}' +
        '.fus-agent-panel.fus-modal.fus-visible{transform:none}' +
        '.fus-agent-bubble{bottom:16px;right:16px}' +
      '}'
    );
  }

  function getStyles() {
    return (
      '@keyframes fus-slide-up{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}' +
      '@keyframes fus-fade-in{from{opacity:0}to{opacity:1}}' +
      '.fus-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);z-index:999998;opacity:0;pointer-events:none;transition:opacity .3s ease}' +
      '.fus-backdrop.fus-visible{opacity:1;pointer-events:auto}' +
      '.fus-modal{position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;opacity:0;transform:translateY(24px) scale(.96);pointer-events:none;transition:opacity .3s ease,transform .3s ease;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
      '.fus-modal.fus-visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
      '.fus-close{position:absolute;top:12px;right:12px;z-index:10;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.95);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.3);transition:background .2s}' +
      '.fus-close:hover{background:#fff}' +
      '.fus-close svg{color:#333}' +
      '.fus-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,.4);width:100%;max-width:440px;max-height:90vh;overflow-y:auto}' +
      '.fus-video-wrap{position:relative;background:#000;aspect-ratio:9/16;max-height:55vh}' +
      '.fus-video{width:100%;height:100%;object-fit:contain}' +
      '.fus-unmute{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.7);color:#fff;border:none;border-radius:24px;padding:10px 20px;cursor:pointer;font-size:14px;font-family:inherit;backdrop-filter:blur(4px);transition:background .2s}' +
      '.fus-unmute:hover{background:rgba(0,0,0,.85)}' +
      '.fus-unmute svg{flex-shrink:0}' +
      '.fus-content{padding:20px 24px 24px}' +
      '.fus-title{margin:0 0 4px;font-size:20px;font-weight:700;color:#1e293b;line-height:1.3}' +
      '.fus-subtitle{margin:0 0 20px;font-size:14px;color:#64748b;line-height:1.5}' +
      '.fus-ctas{display:flex;flex-direction:column;gap:10px}' +
      '.fus-cta{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px 20px;border-radius:14px;border:none;cursor:pointer;font-size:15px;font-weight:600;font-family:inherit;text-decoration:none;box-sizing:border-box;transition:filter .2s,transform .1s;min-height:48px}' +
      '.fus-cta:hover{filter:brightness(1.08)}' +
      '.fus-cta:active{transform:scale(.98)}' +
      '.fus-cta-whatsapp{background:#25D366;color:#fff}' +
      '.fus-cta-book{background:#1a1a2e;color:#fff}' +
      '.fus-powered{text-align:center;margin-top:16px;padding-top:12px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8}' +
      '.fus-powered a{color:#94a3b8;text-decoration:none}' +
      '.fus-powered a:hover{color:#1a1a2e}' +
      '.fus-booking-wrap{display:flex;flex-direction:column;width:100%;max-width:440px;height:600px;max-height:80vh;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,.4)}' +
      '.fus-booking-header{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#fff;border-bottom:1px solid #e2e8f0}' +
      '.fus-booking-back{display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#f1f5f9;border:none;border-radius:8px;cursor:pointer;color:#475569;transition:background .2s;flex-shrink:0}' +
      '.fus-booking-back:hover{background:#e2e8f0}' +
      '.fus-booking-title{font-size:15px;font-weight:600;color:#1e293b;font-family:inherit}' +
      '.fus-booking-iframe{flex:1;width:100%;border:none}' +
      '.fus-bubble{position:fixed;bottom:24px;right:24px;z-index:999998;width:52px;height:52px;border-radius:50%;background:#1a1a2e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(26,26,46,.4);opacity:0;transform:scale(.8);pointer-events:none;transition:opacity .3s ease,transform .3s ease}' +
      '.fus-bubble.fus-visible{opacity:1;transform:scale(1);pointer-events:auto}' +
      '.fus-bubble:hover{transform:scale(1.1);box-shadow:0 6px 24px rgba(26,26,46,.5)}' +
      '.fus-bubble-profile{background:none;box-shadow:0 0 0 3px rgba(26,26,46,.3),0 0 20px rgba(26,26,46,.25);overflow:visible;padding:0}' +
      '.fus-bubble-profile:hover{box-shadow:0 0 0 3px rgba(26,26,46,.5),0 0 28px rgba(26,26,46,.35)}' +
      '.fus-bubble-img{width:52px;height:52px;border-radius:50%;object-fit:cover}' +
      '.fus-bubble-play{position:absolute;bottom:-2px;right:-2px;width:20px;height:20px;background:#1a1a2e;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3)}' +
      // Overlay chat panel (inside video modal for £197+ tier)
      '.fus-overlay-chat{display:flex;flex-direction:column;width:100%;max-width:440px;height:600px;max-height:80vh;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,.4);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
      '.fus-overlay-chat-header{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#1a1a2e;color:#fff;flex-shrink:0}' +
      '.fus-overlay-chat-back{display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:rgba(255,255,255,.1);border:none;border-radius:8px;cursor:pointer;color:#fff;flex-shrink:0;transition:background .2s}' +
      '.fus-overlay-chat-back:hover{background:rgba(255,255,255,.2)}' +
      '.fus-cta-chat{background:#1a1a2e;color:#fff}' +
      '@media(max-width:480px){' +
      '.fus-modal{padding:0;align-items:flex-end}' +
      '.fus-card{max-width:100%;max-height:100vh;border-radius:20px 20px 0 0}' +
      '.fus-video-wrap{max-height:45vh}' +
      '.fus-close{top:8px;right:8px}' +
      '.fus-booking-wrap{max-width:100%;height:100vh;max-height:100vh;border-radius:0;}' +
      '.fus-overlay-chat{max-width:100%;height:100vh;max-height:100vh;border-radius:0}' +
      '}' +
      // Persistent chat (after modal close, agent was engaged)
      '.fus-persistent-chat{position:fixed;bottom:24px;right:24px;z-index:999998;opacity:0;transform:translateY(12px);transition:all .3s ease;pointer-events:none}' +
      '.fus-persistent-chat.fus-visible{opacity:1;transform:translateY(0);pointer-events:auto}' +
      // Desktop: minimized bar
      '.fus-persistent-bar{display:flex;align-items:center;gap:8px;background:#1a1a2e;color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 4px 20px rgba(26,26,46,.4);cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;transition:box-shadow .2s}' +
      '.fus-persistent-bar:hover{box-shadow:0 6px 28px rgba(26,26,46,.5)}' +
      '.fus-persistent-bar-info{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500}' +
      '.fus-persistent-bar-close{background:rgba(255,255,255,.1);border:none;border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;transition:background .2s;flex-shrink:0;margin-left:8px}' +
      '.fus-persistent-bar-close:hover{background:rgba(255,255,255,.2)}' +
      // Desktop: expanded panel (reused overlay chat)
      '.fus-persistent-panel{position:fixed;bottom:24px;right:24px;z-index:999999;width:400px;max-width:calc(100vw - 48px);height:540px;max-height:calc(100vh - 48px);display:flex;flex-direction:column;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.2);overflow:hidden;opacity:0;transform:translateY(16px);pointer-events:none;transition:all .3s ease;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
      '.fus-persistent-panel.fus-visible{opacity:1;transform:translateY(0);pointer-events:auto}' +
      // Mobile: persistent bubble
      '.fus-persistent-bubble{position:fixed;bottom:24px;right:24px;z-index:999997;width:56px;height:56px;border-radius:50%;background:#1a1a2e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(26,26,46,.4);transition:all .2s}' +
      '.fus-persistent-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(26,26,46,.5)}' +
      // Mobile: fullscreen panel
      '.fus-persistent-fullscreen{position:fixed!important;top:0!important;left:0!important;bottom:0!important;right:0!important;width:100%!important;max-width:100%!important;height:100%!important;max-height:100%!important;border-radius:0!important}' +
      '@media(max-width:639px){' +
      '.fus-persistent-bar{display:none}' +
      '.fus-persistent-bubble{bottom:16px;right:16px}' +
      '}'
    );
  }
})();
