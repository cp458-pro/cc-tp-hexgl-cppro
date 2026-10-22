# Plan — Personnalisation événementielle HexGL (ACME)

Sources : `work/company-event/spec.md`, `docs/architecture.md`. Branche : `refactor/company-event`.

Note : la correction de `spec.md` demandée plus tôt n'a pas été appliquée (écriture refusée). Ce plan suit la
version actuelle de la spec et en retient les remarques de revue : crédits et licence inchangés, aucune
valeur de charte inventée.

## 1. Objectif

Afficher l'identité ACME sur l'écran d'accueil (logo, nom, message, couleurs de charte) sans toucher au
gameplay, avec **un seul point de configuration** et des changements petits et réversibles.

## 2. État actuel et architecture concernée

- Écran d'accueil = `<div id="step-1">` dans `index.html:46-60` : `#global` (fond `css/bg.jpg`), `#title`
  (logo HexGL, `css/title.png`), `#menucontainer` > `#menu` (START, Controls, Quality, HUD, Credits).
- Styles dans `css/multi.css` : fond `url('bg.jpg')` (l.65), logo `url('title.png')` + `background-size: auto 50%`
  (l.90), couleur du menu `#4190bb` (l.125), survol `#f66439` (l.151), START `#f66439` (l.158) et son survol
  `#f8854b` (l.162).
- Les libellés « Controls: … » sont posés par `launch.js` (généré depuis `launch.coffee`). `launch.js` est
  chargé en dernier (`index.html:126`).
- Le fond est une **image** : une « couleur de fond » de charte n'a pas d'emplacement CSS direct.
- Hors périmètre, à ne pas toucher : `bkcore/`, `launch.coffee`, `launch.js`, `libs/`, `#credits`, `step-2` à `step-5`.

## 3. Approche technique

Un fichier de configuration JavaScript classique (ES5, comme le reste du code) chargé avant `launch.js`.
Il contient les données de branding **et** une petite fonction qui les applique au DOM :

- le logo : `style.backgroundImage` posé sur `#title` ;
- le nom et le message : `textContent` d'un bloc ajouté dans `#step-1` ;
- les couleurs : variables CSS posées sur `documentElement`.

`multi.css` lit ces variables avec la valeur actuelle en repli (`var(--x, #4190bb)`), déclarée après une
valeur fixe pour les anciens navigateurs. Une valeur absente laisse donc l'apparence actuelle.
Aucun changement dans `launch.*` : le code de lancement et de course n'est pas modifié.

## 4. Fichiers et modules impactés

| Fichier | Changement |
|---|---|
| `branding/branding.js` (nouveau) | Config + fonction d'application, ES5 |
| `branding/logo.png` (nouveau) | Copie de `formation/identite/logo.png`, pour ne pas dépendre du dossier de formation |
| `index.html` | Un bloc vide dans `#step-1` et une balise `<script>` avant `launch.js` |
| `css/multi.css` | 3 couleurs lues via variables avec repli ; style du bloc nom/message |
| `formation/tests/index.html` | Charge `branding/branding.js` |
| `formation/tests/browser-tests.js` | Quelques tests de l'application du branding |
| `CLAUDE.md` | Où modifier le branding, commande de test |

## 5. Structure des données de branding

Un seul objet, `null` = valeur actuelle conservée.

| Champ | Type | Défaut | Effet |
|---|---|---|---|
| `enabled` | booléen | `false` jusqu'à l'étape 3 | `false` : écran strictement identique à l'actuel |
| `name` | texte ou `null` | `null` | Nom affiché sur l'accueil (« ACME », repris du ticket) |
| `welcome` | texte ou `null` | `null` | Message d'accueil ; bloc masqué s'il est vide |
| `logo.src` | chemin relatif à `index.html` ou `null` | `null` | Remplace `title.png` |
| `logo.alt` | texte | `""` | Texte alternatif |
| `colors.menu` | couleur CSS ou `null` | `null` | Remplace `#4190bb` |
| `colors.accent` | couleur CSS ou `null` | `null` | Remplace `#f66439` |
| `colors.accentHover` | couleur CSS ou `null` | `null` | Remplace `#f8854b` |

Les valeurs de couleur et le message ne sont pas renseignés : la charte est illisible et le message n'est
pas fourni. Ils se complètent plus tard **dans ce fichier seul**, sans changement de code.

## 6. Décisions techniques principales

1. **Pas de modification de `launch.*`** : le branding s'applique par un script séparé. Le gameplay reste hors d'atteinte.
2. **Variables CSS avec repli** plutôt que réécriture des couleurs : réversible, et conforme à « valeur de
   charte manquante = apparence précédente ».
3. **Logo copié dans `branding/`** : le dossier `formation/` est du matériel de formation, pas un asset du jeu.
4. **Pas de couleur de fond** : bg.jpg est une image ; voile ou nouvelle image est un choix à faire quand la
   charte sera lisible (point ouvert).
5. **Logo HexGL remplacé** (hypothèse de la spec). Basculer vers « ajouter » revient à changer `logo.src` /
   `enabled`, sans toucher au code.
6. **Code de plomberie uniquement** : pas de logique métier, conformément au profil. Chaque étape montre son diff.

## 7. Risques et compatibilité

- **Logo à fond blanc** (`logo.png`) : un rectangle blanc peut apparaître sur le fond flou. À juger sur capture.
- **Logo large** : environ 3:1, avec `background-size: auto 50%` de `#title`. Il peut déborder sur écran étroit.
- **Variables CSS** : absentes des très anciens navigateurs (le jeu cible aussi Firefox OS). La valeur fixe
  déclarée avant le repli couvre ce cas.
- **Clignotement** : `title.png` peut s'afficher une fraction de seconde avant d'être remplacé par le logo ACME.
- **Licence CC BY-NC 3.0** dans les en-têtes : crédits et mentions laissés intacts. La validité d'un usage
  commercial à l'événement est à faire valider côté juridique.
- **Compatibilité du gameplay** : aucune modification de `bkcore/`, `launch.*` ni `libs/`, donc aucun impact
  attendu. À contrôler avec `git diff --stat`.

## 8. Stratégie de tests et de vérification

Environnement : Python 3 (présent, 3.15) et Chrome. **Pas de Node.js.**

- Lancer le jeu : `python -m http.server 8765` depuis `HexGL/`, puis `http://localhost:8765/index.html`.
- Tests automatiques : `formation\tests\ci-chrome.bat` (commande de `CLAUDE.md`), code de retour 0.
- Capture de l'accueil sans Node : Chrome headless avec `--screenshot` sur `http://localhost:8765/index.html`
  (rendu logiciel). Comparer à `formation/tests/captures/accueil.png`.
- Contrôle manuel de la course (sans Node) : START → aide → chargement → compte à rebours → 10 s de course,
  HUD et piste visibles ; Credits s'ouvre et se ferme ; paramètres d'URL toujours pris en compte.
- Nouveaux tests QUnit, minimum utile : application complète de la config, valeur `null` qui laisse le DOM
  inchangé, `enabled` à `false` qui ne touche à rien, bloc message masqué quand `welcome` est vide.
- Périmètre : `git diff --stat` ne doit montrer que les fichiers du § 4.

**Aucun commit pendant l'implémentation.** Le commit se fait après la validation finale.

## 9. Plan d'implémentation (4 petites étapes)

**Étape 1 — Point de configuration, sans effet visible.** Créer `branding/branding.js` (`enabled: false`, tout à `null`),
ajouter le bloc vide et la balise `<script>`, ajouter les tests QUnit. Vérifier : tests verts, capture identique à
`accueil.png`, le jeu démarre.

**Étape 2 — Couleurs via variables CSS.** Faire lire les 3 couleurs à `multi.css` avec repli. Vérifier : aucune
différence visible avec `enabled: false`, tests verts.

**Étape 3 — Logo et nom.** Copier le logo dans `branding/`, passer `enabled` à `true`, renseigner `logo` et
`name: "ACME"`. Vérifier : capture de l'accueil, lisibilité, menu fonctionnel, course lancée, `git diff --stat`.

**Étape 4 — Charte, message et documentation (sous réserve des entrées).** Renseigner les couleurs et le message
dès qu'ils sont fournis, régénérer les captures de référence, mettre à jour `CLAUDE.md`. Vérifier : tests verts
et contrôle manuel final avant commit.

## Points à confirmer avant ou pendant l'implémentation

- Valeurs de charte (couleurs, polices) et texte du message d'accueil : non disponibles.
- Remplacer ou conserver le logo HexGL.
- Traitement du fond blanc du logo et d'une éventuelle couleur de fond.
