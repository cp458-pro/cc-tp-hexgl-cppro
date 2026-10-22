# HexGL — notes pour l'agent

Jeu HTML5/WebGL sans build. Chemins relatifs à `HexGL/` (dossier qui contient `index.html`).
Architecture : `docs/architecture.md`. Spec et plan de la personnalisation ACME : `work/company-event/`.

## Lancer le jeu

`python -m http.server 8765` depuis `HexGL/`, puis `http://localhost:8765/index.html`. Python 3 suffit,
aucun Node.js n'est nécessaire.

## Branding de l'écran d'accueil

Un seul point de configuration : l'objet `bkcore.Branding.config` dans `branding/branding.js`.
Aucun autre fichier ne se modifie pour changer l'identité de l'accueil.

| Champ | Effet | Valeur `null` ou vide |
|---|---|---|
| `enabled` | `false` : écran d'origine, rien n'est appliqué | — |
| `name` | Nom affiché sous le menu | Aucun nom |
| `welcome` | Message d'accueil affiché sous le nom | Aucun message |
| `logo.src`, `logo.alt` | Logo à la place de `css/title.png` (chemin relatif à `index.html`) | Logo HexGL d'origine |
| `colors.menu`, `colors.accent`, `colors.accentHover` | Variables CSS `--brand-menu`, `--brand-accent`, `--brand-accent-hover`, lues par `css/multi.css` | Couleurs d'origine (`#4190bb`, `#f66439`, `#f8854b`) |

État au 2026-10-22 : logo ACME (`branding/logo.png`) et nom « ACME » renseignés. **Les couleurs de charte et
le message d'accueil ne sont pas renseignés** : le PDF de charte n'a pas pu être lu et le message n'a pas
été fourni. Ils se complètent dans `branding/branding.js` seul, sans changement de code.

**Vaisseau rose** (hors spec et hors plan initiaux, demandé ensuite) : seule la texture de couleur du vaisseau
a été recolorée, `textures/ships/feisar/diffuse.jpg` (512 px, qualités basses) et
`textures.full/ships/feisar/diffuse.jpg` (1024 px, qualités hautes). Teintes bleues passées en rose, accents
orange conservés. Aucun code modifié ; la flamme du booster reste bleue. Pour revenir en arrière :
`git restore HexGL/textures/ships/feisar/diffuse.jpg HexGL/textures.full/ships/feisar/diffuse.jpg`.

Le branding s'applique par un script séparé chargé avant `launch.js`. `launch.*`, `bkcore/` et `libs/`
ne sont pas modifiés. Les mentions d'auteur et de licence (écran Crédits, en-têtes) restent intactes.

## Tests QUnit

Commande (depuis `HexGL/`) :

- Windows : `formation\tests\ci-chrome.bat`
- Linux : `bash formation/tests/ci-chrome.sh`

Codes de retour : `0` = tous les tests passent, `1` = échec d'assertion (rapport dans
`formation/tests/rapport_erreur.html`), `2` = exécution impossible (navigateur absent ou bloqué).
Le script n'affiche pas le nombre de tests. Pour le lire, ouvrir `formation/tests/index.html` dans un
navigateur, ou lire `data-test-count` et `data-test-failures` dans le DOM.

Fichiers : `formation/tests/browser-tests.js` (tests), `formation/tests/index.html` (scripts chargés :
`Utils.js`, `Timer.js`, `branding/branding.js`), `formation/tests/vendor/` (QUnit 2.26.0 local).

Ce que protègent les tests :

- **bkcore.Utils** : `updateClass` (ajout et suppression de classe), `getOffsetTop` (somme des décalages
  parent/enfant, et cas sans parent), `getURLParameter` (lecture d'un paramètre, valeur absente),
  `isTouchDevice` (renvoie un booléen).
- **bkcore.Timer** : `msToTime` (décomposition en h/m/s/ms), `msToTimeString` et `zfill` (remplissage
  par des zéros sans troncature), `getElapsedTime`, `start`/`pause`, `update` sans effet sur un timer inactif.
- **bkcore.Branding** : `enabled` à `false` n'applique rien, des valeurs à `null` laissent le document
  inchangé, une configuration complète applique logo, textes et variables de couleur, un nom sans message
  laisse le message vide. Ces tests utilisent leurs propres configurations : ils ne figent ni le logo, ni
  les couleurs, ni les textes réellement affichés.

Ces tests ne lancent pas le jeu et ne dépendent pas de WebGL.

## Captures de référence

- `formation/tests/captures/accueil.png` : écran d'accueil avec le logo et le nom ACME (qualité VERY HIGH
  par défaut, sans couleurs de charte ni message).
- `formation/tests/captures/jeu-en-cours.png` : course en cours, qualité LOW et godmode activé.

Captures **datées du 2026-10-22**, régénérées après l'étape 3 du plan (logo et nom). Ce ne sont pas des
tests. Elles sont à régénérer quand les couleurs de charte ou le message d'accueil seront renseignés.

Pour les régénérer, le pilote est `.claude/skills/run-hexgl/driver.mjs` (Chrome headless, serveur sur le
port 8765). Il demande Node.js, présent sur ce poste, mais ni le jeu ni les tests n'en dépendent.
Il produit `1-menu.png` et `4-course.png` dans le dossier passé en argument.
Il faut qu'aucun serveur n'écoute déjà sur ce port.
