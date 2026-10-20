# Prompts principaux

## A1 -  Récupérer le projet

```text
cd /formation
```

```text
git clone https://github.com/wanegain3/cc-tp-hexgl.git cc-tp-hexgl
```

## A2 - Explorer le legacy

```text
Explore ce projet legacy sans modifier aucun fichier.

Génère directement `docs/architecture.md` avec :

- stack et points d’entrée
- flux principal de lancement
- principaux modules, fichiers et assets
- dépendances et zones legacy à risque
- fonctions/modules testables automatiquement, notamment avec les tests QUnit disponibles dans formation/tests/
- bugs, dettes ou anomalies remarquables.

Le document doit décrire uniquement l’état actuel du projet.

Ne propose aucune solution.
Ne refactore rien.
Ne modifie aucun autre fichier.
```

Cf. /A2-explorer pour un exemple de architecture.md

## A3 - Figer les comportements à préserver

```text
En t'appuyant sur docs/architecture.md, commence par lancer le jeu et réaliser deux captures de référence : l'écran d'accueil et le jeu en cours. Enregistre-les dans formation/tests/captures/. Si les captures automatiques sont impossibles, signale-le sans bloquer la suite.

Ensuite, identifie quelques comportements existants à protéger avant le refactoring. Une suite de tests QUnit existe déjà dans formation/tests/ : examine-la et complète-la avec quelques tests de non-régression pertinents.

Contraintes :
- Conserver et enrichir `formation/tests/browser-tests.js`, sans créer de nouveau framework de tests.
- Privilégier les fonctions simples à tester automatiquement (Utils, Timer…), sans lancer le jeu ni dépendre du rendu WebGL.
- Charger les scripts supplémentaires nécessaires dans `formation/tests/index.html`.
- Ne pas modifier le code fonctionnel.
- Ne pas ajouter de dépendances, de `package.json` ni de commande `npm test`.
- Ne pas figer le logo, les couleurs, les textes ou les éléments de branding qui seront volontairement modifiés plus tard.

À la fin :
1. Exécute les tests avec `formation/tests/ci-chrome.bat` sous Windows ou `ci-chrome.sh` sous Linux.
2. Indique clairement les tests réussis, échoués ou impossibles à exécuter.
3. Documente la commande de test et l’emplacement des éventuelles captures dans `CLAUDE.md` pour future réutilisation
4. Explique brièvement ce que chaque nouveau test protège.
```

Cf. /A3-figer-les-comportements pour un exemple des nouveaux tests et des captures, ainsi que le claude.md

## B1 - Créer une branche dédiée

```text
git status
```

```text
git switch -c refactor/company-event
```

```text
git branch
```

## B2 et B3 - Spécification fonctionnelle

Ce prompt utilise le ticket, le logo, et la charte graphique déjà préparées dans le dossier /HexGL/formation/ pour générer la specification fonctionnelle :

```text
Lis :
- @formation/tickets/company-event.md
- @formation/identite/charte_graphique_acme.pdf
- @formation/identite/logo.png
- @docs/architecture.md
- ainsi que le code concerné.

@formation/tickets/company-event.md est notre source de vérité du besoin. 
La charte et le logo sont des contraintes d'identité visuelle à respecter.

Avant de rédiger la spec :
- utilise AskUserQuestion uniquement si une ambiguïté nécessite réellement une décision humaine
- ne redemande pas ce qui est déjà explicite dans les documents
- ne détaille pas encore le plan d’implémentation ni les fichiers à modifier

Une fois les points nécessaires clarifiés, génère : work/company-event/spec.md avec :
- Contexte et objectif
- Exigences fonctionnelles
- Comportements attendus
- Contraintes
- Décisions de conception déjà imposées
- Cas limites et gestion des erreurs
- Hors périmètre
- Critères d’acceptation

La spécification décrit ce que l’on veut obtenir, pourquoi et comment le valider, sans détailler les choix d’implémentation.

Ne modifie aucun code.
```
Review : 
```text
Relis @work/company-event/spec.md comme reviewer produit.
Signale uniquement :
- les ambiguïtés restantes
- les exigences non vérifiables
- les détails d’implémentation prématurés qui devraient plutôt apparaître dans plan.md
- les exigences inventées par rapport aux sources du besoin
- les cas limites ou éléments hors périmètre manquants qui pourraient élargir le travail.
Ne modifie rien. Classe les remarques par importance.
```

Cf. /B2-B3-spec pour une exemple de specification fonctionnelle

## B4 et B5 - plan

En mode plan :
```text
À partir de @work/company-event/spec.md et de @docs/architecture.md, propose l’approche technique minimale pour implémenter le changement dans cette codebase legacy.

Contraintes :
- pour lancer le jeu, privilégier une commande compatible avec l'environnement disponible (Python 3, PHP, etc.), sans supposer la présence de Node.js.
- prévoir des vérifications après chaque étape, mais aucun commit pendant l'implémentation : le commit sera réalisé après la validation finale
- préserver le gameplay et le fonctionnement actuel
- ne pas changer de framework ni moderniser Three.js / CoffeeScript
- centraliser le branding dans un seul point de configuration
- Ne pas introduire Node.js, de build ni de nouvelles dépendances. Réutiliser les tests QUnit existants et leur commande d'exécution documentée dans CLAUDE.md
- pas de backend ni d’upload dynamique
- préférer de petits changements réversibles

Structure le plan avec :
- objectif
- état actuel et architecture concernée
- approche technique
- fichiers et modules impactés
- structure des données de branding si nécessaire
- décisions techniques principales
- risques et compatibilité
- stratégie de tests et de vérification
- plan d’implémentation en 3 à 5 petites étapes

Ne code rien.
Si je valide le plan, enregistre-le dans work/company-event/plan.md mais ne l’implémente pas.
```

Cf. /B4-B5-plan pour une exemple de plan.md

## B6 - Build

Cf. /B6-build pour les captures d'écran de chaque étape

### ETAPE 1 : 

```text
Implémente uniquement l’étape 1 du plan d’implémentation de @work/company-event/plan.md.
Respecte exactement le plan validé et les contraintes propres à cette étape.
Règles :
- N’anticipe pas les étapes suivantes.
- Ne modifie rien hors du périmètre prévu.
- Si l’implémentation nécessite de s’écarter du plan validé, arrête-toi et explique l’écart avant de poursuivre.
- Ne touche pas au gameplay ni au code existant hors du périmètre prévu.
- Relance les tests avec la commande documentée dans `CLAUDE.md`.
- Si un test échoue, corrige la cause sans supprimer ni affaiblir le test.
- Si l'étape modifie le rendu ou les interactions, vérifie-les dans le navigateur seulement si les outils disponibles le permettent (ex:playwright), mais sans créer de script de pilotage du navigateur (CDP, etc.)
- N’effectue aucun commit.
- Arrête-toi après cette étape.
- Résume les fichiers modifiés, les changements effectués et les résultats des vérifications.
Ne commence pas l’étape suivante.
```

### ETAPES 2 - N : 

```text
L’étape précédente est validée.

Implémente uniquement l’étape suivante du plan d’implémentation de @work/company-event/plan.md.

Respecte exactement le plan validé et les contraintes propres à cette étape.

Règles :
- N’anticipe pas les étapes suivantes.
- Ne modifie rien hors du périmètre prévu.
- Si l’implémentation nécessite de s’écarter du plan validé, arrête-toi et explique l’écart avant de poursuivre.
- Ne touche pas au gameplay ni au code existant hors du périmètre prévu.
- Relance les tests avec la commande documentée dans `CLAUDE.md`.
- Si un test échoue, corrige la cause sans supprimer ni affaiblir le test.
- Si l'étape modifie le rendu ou les interactions, vérifie-les dans le navigateur seulement si les outils disponibles le permettent (ex:playwright), mais sans créer de script de pilotage du navigateur (CDP, etc.)
- N’effectue aucun commit.
- Arrête-toi après cette étape.
- Résume les fichiers modifiés, les changements effectués et les résultats des vérifications.

Ne commence pas l’étape suivante.
```

## B7 - Vérification finale

```text
/simplify Concentre-toi uniquement sur les fichiers modifiés pour ce changement. Simplifie seulement si cela améliore réellement la qualité ou réduit la duplication. Ne change aucun comportement, n'élargis pas le périmètre, ne modernise pas la codebase et ne touche pas au gameplay ni au code existant hors du périmètre prévu. Si aucune simplification utile n'est nécessaire, ne modifie rien.
```

puis :

```text
Vérifie l'implémentation par rapport aux critères d'acceptation de @work/company-event/spec.md.
Relance les tests documentés dans `CLAUDE.md`. Vérifie également le rendu et les interactions dans le navigateur si les outils disponibles le permettent, en utilisant les captures de référence. Sinon, précise les contrôles manuels restant à effectuer.
Pour chaque critère, indique :
- PASS, FAIL ou INCONCLUSIVE ;
- la preuve réellement obtenue : test, fichier, diff ou comportement observé ;
- si FAIL, la cause probable.
Vérifie également qu'aucun changement hors périmètre n'a été introduit.
Ne modifie rien pendant cette vérification et n'effectue aucun commit.
```

## B8 - Capitaliser et documenter


```text
Analyse @work/company-event/spec.md, @work/company-event/plan.md et le diff actuel. 
Identifie les informations durables qui doivent être répercutées dans docs/architecture.md : changements d’architecture, nouvelles commandes, contraintes, pièges importants et décisions techniques durables.
Propose uniquement les mises à jour nécessaires.
Ne supprime ni spec.md ni plan.md.
```

puis :

```text
Applique les mises à jour validées à @docs/architecture.md.
Supprime uniquement les fichiers temporaires devenus inutiles.
Conserve work/company-event/spec.md et work/company-event/plan.md, les tests QUnit, CLAUDE.md et les captures de référence dans formation/tests/captures/.
```

Cf. /B8-capitaliser-et-documenter pour la doc mise à jour.

## B9 - Commit

```text
Analyse les changements Git actuels, y compris la spécification, le plan, le code, les tests et la documentation.
Vérifie que les fichiers concernés appartiennent uniquement au périmètre de ce TP, dans `HexGL/`. Ne prends pas en compte les autres dossiers du dépôt, notamment `etapes/`.
Si tu détectes un changement inattendu ou hors périmètre, arrête-toi et signale-le.
Sinon, propose un message adapté, ajoute uniquement les fichiers validés et crée le commit local.
Ne fais aucun push.
```

## B10 - Automatisations Git

Cf. /B10-automatisations-git pour les fichiers du chapitre sur Git, GitHub, et CI / CD

### Connecter le dépôt distant

Connexion à votre propre dépôt :
```text
cd ..
```

```text
git remote -v
```

```text
git remote set-url origin https://github.com/votre-compte/cc-tp-hexgl-NOM.git
```

```text
git remote -v
```

Envoi de vos branches locales sur le dépôt distant :
```text
git push -u origin main
```

```text
git push -u origin refactor/company-event
```

### Hook pre-commit

```text
git config core.hooksPath .githooks
```

(pour sur linux/mac)
```text
chmod +x .githooks/pre-commit
```

```text
git add .githooks/pre-commit
```

```text
git commit -m "Ajout du hook pre-commit"
```

### Ajout de la CI

```text
git add .github/workflows/ci.yml
```

```text
git commit -m "Ajout de la CI"
```

```text
git push
```

### Ajout des github actions

```text
winget install --id GitHub.cli -e
```

```text
/install-github-app
```

```text
git switch main
```

```text
git pull
```

### Ajout de la CD

```text
git switch main
```

```text
git pull
```

```text
git add .github/workflows/cd.yml
```

```text
git commit -m "Ajout de la CD"
```

```text
git push
```
