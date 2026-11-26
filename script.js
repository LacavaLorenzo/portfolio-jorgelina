// Completa los datos de contacto desde datos.js (no hace falta tocar este archivo)
(function () {
  const d = window.DATOS || (typeof DATOS !== "undefined" ? DATOS : {});
  const set = (sel, url, label) => {
    document.querySelectorAll(sel).forEach(a => {
      if (!url) { a.remove(); return; }
      a.href = url;
      if (label) a.querySelector("span").textContent = label;
    });
  };

  if (d.apellido) document.querySelectorAll(".js-apellido").forEach(e => e.textContent = " " + d.apellido);

  set(".js-email", d.email && "mailto:" + d.email, d.email);
  set(".js-instagram", d.instagram && "https://instagram.com/" + d.instagram.replace("@", ""), d.instagram && "@" + d.instagram.replace("@", ""));
  set(".js-linkedin", d.linkedin && (d.linkedin.startsWith("http") ? d.linkedin : "https://" + d.linkedin));
  set(".js-whatsapp", d.whatsapp && "https://wa.me/" + d.whatsapp.replace(/\D/g, ""));
  set(".js-cv", d.cv);

  // Animación suave al hacer scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".section h2, .case, .service, .card, .about__photo, .tools")
    .forEach(el => { el.classList.add("reveal"); io.observe(el); });
})();
