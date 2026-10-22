# Spécification — Personnalisation événementielle HexGL (ACME)

Statut : **brouillon**. Des valeurs de charte et des textes restent à fournir (voir « Points ouverts »).
Source du besoin : `formation/tickets/company-event.md`. Sources d'identité : `formation/identite/`.

## 1. Contexte et objectif

ACME veut utiliser HexGL lors d'un événement d'entreprise. Le jeu doit donc afficher l'identité ACME dès
l'écran d'accueil, sans que le jeu lui-même change.

Objectif : un écran d'accueil aux couleurs et au logo ACME, avec le nom de l'entreprise et un message
d'accueil, et une course strictement identique à la version actuelle.

## 2. Exigences fonctionnelles

- **EF-1 Logo** : l'écran d'accueil affiche le logo ACME fourni (`formation/identite/logo.png`) à la place
  du logo HexGL.
- **EF-2 Couleurs** : les couleurs de l'écran d'accueil (fond, texte et boutons du menu) suivent la charte
  graphique ACME.
- **EF-3 Nom** : le nom de l'entreprise, « ACME », apparaît sur l'écran d'accueil.
- **EF-4 Message d'accueil** : un message d'accueil ACME apparaît sur l'écran d'accueil.
- **EF-5 Menu inchangé** : les options du menu (START, Controls, Quality, HUD, Credits) restent présentes et
  fonctionnelles. Seule leur apparence change.

## 3. Comportements attendus

- Au chargement de la page, l'écran d'accueil s'affiche directement avec l'identité ACME. Aucune
  interaction n'est nécessaire.
- Le menu se comporte comme aujourd'hui : chaque option se modifie au clic, START lance le jeu.
- Une fois la course lancée, l'écran de jeu, le HUD, les contrôles, la piste et le chronométrage ne
  changent pas.
- L'écran de fin et l'écran de crédits ne sont pas modifiés par ce chantier.

## 4. Contraintes

- **C-1 Gameplay inchangé** : aucune modification de la logique de course, de la physique, des contrôles,
  de la piste ni du chronométrage. Le ticket l'impose.
- **C-2 Identité fournie** : le logo et la charte sont la référence. Aucune couleur ni police n'est inventée.
- **C-3 Valeurs non figées dans la spec** : les codes couleur, les tailles et les textes exacts sont
  renseignés à partir de la charte et du message fourni. Ils peuvent changer sans nouvelle spec.
- **C-4 Lisibilité** : le texte du menu reste lisible sur le fond de l'écran d'accueil, aux tailles
  d'écran courantes (ordinateur et tablette en paysage).
- **C-5 Tests existants** : la suite QUnit (`formation/tests/`) reste verte.
- **C-6 Pas de nouvelle dépendance** : aucun framework, aucun outil de build ajouté.

## 5. Décisions de conception déjà imposées

- Le changement porte sur l'écran d'accueil uniquement (étape 1 du lancement).
- Le logo ACME remplace le logo HexGL sur cet écran. Hypothèse, voir § 9.
- Les textes ACME (nom, message) sont fournis par ACME et ne sont pas inventés par l'équipe.

## 6. Cas limites et gestion des erreurs

- **Logo absent ou illisible** : l'écran doit rester utilisable (menu cliquable), même si le logo ne charge pas.
- **Fond clair du logo** : le logo a un fond blanc. Il doit rester visible sur le fond de l'écran
  d'accueil (voir § 9).
- **Message trop long** : le texte ne doit pas recouvrir le menu, quelle que soit la largeur d'écran.
- **Valeur de charte manquante** : tant qu'une couleur ou une police n'est pas fournie, la version
  précédente reste affichée. Aucune valeur par défaut n'est inventée.
- **Paramètres d'URL existants** (réglages forcés par l'URL) : ils continuent de fonctionner.

## 7. Hors périmètre

- Le gameplay, la piste, le HUD, les contrôles et le chronométrage.
- L'écran de fin de course et l'écran de crédits.
- Le titre de la page, la favicon et les métadonnées de partage (`index.html`). Hypothèse, voir § 9.
- Les liens de partage Twitter et Facebook, le classement en ligne et Google Analytics.
- Les versions mobiles (`index-mobile.html`, absent du dépôt).
- Une interface de configuration de la charte par l'utilisateur final.

## 8. Critères d'acceptation

- **CA-1** : à l'ouverture de `index.html`, le logo ACME s'affiche à la place du logo HexGL.
- **CA-2** : les couleurs de l'écran d'accueil correspondent aux codes fournis par la charte ACME (valeurs à
  renseigner, § 9). Vérifié par capture d'écran comparée à la charte.
- **CA-3** : le nom « ACME » et le message d'accueil fournis apparaissent sur l'écran d'accueil.
- **CA-4** : START, Controls, Quality, HUD et Credits fonctionnent comme avant (un clic change la valeur,
  START lance le jeu, Credits affiche et ferme l'écran de crédits).
- **CA-5** : une course lancée par le pilote `run-hexgl` se déroule sans erreur JS, avec le HUD et la
  piste visibles. La capture de jeu en cours est comparable à `formation/tests/captures/jeu-en-cours.png`.
- **CA-6** : la suite QUnit passe (code de retour 0 de `ci-chrome.bat`), avec au moins les 14 tests actuels.
- **CA-7** : aucun fichier de la logique de course n'est modifié. Vérifiable par `git diff` limité à
  l'écran d'accueil et à ses styles.
- **CA-8** : le texte du menu reste lisible sur une capture à 1280×720 et à une largeur de tablette en
  paysage.

## 9. Points ouverts

Ces points bloquent les critères CA-2 et CA-3 jusqu'à leur réponse. Les autres peuvent être tranchés
par défaut.

1. **Charte graphique (bloquant pour CA-2)** : le PDF `charte_graphique_acme.pdf` n'a pas de texte
   extractible et n'a pas pu être rendu dans l'environnement. Codes couleur, polices et zone de protection
   du logo sont à fournir.
2. **Nom et message d'accueil (bloquant pour CA-3)** : le texte exact du message n'est pas fourni.
   Le nom « ACME » est repris du ticket.
3. **Logo HexGL** : hypothèse retenue, il est remplacé et non conservé en complément. À confirmer.
4. **Fond blanc du logo** : le fichier `logo.png` a un fond blanc. Faut-il le détourer ou prévoir un fond
   coloré derrière ? Hypothèse : fourni tel quel, la mise en page s'adapte.
5. **Titre de la page et favicon** : hypothèse, hors périmètre (§ 7). À confirmer si ACME veut que
   l'onglet du navigateur change aussi.
6. **Textes du menu** (START, Controls…) : hypothèse, ils restent en français/anglais d'origine. Peuvent
   être traduits si ACME le demande.
