// No hace falta tocar este archivo. Tus datos van en datos.js
(function () {
  const d = window.DATOS || (typeof DATOS !== "undefined" ? DATOS : {});
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Datos de contacto ---------- */
  const set = (sel, url, label) => $$(sel).forEach(a => {
    if (!url) { a.remove(); return; }
    a.href = url;
    if (label) a.querySelector("span").textContent = label;
  });
  if (d.apellido) $$(".js-apellido").forEach(e => e.textContent = " " + d.apellido);
  const ig = (d.instagram || "").replace("@", "");
  set(".js-email", d.email && "mailto:" + d.email, d.email);
  set(".js-instagram", ig && "https://instagram.com/" + ig, ig && "@" + ig);
  set(".js-linkedin", d.linkedin && (d.linkedin.startsWith("http") ? d.linkedin : "https://" + d.linkedin));
  set(".js-whatsapp", d.whatsapp && "https://wa.me/" + d.whatsapp.replace(/\D/g, ""));
  set(".js-cv", d.cv);

  /* ---------- Barra de progreso ---------- */
  const bar = document.querySelector(".progress");
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
  };
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Aparecer al hacer scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
    // contador de números
    $$("[data-count]", e.target).forEach(b => {
      const end = +b.dataset.count; let n = 0;
      const t = setInterval(() => { b.textContent = (b.dataset.prefix || "") + ++n; if (n >= end) clearInterval(t); }, 90);
    });
  }), { threshold: 0.15 });
  $$(".script-title, .index__list li, .polaroid, .note, .counter, .paper, .phone, .gallery-strip, .tabs, .panels, .flip-wrap, .service, .claim")
    .forEach((el, i) => { el.classList.add("reveal"); el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });

  /* ---------- Inclinación 3D al pasar el mouse ---------- */
  if (!reduce && matchMedia("(hover: hover)").matches) {
    $$("[data-tilt]").forEach(el => {
      const base = getComputedStyle(el).transform === "none" ? "" : getComputedStyle(el).transform;
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `${base} perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
      });
      el.addEventListener("mouseleave", () => el.style.transform = "");
    });
  }

  /* ---------- Estrellas arrastrables ---------- */
  $$(".chrome-star.drag").forEach(s => {
    let sx, sy, ox = 0, oy = 0;
    s.addEventListener("pointerdown", e => {
      s.setPointerCapture(e.pointerId); s.classList.add("dragging");
      sx = e.clientX - ox; sy = e.clientY - oy;
    });
    s.addEventListener("pointermove", e => {
      if (!s.classList.contains("dragging")) return;
      ox = e.clientX - sx; oy = e.clientY - sy;
      s.style.translate = `${ox}px ${oy}px`;
    });
    const up = () => s.classList.remove("dragging");
    s.addEventListener("pointerup", up); s.addEventListener("pointercancel", up);
  });

  /* ---------- Estampilla que sigue al mouse ---------- */
  const stamp = document.querySelector(".stamp-wrap");
  if (stamp && !reduce) {
    document.querySelector(".hero").addEventListener("mousemove", e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      stamp.style.transform = `rotate(${-3 + x * 4}deg) translate(${x * 14}px, ${y * 14}px)`;
    });
  }

  /* ---------- Trivia de la story ---------- */
  const msg = document.querySelector(".story__msg");
  $$(".story__opt").forEach(b => b.addEventListener("click", e => {
    $$(".story__opt").forEach(o => o.classList.remove("ok", "no"));
    if (b.dataset.ok === "1") {
      b.classList.add("ok");
      msg.textContent = "¡Correcto! 🎉 Así la comunidad aprendía jugando.";
      burst(e.clientX, e.clientY);
    } else {
      b.classList.add("no");
      msg.textContent = "Casi… ¡probá de nuevo! 😉";
    }
  }));
  function burst(x, y) {
    if (reduce) return;
    ["✦", "★", "🌱", "⚡", "☀️", "✦", "★", "💙"].forEach(ch => {
      const c = document.createElement("span");
      c.className = "confetti"; c.textContent = ch;
      c.style.left = x + "px"; c.style.top = y + "px";
      c.style.setProperty("--dx", (Math.random() - .5) * 260 + "px");
      c.style.setProperty("--dy", -(Math.random() * 200 + 60) + "px");
      document.body.appendChild(c); setTimeout(() => c.remove(), 1000);
    });
  }

  /* ---------- Pestañas Di Cuore ---------- */
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x => x.classList.toggle("is-active", x === t));
    $$(".panel").forEach(p => p.classList.toggle("is-active", p.dataset.panel === t.dataset.tab));
  }));

  /* ---------- Tarjetas que se dan vuelta ---------- */
  $$(".flip").forEach(f => f.addEventListener("click", () => f.classList.toggle("is-flipped")));

  /* ---------- Visor de trabajos (lightbox) ---------- */
  const lb = document.querySelector(".lightbox");
  if (lb) {
    const media = lb.querySelector(".lightbox__media"), cap = lb.querySelector(".lightbox__cap");
    const prev = lb.querySelector(".lightbox__prev"), next = lb.querySelector(".lightbox__next");
    let list = [], idx = 0, lastFocus;
    const show = i => {
      idx = (i + list.length) % list.length;
      const a = list[idx];
      media.innerHTML = "";
      const el = document.createElement(a.dataset.video ? "video" : "img");
      el.src = a.getAttribute("href");
      if (a.dataset.video) { el.controls = true; el.autoplay = true; el.playsInline = true; }
      else el.alt = a.dataset.cap || "";
      media.appendChild(el);
      cap.textContent = (a.dataset.cap || "") + (list.length > 1 ? "  ·  " + (idx + 1) + "/" + list.length : "");
      prev.hidden = next.hidden = list.length < 2;
    };
    const close = () => { lb.hidden = true; media.innerHTML = ""; document.body.classList.remove("no-scroll"); if (lastFocus) lastFocus.focus(); };
    $$("[data-g]").forEach(a => a.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      lastFocus = a;
      list = $$('[data-g="' + a.dataset.g + '"]');
      show(list.indexOf(a));
      lb.hidden = false; document.body.classList.add("no-scroll");
      lb.querySelector(".lightbox__close").focus();
    }));
    prev.addEventListener("click", () => show(idx - 1));
    next.addEventListener("click", () => show(idx + 1));
    lb.querySelector(".lightbox__close").addEventListener("click", close);
    lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox__fig")) close(); });
    addEventListener("keydown", e => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let tx = null;
    lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50 && list.length > 1) show(idx + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- Sobre de contacto ---------- */
  const env = document.querySelector(".envelope");
  const hint = document.querySelector(".envelope__hint");
  const open = () => { env.classList.add("is-open"); hint.style.visibility = "hidden"; };
  env.addEventListener("click", e => { if (!e.target.closest("a")) open(); });
  env.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  // Se abre solo a los segundos de verlo, para que nadie se pierda tus contactos
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { setTimeout(open, 2500); o.disconnect(); }
  }), { threshold: .6 }).observe(env);
})();
