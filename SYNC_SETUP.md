# NOUVEL ÉLAN — synchronisation (chantier en cours)

## État au 25 novembre 2026
- Projet Supabase existant : EPS Connect (les tables EPS existantes restent inchangées).
- Tables dédiées : `ne_schools`, `ne_memberships`, `ne_sessions`, `ne_harvests`.
- 3 établissements × 8 classes = 24 sessions initialisées.
- RLS activée ; accès aux données nominatives réservé aux utilisateurs authentifiés et autorisés.
- Fonction Edge `ne-session-status` déployée : lecture seule de l'état ouvert/fermé d'une classe, sans données nominatives.
- **Le site GitHub Pages utilise encore le stockage local. La synchronisation n'est PAS en service.**

## Contrat API public en lecture seule
`GET https://jipvubvkkmkblxqvzreg.supabase.co/functions/v1/ne-session-status?school=sc&class=6e1`

Réponse : `{ "school":"sc", "class_name":"6e1", "session_number":1, "is_open":false }`

Établissements : `sc`, `sp`, `osee`. Classes : `6e1`, `6e2`, `5e1`, `5e2`, `4e1`, `4e2`, `3e1`, `3e2`.

## À terminer avant la mise en production
1. Authentification adulte côté serveur. Les mots de passe existants sont visibles dans l'ancienne version publique du dépôt et ne peuvent pas seuls autoriser la lecture de données sensibles. Conserver l'ergonomie et les identifiants, mais ajouter une preuve secrète non publiée ou migrer vers des comptes sécurisés.
2. Authentification élève à privilèges restreints, sans possibilité de lire les récoltes des autres.
3. API serveur de gestion des sessions (ouvrir, fermer, préparer suivante, réinitialiser), réservée aux adultes authentifiés.
4. API de dépôt des récoltes, validation de l'ouverture côté serveur, unicité élève/session, limitation d'abus, isolation établissement.
5. Chargement des bilans et graphiques adultes depuis Supabase, suppression et exports.
6. Migration explicite des anciennes récoltes locales, sans perte ni transfert implicite de données.
7. Tests sur deux navigateurs/appareils, vérification des permissions et conformité aux exigences de protection des données de mineurs.
8. Retirer du site les messages « données synchronisées » tant que les tests ne sont pas passés.

## Sécurité
Ne jamais publier une clé `service_role`, un mot de passe adulte ou une clé secrète dans le dépôt GitHub. Le service de statut ne retourne aucune donnée personnelle. Les anciennes données locales ne sont pas encore migrées.
