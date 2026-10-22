/* Tests du code existant HexGL, sans Node.js. QUnit est chargé localement. */
(function () {
  "use strict";
  if (typeof QUnit === "undefined") {
    document.documentElement.dataset.testStatus = "fail";
    document.documentElement.dataset.testCount = "0";
    document.documentElement.dataset.testFailures = "1";
    document.body.insertAdjacentHTML("afterbegin", "<p style='color:red'>QUnit introuvable : vérifiez le fichier vendor/qunit-2.26.0.js</p>");
    return;
  }

  // Compatible avec le script Chrome headless existant : état mesurable dans le DOM.
  QUnit.done(function (result) {
    const count = result.total;
    const failed = result.failed;
    const root = document.documentElement;
    root.setAttribute("data-test-count", String(count));
    root.setAttribute("data-test-failures", String(failed));
    root.setAttribute("data-test-status", failed === 0 && count >= 4 ? "pass" : "fail");
    let summary = document.getElementById("summary");
    if (!summary) {
      summary = document.createElement("p");
      summary.id = "summary";
      document.body.appendChild(summary);
    }
    summary.textContent = count + " test(s) : " + (count - failed) + " réussi(s), " + failed + " échec(s).";
  });

  const U = window.bkcore && window.bkcore.Utils;
  QUnit.module("HexGL — bkcore.Utils", function () {
    QUnit.test("updateClass ajoute une classe", function (assert) {
      assert.ok(U, "Utils.js chargé");
      const e = document.createElement("div");
      e.id = "test-hexgl-add";
      document.getElementById("qunit-fixture").appendChild(e);
      U.updateClass(e.id, "active", true);
      assert.true(e.classList.contains("active"));
    });
    QUnit.test("updateClass supprime une classe", function (assert) {
      assert.ok(U, "Utils.js chargé");
      const e = document.createElement("div");
      e.id = "test-hexgl-remove";
      e.className = "active";
      document.getElementById("qunit-fixture").appendChild(e);
      U.updateClass(e.id, "active", false);
      assert.false(e.classList.contains("active"));
    });
    QUnit.test("getOffsetTop additionne les décalages parent/enfant", function (assert) {
      const parent = {
        offsetTop: 37,
        offsetParent: null
      };
      const enfant = {
        offsetTop: 13,
        offsetParent: parent
      };
      assert.strictEqual(U.getOffsetTop(enfant), 50);
    });
    QUnit.test("getURLParameter lit les paramètres d'URL", function (assert) {
      assert.ok(U, "Utils.js chargé");
      U.URLParameters = null;
      const url = new URL(window.location.href);
      url.searchParams.set("hexgl_poc", "ok");
      // Le lanceur fournit hexgl_poc=ok ; en ouverture directe, on teste l'absence ou la présence.
      const expected = window.location.search.includes("hexgl_poc=ok") ? "ok" : null;
      assert.strictEqual(U.getURLParameter("hexgl_poc"), expected);
    });
    QUnit.test("getURLParameter renvoie undefined pour un paramètre absent", function (assert) {
      assert.ok(U, "Utils.js chargé");
      U.URLParameters = null;
      assert.strictEqual(U.getURLParameter("hexgl_parametre_absent"), undefined);
    });
    QUnit.test("getOffsetTop sans parent renvoie le seul décalage de l'élément", function (assert) {
      const seul = {
        offsetTop: 21,
        offsetParent: null
      };
      assert.strictEqual(U.getOffsetTop(seul), 21);
    });
    QUnit.test("isTouchDevice renvoie un booléen", function (assert) {
      assert.ok(U, "Utils.js chargé");
      assert.strictEqual(typeof U.isTouchDevice(), "boolean");
    });
  });

  const T = window.bkcore && window.bkcore.Timer;
  QUnit.module("HexGL — bkcore.Timer", function () {
    QUnit.test("msToTime décompose une durée en h/m/s/ms", function (assert) {
      assert.ok(T, "Timer.js chargé");
      // 3 725 042 ms = 1 h 2 min 5 s 42 ms
      assert.deepEqual(T.msToTime(3725042), { h: 1, m: 2, s: 5, ms: 42 });
    });
    QUnit.test("msToTime sur 0 ms renvoie zéro partout", function (assert) {
      assert.ok(T, "Timer.js chargé");
      assert.deepEqual(T.msToTime(0), { h: 0, m: 0, s: 0, ms: 0 });
    });
    QUnit.test("msToTimeString complète les champs par des zéros", function (assert) {
      assert.ok(T, "Timer.js chargé");
      assert.deepEqual(T.msToTimeString(3725042), { h: "01", m: "02", s: "05", ms: "0042" });
    });
    QUnit.test("zfill complète sans jamais tronquer", function (assert) {
      assert.ok(T, "Timer.js chargé");
      assert.strictEqual(T.zfill(7, 3), "007");
      assert.strictEqual(T.zfill(12345, 3), "12345");
    });
    QUnit.test("getElapsedTime formate le temps écoulé de l'instance", function (assert) {
      assert.ok(T, "Timer.js chargé");
      const timer = new T();
      timer.time.elapsed = 92300;
      const t = timer.getElapsedTime();
      assert.strictEqual(t.m, 1);
      assert.strictEqual(t.s, 32);
      assert.strictEqual(t.ms, 300);
    });
    QUnit.test("start active le timer, pause le désactive et reprend", function (assert) {
      assert.ok(T, "Timer.js chargé");
      const timer = new T();
      assert.false(timer.active, "inactif à la construction");
      timer.start();
      assert.true(timer.active, "actif après start");
      timer.pause(true);
      assert.false(timer.active, "en pause");
      timer.pause(false);
      assert.true(timer.active, "reprise");
    });
    QUnit.test("update ne fait rien sur un timer inactif", function (assert) {
      assert.ok(T, "Timer.js chargé");
      const timer = new T();
      timer.update();
      assert.strictEqual(timer.time.elapsed, 0);
    });
  });

  const B = window.bkcore && window.bkcore.Branding;
  QUnit.module("HexGL — bkcore.Branding", function (hooks) {
    // Éléments minimaux de l'écran d'accueil, recréés dans le fixture avant chaque test.
    hooks.beforeEach(function () {
      document.getElementById("qunit-fixture").innerHTML =
        '<div id="title"></div>' +
        '<div id="brand-block" style="display: none">' +
        '<span id="brand-name"></span><span id="brand-welcome"></span></div>';
    });
    // Les variables CSS sont posées sur <html>, hors du fixture : on les retire après chaque test.
    hooks.afterEach(function () {
      if (!B) { return; }
      Object.keys(B.cssVariables).forEach(function (k) {
        document.documentElement.style.removeProperty(B.cssVariables[k]);
      });
    });

    function vide() {
      return {
        enabled: true,
        name: null,
        welcome: null,
        logo: { src: null, alt: "" },
        colors: { menu: null, accent: null, accentHover: null }
      };
    }
    function etat() {
      const root = document.documentElement.style;
      const variables = Object.keys(B.cssVariables).map(function (k) {
        return root.getPropertyValue(B.cssVariables[k]);
      });
      return JSON.stringify([document.getElementById("qunit-fixture").innerHTML].concat(variables));
    }

    QUnit.test("enabled à false n'applique rien, même avec des valeurs renseignées", function (assert) {
      assert.ok(B, "branding.js chargé");
      const avant = etat();
      const config = vide();
      config.enabled = false;
      config.name = "Nom";
      config.welcome = "Message";
      config.logo.src = "logo-test.png";
      config.colors.menu = "#123456";
      assert.false(B.apply(config, document));
      assert.strictEqual(etat(), avant);
    });
    QUnit.test("des valeurs à null laissent le document inchangé", function (assert) {
      assert.ok(B, "branding.js chargé");
      const avant = etat();
      assert.true(B.apply(vide(), document));
      assert.strictEqual(etat(), avant);
    });
    QUnit.test("une configuration complète applique logo, textes et couleurs", function (assert) {
      assert.ok(B, "branding.js chargé");
      const config = vide();
      config.name = "Nom de test";
      config.welcome = "Message de test";
      config.logo = { src: "logo-test.png", alt: "Texte alternatif de test" };
      config.colors = { menu: "#111111", accent: "#222222", accentHover: "#333333" };
      assert.true(B.apply(config, document));
      const title = document.getElementById("title");
      assert.ok(title.style.backgroundImage.indexOf("logo-test.png") !== -1, "logo posé");
      assert.strictEqual(title.getAttribute("aria-label"), "Texte alternatif de test");
      assert.strictEqual(document.getElementById("brand-name").textContent, "Nom de test");
      assert.strictEqual(document.getElementById("brand-welcome").textContent, "Message de test");
      assert.strictEqual(document.getElementById("brand-block").style.display, "block");
      const root = document.documentElement.style;
      assert.strictEqual(root.getPropertyValue("--brand-menu").trim(), "#111111");
      assert.strictEqual(root.getPropertyValue("--brand-accent").trim(), "#222222");
      assert.strictEqual(root.getPropertyValue("--brand-accent-hover").trim(), "#333333");
    });
    QUnit.test("sans message d'accueil, le nom s'affiche et le message reste vide", function (assert) {
      assert.ok(B, "branding.js chargé");
      const config = vide();
      config.name = "Nom de test";
      B.apply(config, document);
      assert.strictEqual(document.getElementById("brand-block").style.display, "block");
      assert.strictEqual(document.getElementById("brand-name").textContent, "Nom de test");
      assert.strictEqual(document.getElementById("brand-welcome").textContent, "");
    });
  });
})();
