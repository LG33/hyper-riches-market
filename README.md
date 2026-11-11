# Hyper Riches Market

ULTRA RICHE MARKET



Concept



Créer un faux site e-commerce immersif, ludique et pédagogique intitulé ULTRA RICHE MARKET — Consommez comme un milliardaire.



Le concept : l'utilisateur saisit les revenus annuels bruts de son foyer, choisit un milliardaire et découvre un supermarché de produits dont les prix sont réduits proportionnellement à l'écart de revenus.



Objectif : faire ressentir concrètement les inégalités économiques par une expérience shopping amusante, surprenante et partageable. Le site doit ressembler à un véritable site marchand, pas à un outil militant ou à un tableau de statistiques.



1. Écran d'accueil et simulateur



Titre : « Et si vous aviez le pouvoir d'achat d'un milliardaire ? »



Deux étapes :



- Saisir les revenus annuels bruts du foyer (valeur initiale : 58 000 €).

- Choisir un milliardaire dans une galerie de profils avec portrait, nom et revenus annuels de référence : Françoise Bettencourt Meyers (1,34 mds), Bernard Arnault (3,2 milliards), François Pinault (150 millions), Vincent Bolloré (160 millions), Xavier Niel (500 millions).



Afficher immédiatement le coefficient de réduction des prix :

Revenus annuels de référence du milliardaire / revenus annuels du foyer.



Exemple : 3,2 milliard € / 58 000 € = environ 55 000 fois.



Tous les prix du magasin sont divisés par ce coefficient.



2. Le magasin



Créer un véritable catalogue e-commerce avec cartes produits, photographies réalistes, nom, description, prix réel barré, prix simulé très visible et bouton « Ajouter au panier ».



Trois catégories principales :



PRESQUE GRATUIT

Produits du quotidien : baguette, café, courses alimentaires, vêtements, smartphone, électroménager, restaurant, vacances ordinaires.



TOUT À 2 €

Rayon spécial présentant des produits dont le prix simulé est proche de 2 €. Les prix doivent être calculés réellement à partir du coefficient, et non arbitrairement fixés à 2 €. Filtrer les produits entre 1,50 € et 2,50 €.



ABORDABLE

Produits luxueux : montres à 30 000 €, sacs de créateurs, voitures sportives, villas, hôtels de luxe, œuvres d'art.



PETITES FOLIES

Dépenses extravagantes : yachts, jets privés, hélicoptères, îles privées, hôtels particuliers, séjours exceptionnels.



Les catégories doivent avoir des univers visuels distincts et un ton commercial légèrement ironique.



3. Panier en mode ticket de caisse



Créer un panier interactif persistant pendant la session :



- Ajouter et supprimer des produits.

- Modifier les quantités.



Afficher sous forme de ticket de caisse avec pour chaque article :



- Désignation.

- Quantité.

- Prix réel.

- Prix simulé.



En bas du ticket, afficher une comparaison pédagogique :



Combien de jours de revenus pour acheter ce panier ?



Calculer :



- Pour l'utilisateur : prix réel total / (revenus annuels bruts du foyer / 220).

- Pour le milliardaire : prix réel total / (revenus annuels de référence / 220).



Afficher les résultats en jours, avec conversion en heures lorsque pertinent.



Préciser que les 220 jours constituent une convention simplifiée et que, pour les milliardaires rémunérés en dividendes, il s'agit de jours équivalents de revenus, pas de jours effectivement travaillés.



Afficher un message marquant : « Vous avez dépensé X jours de vos revenus. Pour [nom du milliardaire], cela représente Y jours de revenus. »



Prévoir un bouton « Partager mon ticket » permettant de générer une carte visuelle partageable avec le panier, les deux totaux et la comparaison en jours.



4. Transparence



Pour les grandes fortunes, certains montants peuvent correspondre à des dividendes bruts associés à leurs participations familiales, éventuellement versés à des holdings, et non à des revenus personnels disponibles.



Afficher une mention pédagogique accessible depuis le simulateur :



« Les revenus de votre foyer sont exprimés en brut, avant impôts et cotisations sociales. Pour les grandes fortunes, nous utilisons des estimations de dividendes bruts associés à leurs participations. Ces sommes peuvent être perçues par des holdings et ne constituent pas nécessairement des revenus personnels disponibles. La fiscalité et les différences de structure de revenus ne sont pas prises en compte. Cette simulation illustre des écarts de revenus bruts annuels, elle ne constitue pas un calcul de pouvoir d'achat réel. »



Chaque profil doit permettre de consulter la source, l'année de référence et la nature du montant. Ne pas inventer de données : signaler les valeurs provisoires comme estimations à vérifier.



5. Direction artistique et UX



Créer une identité visuelle de véritable boutique en ligne premium :



- Interface moderne, responsive, mobile-first.

- Design commercial crédible, élégant et légèrement extravagant.

- Typographie contemporaine, grandes photographies produits, prix très lisibles.

- Couleurs évoquant le luxe et le commerce, sans tomber dans le kitsch.

- Micro-animations discrètes lors de l'ajout au panier et du changement de pouvoir d'achat.

- Ton publicitaire sérieux avec des accroches humoristiques.

- Navigation fluide, rapide et intuitive.



Le contraste entre les produits extravagants et leurs prix dérisoires doit constituer le principal effet visuel.



6. Fonctionnalités importantes



- Recalcul instantané de tous les prix lorsqu'on change de milliardaire ou de revenus.

- Recherche et filtres par catégorie et prix.

- Panier actualisé en temps réel.

- Ticket de caisse téléchargeable ou partageable sous forme d'image.

- Possibilité de changer de profil sans perdre son panier.

- Fonctionnement avec un catalogue de données locales pour le prototype.

- Tous les montants et calculs doivent être cohérents et dynamiques.



7. Parcours utilisateur



1. Découvrir le concept.

2. Saisir ses revenus.

3. Choisir son milliardaire.

4. Découvrir les prix devenus dérisoires.

5. Explorer les catégories, notamment « Tout à 2 € ».

6. Remplir son panier.

7. Découvrir son ticket de caisse et la comparaison en jours de revenus.

8. Partager son expérience.



Priorité absolue : réaliser une expérience shopping réellement fonctionnelle et amusante. Le visiteur doit avoir envie de parcourir le catalogue avant même de comprendre toute la démonstration économique.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://hyper-riches-market.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f536023-a6f7-49ef-84ba-3d88ea3dbda0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
