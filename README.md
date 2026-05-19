# Projet YAMS - Web App

Une application web complète permettant de jouer au célèbre jeu de dés **Yams** (ou Yahtzee) en ligne, avec un fort aspect social.

## Fonctionnalités disponibles

* **Jouer au Yams** : Mécanique complète avec lancers de dés, grille de score et tours de jeu (Parties publiques ou privées).
* **Comptes utilisateurs** : Inscription, connexion, et sauvegarde des données.
* **Système Social** : Ajout d'amis, liste d'amis, et Chat privé inter-joueurs.
* **Tchat en ligne** : Discussion en temps réel au sein d'une partie.
* **Progression & Historique** : Suivi des anciennes parties et déblocage de succès (Achievements).
* **Avis & Évaluations** : Espace permettant aux joueurs de noter le jeu et de laisser un commentaire public (visible sur le tableau de bord).

## Comment lancer l'application

### Prérequis
* **Java 17+** et **Maven** installés sur votre machine (pour le backend).
* **Node.js** et **npm** installés (pour le frontend).

### 1. Démarrer le Backend (Spring Boot)
Ouvrez un terminal à la racine du projet et exécutez la commande suivante :
```bash
mvn spring-boot:run
```
Le backend (et la base de données locale) se lanceront automatiquement sur `http://localhost:8080`.

### 2. Démarrer le Frontend (React / Vite)
Ouvrez un **second terminal**, rendez-vous dans le dossier `frontend` et installez les dépendances avant de lancer le serveur de développement :
```bash
cd frontend
npm install
npm run dev
```
Le frontend sera ensuite accessible (généralement sur `http://localhost:5173`).

---
*Note : Les dossiers de `build` (comme `target/`, `node_modules/` ou `dist/`) ont été ignorés pour ne pas surcharger le dépôt, car ils sont regénérés par les commandes ci-dessus.*