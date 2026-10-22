---
name: run-hexgl
description: Lancer, piloter et capturer HexGL (jeu de course WebGL statique) — démarrer le jeu, cliquer START, lancer une course, prendre des screenshots, vérifier qu'une modification du jeu marche dans le vrai navigateur. À utiliser pour « run », « start », « screenshot », « tester dans le navigateur » HexGL.
---

# Run HexGL

Jeu HTML5/WebGL **sans build** : fichiers statiques servis en HTTP, piloté en Chrome headless via le
protocole CDP par `driver.mjs` (aucune dépendance npm : Node ≥ 22 et Chrome suffisent).
Chemins relatifs à `HexGL/` (le dossier qui contient `index.html`).

## Prérequis
- Node ≥ 22 (WebSocket natif) — testé avec Node 24.
- Chrome : `C:/Program Files/Google/Chrome/Application/chrome.exe` par défaut, sinon `CHROME=<chemin>`.

## Run (agent)
```bash
node .claude/skills/run-hexgl/driver.mjs <dossier-captures> [secondes-de-course]
```
Le script sert le dépôt sur `localhost:8765`, ouvre Chrome (port de debug 9333), puis : capture du menu
(`1-menu.png`), qualité LOW + godmode, START (`2-aide.png`), attente du chargement, compte à rebours
(`3-depart.png`), accélération (flèche haut) pendant N secondes (`4-course.png`), état du jeu et erreurs JS
affichés. ~35 s au total. **Regarde les captures** : un cadre noir = échec.

Pour inspecter autrement, ajoute des `ev(...)` dans le driver : le jeu est exposé en `window.hexGL`
(`hexGL.gameplay.result`, `.lap`, `.timer.time.elapsed`).

## Run (humain)
`python -m http.server 8765` dans `HexGL/`, puis ouvrir `http://localhost:8765/index.html`.
Utile seulement avec une fenêtre.

## Gotchas
- **Rendu logiciel** : headless n'a pas de GPU ; `--enable-unsafe-swiftshader --use-angle=swiftshader`
  donne un WebGL fonctionnel mais lent. Le driver passe la qualité en LOW (réglage cyclique : un clic sur
  `#s-quality` depuis VERY HIGH). En VERY HIGH, le vaisseau est tombé de la piste et l'écran de fin
  (`#step-5`, « click to continue ») est apparu à ~10 s.
- Sans steering, le vaisseau finit par sortir de la piste : `godmode` (`#s-godmode`) évite la destruction.
- Le chargement des assets (`init()` après clic sur `#step-2`) est asynchrone : on attend que `#step-4`
  devienne visible, puis ~6 s de compte à rebours avant que la course démarre.
- Les captures partent dans le dossier passé en argument : choisis un dossier hors dépôt.
- Sous Windows/Git Bash, `pkill` ne tue pas un `python -m http.server` laissé en arrière-plan : le driver
  échoue alors en `EADDRINUSE` sur le port 8765. Libère-le (Gestionnaire des tâches ou
  `Get-NetTCPConnection -LocalPort 8765` en PowerShell, en ciblant le PID de python).

## Troubleshooting
- `EADDRINUSE ... 8765` → un autre serveur tourne déjà (voir ci-dessus). Pour ne pas l'arrêter,
  lancer le pilote sur un autre port : `HEXGL_PORT=8790 node .claude/skills/run-hexgl/driver.mjs <dossier>`.
- `Chrome injoignable` → `CHROME` mal défini, ou port 9333 occupé.
- `webgl: false` ou bouton « WebGL is not supported! » → les flags SwiftShader n'ont pas été pris en compte.
