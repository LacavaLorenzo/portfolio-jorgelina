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
  $$(".script-title, .index__list li, .polaroid, .note, .counter, .paper, .phone, .subtabs, .tabs, .panels, .igprofile, .desk, .feedcard, .labels, .notion, .planner, .soft, .ecojourney, .service, .claim")
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

  /* ---------- Sub-pestañas (Stories / Posteos / Copys, Etiquetas / Posteos) ---------- */
  $$(".subtabs").forEach(tabs => {
    const panels = document.querySelector('.subpanels[data-group="' + tabs.dataset.group + '"]');
    $$(".subtab", tabs).forEach(t => t.addEventListener("click", () => {
      $$(".subtab", tabs).forEach(x => x.classList.toggle("is-active", x === t));
      $$(":scope > .subpanel", panels).forEach(p => p.classList.toggle("is-active", p.dataset.sub === t.dataset.sub));
      document.dispatchEvent(new CustomEvent("subtab", { detail: t.dataset.sub }));
    }));
  });

  /* ---------- Celular que reproduce las stories ---------- */
  $$(".storyplayer").forEach(sp => {
    const items = $$(".storyplayer__data i", sp);
    const img = sp.querySelector(".storyplayer__img");
    const bars = sp.querySelector(".storyplayer__bars");
    bars.innerHTML = items.map(() => "<i><b></b></i>").join("");
    const bs = $$("i", bars);
    let n = 0, timer;
    const go = i => {
      n = (i + items.length) % items.length;
      img.style.opacity = 0;
      setTimeout(() => { img.src = items[n].dataset.src; img.alt = items[n].dataset.alt; img.style.opacity = 1; }, 150);
      bs.forEach((b, k) => { b.classList.toggle("done", k < n); b.classList.remove("on"); });
      void bars.offsetWidth;
      bs[n].classList.add("on");
      clearTimeout(timer);
      if (!reduce) timer = setTimeout(() => go(n + 1), 5000);
    };
    sp.querySelector(".storyplayer__next").addEventListener("click", () => go(n + 1));
    sp.querySelector(".storyplayer__prev").addEventListener("click", () => go(n - 1));
    sp.addEventListener("keydown", e => { if (e.key === "ArrowRight") go(n + 1); if (e.key === "ArrowLeft") go(n - 1); });
    items.forEach(i => { const p = new Image(); p.src = i.dataset.src; });
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) go(n); else clearTimeout(timer);
    }), { threshold: .4 }).observe(sp);
  });

  /* ---------- Copys: cambiar de posteo ---------- */
  $$(".copypick").forEach(pick => {
    const post = pick.nextElementSibling;
    const img = post.querySelector(".igpost__media img");
    const copies = $$(".igcopy", post);
    $$(".copypick__btn", pick).forEach(b => b.addEventListener("click", () => {
      $$(".copypick__btn", pick).forEach(x => x.classList.toggle("is-active", x === b));
      const c = copies[+b.dataset.copy];
      copies.forEach(x => x.classList.toggle("is-active", x === c));
      img.style.opacity = 0;
      setTimeout(() => { img.src = c.dataset.img; img.style.opacity = 1; }, 150);
      post.querySelector(".igpost__caption").scrollTop = 0;
    }));
  });

  /* ---------- Mockups: elegir fragancia ---------- */
  $$(".swatches").forEach(sw => {
    const label = document.querySelector('[data-mock="' + sw.dataset.for + '"] .mock__label');
    $$("button", sw).forEach(b => {
      const p = new Image(); p.src = b.dataset.src;
      b.addEventListener("click", () => {
        $$("button", sw).forEach(x => x.classList.toggle("is-active", x === b));
        label.style.opacity = 0;
        setTimeout(() => { label.src = b.dataset.src; label.alt = "Etiqueta " + b.getAttribute("aria-label"); label.style.opacity = 1; }, 150);
      });
    });
  });

  /* ---------- Tarjeta de Nadia que se da vuelta ---------- */
  $$(".bizcard").forEach(c => c.addEventListener("click", () => c.classList.toggle("is-flipped")));

  /* ---------- Copys en carrusel: leer completo ---------- */
  const cm = document.createElement("div");
  cm.className = "copymodal"; cm.hidden = true;
  cm.innerHTML = '<div class="copymodal__box" role="dialog" aria-modal="true"><button class="copymodal__close" aria-label="Cerrar">✕</button><div class="copymodal__content"></div></div>';
  document.body.appendChild(cm);
  let cmLast;
  const cmClose = () => { cm.hidden = true; document.body.classList.remove("no-scroll"); if (cmLast) cmLast.focus(); };
  const cmOpen = c => {
    cmLast = c;
    cm.querySelector(".copymodal__content").innerHTML = c.innerHTML;
    cm.hidden = false; document.body.classList.add("no-scroll");
    cm.querySelector(".copymodal__close").focus();
  };
  $$(".ccard").forEach(c => {
    c.addEventListener("click", () => cmOpen(c));
    c.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cmOpen(c); } });
  });
  cm.addEventListener("click", e => { if (e.target === cm || e.target.closest(".copymodal__close")) cmClose(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !cm.hidden) cmClose(); });

  /* ---------- Bandeja de correos ---------- */
  $$(".mailapp").forEach(app => {
    const items = $$(".mailitem", app), mails = $$(".mail", app);
    items.forEach(it => it.addEventListener("click", () => {
      items.forEach(x => x.classList.toggle("is-active", x === it));
      it.classList.remove("is-unread");
      mails.forEach((m, i) => m.classList.toggle("is-active", i === +it.dataset.mail));
      app.querySelector(".mailapp__read").scrollTop = 0;
    }));
  });

  /* ---------- Likes ---------- */
  $$(".like").forEach(like => like.addEventListener("click", () => {
    like.classList.toggle("is-on");
    like.textContent = like.classList.contains("is-on") ? "♥" : "♡";
  }));

  /* ---------- EcoBite: números que suben ---------- */
  document.addEventListener("subtab", () => {});
  $$("[data-eco]").forEach(b => {
    const end = parseFloat(b.dataset.eco), suf = b.dataset.suf || "", dec = end % 1 ? 1 : 0;
    new IntersectionObserver((es, o) => es.forEach(e => {
      if (!e.isIntersecting) return; o.disconnect();
      if (reduce) return;
      let t0 = null;
      const step = t => { t0 = t0 || t; const k = Math.min((t - t0) / 1200, 1);
        b.textContent = (end * k).toFixed(dec).replace(".", ",") + suf; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: .6 }).observe(b);
  });

  /* ---------- Copys: corren solos y se arrastran ---------- */
  $$(".marquee-copys").forEach(m => {
    const track = m.querySelector(".marquee-copys__track");
    const speed = (+m.dataset.speed || 35) * (+m.dataset.dir || 1); // px por segundo
    let x = 0, half = 0, last = 0, hover = false, drag = null, moved = 0, visible = false, resumeAt = 0;
    const measure = () => { half = track.scrollWidth / 2; };
    const wrap = () => { if (!half) return; while (x <= -half) x += half; while (x > 0) x -= half; };
    const paint = () => { track.style.transform = "translateX(" + x + "px)"; };
    const tick = t => {
      const dt = last ? Math.min(t - last, 64) / 1000 : 0; last = t;
      if (visible && !drag && !hover && !reduce && t > resumeAt) { x -= speed * dt; wrap(); paint(); }
      requestAnimationFrame(tick);
    };
    measure(); addEventListener("resize", measure);
    new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; measure(); })).observe(m);
    requestAnimationFrame(tick);
    m.addEventListener("mouseenter", () => hover = true);
    m.addEventListener("mouseleave", () => hover = false);
    m.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      drag = { sx: e.clientX, ox: x }; moved = 0;
    });
    addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = e.clientX - drag.sx; moved = Math.max(moved, Math.abs(dx));
      if (moved > 5) m.classList.add("is-dragging");
      x = drag.ox + dx; wrap(); paint();
    });
    const end = () => {
      if (!drag) return;
      drag = null; resumeAt = performance.now() + 1200;
      setTimeout(() => m.classList.remove("is-dragging"), 0);
    };
    addEventListener("pointerup", end); addEventListener("pointercancel", end);
    // si fue arrastre, no abrir el copy
    m.addEventListener("click", e => { if (moved > 5) { e.stopPropagation(); e.preventDefault(); } }, true);
    // ruedita / trackpad horizontal
    m.addEventListener("wheel", e => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); x -= e.deltaX; wrap(); paint(); resumeAt = performance.now() + 1200; }
    }, { passive: false });
  });

  /* ---------- Calendario 500 RPM ---------- */
  $$(".planner").forEach(p => {
    const rows = $$(".planner__row", p), count = p.querySelector(".planner__count");
    const upd = () => { const v = rows.filter(r => !r.hidden); count.textContent = v.length + " piezas · " + v.filter(r => r.dataset.type === "story").length + " historias · " + v.filter(r => r.dataset.type === "post").length + " post"; };
    $$(".filter", p).forEach(b => b.addEventListener("click", () => {
      $$(".filter", p).forEach(x => x.classList.toggle("is-active", x === b));
      rows.forEach(r => r.hidden = b.dataset.f !== "all" && r.dataset.type !== b.dataset.f);
      upd();
    }));
    rows.filter(r => r.hasAttribute("data-open")).forEach(r => r.addEventListener("click", () => r.classList.toggle("is-open")));
    upd();
  });

  /* ---------- Notion Di Cuore: filtrar y contar ---------- */
  $$(".notion").forEach(n => {
    const rows = $$(".nrow:not(.nrow--head)", n);
    const upd = () => {
      const v = rows.filter(r => !r.hidden);
      const c = k => v.reduce((s, r) => s + (r.dataset.fmt.toLowerCase().includes(k) ? 1 : 0), 0);
      n.querySelector('[data-n="post"]').textContent = c("post");
      n.querySelector('[data-n="story"]').textContent = c("story");
    };
    $$(".nfilter", n).forEach(b => b.addEventListener("click", () => {
      $$(".nfilter", n).forEach(x => x.classList.toggle("is-active", x === b));
      rows.forEach(r => r.hidden = b.dataset.acc !== "all" && r.dataset.acc !== b.dataset.acc);
      upd();
    }));
    upd();
  });

  /* ---------- EcoBite: recorrido ---------- */
  $$(".ecojourney").forEach(j => {
    const steps = $$(".ecostep", j), views = $$(".ecoview", j), url = j.querySelector(".ecoscreen__url"), bar = j.querySelector(".ecoprog i");
    const urls = ["instagram.com/ecobite", "ecobite.com", "Correo · Bienvenido/a a EcoBite", "Correo · Tu comida sigue en el carrito"];
    const go = i => {
      steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
      views.forEach((v, k) => v.classList.toggle("is-active", k === i));
      url.textContent = (i < 2 ? "🔒 " : "✉️ ") + urls[i];
      bar.style.width = (i + 1) * 25 + "%";
    };
    steps.forEach((s, i) => s.addEventListener("click", () => go(i)));
    $$(".eco-go", j).forEach(b => b.addEventListener("click", () => go(+b.dataset.go)));
  });

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
