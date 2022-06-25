# Projet #2 - Alex YE
## Table of Contents
1. [Tests unitaires du projet 1 Voting](#tests-unitaires-du-projet-1-voting)
2. [Nombre de tests](#nombre-de-tests)
3. [Installation](#installation)
4. [Collaboration](#collaboration)
5. [FAQs](#faqs)

-----
<br /> 


## Tests unitaires du projet #1 Voting 

Le fichier Voting.sol est fourni lors de la correction du projet #1.

Les tests ont été classé dans l'ordre d'apparition des fonctions du fichier Voting.sol.

<br /> 

-----

## Nombre de tests

**40**


<br /> 

-----

## Contenu des tests

### 1. Test de la fonction addVoter

- vérifie si un votant a été ajouté
- vérifie si un event est envoyé lorqu'un votant a été ajouté
- vérifie si on revert bien quand on tente d'ajouter un votant en dehors de la phase d'enregistrement des votants
- vérifie si on revert bien quand on tente d'ajouter un votant déjà ajouté
- vérifie si on revert bien quand on tente d'ajouter un votant depuis une autre addresse que l'owner (16ms)
Test de la fonction addProposal
- vérifie si on une propostion est bien ajouté
- vérifie si un event est envoyé lorqu'une proposition a été ajoutée
- vérifie si on revert bien quand une propostion ajoutée est vide
- vérifie si on revert bien quand une propostion est ajoutée par un non votant
- vérifie si on revert bien quand on tente d'ajouter une propostion en dehors de la phase d'enregistrement des propositions
    
<br/>
    
    
### 2. Test des getters
#### 2.1 Test de getVoter
- vérifie si on récupère le bon votant avec getVoter
- vérifie si on récupère bien qu'une addresse n'est pas dans les votants
- vérifie si le modifier onlyVoters revert bien si on appelle getVoter depuis une adresse non voter

<br/>


#### 2.2 Test de getOneProposal
- vérifie si on récupère la bonne proposition avec getOneProposal
- vérifie si le modifier onlyVoters revert bien si on appelle getOneProposal depuis une adresse non voter

<br/>

### 3. Test de setVote
- vérifie si un vote a bien été pris en compte
- vérifie si un event est envoyé lorqu'un votant a voté
- vérifie si on revert bien quand un votant tente de voter alors qu'il a déjà voté
- vérifie si on revert bien quand un votant tente de voter une proposition inexistante
- vérifie si on revert bien quand un non votant tente de voter

<br/>


### 4. Test isolé de setVote
- vérifie si on revert bien quand on tente de voter en dehors de la session de vote
    
<br/>


### 5. Test des changements de statuts
- vérifie si la 1ere phase est bien RegisteringVoters
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis RegisteringVoters
- vérifie si un event est envoyé lorqu'on passe au workflowStatus ProposalsRegistrationStarted
- vérifie si on est bien au workflowStatus ProposalsRegistrationStarted
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis ProposalsRegistrationStarted
- vérifie si un event est envoyé lorqu'on passe au workflowStatus ProposalsRegistrationEnded
- vérifie si on est bien au workflowStatus ProposalsRegistrationEnded
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis ProposalsRegistrationEnded
- vérifie si un event est envoyé lorqu'on passe au workflowStatus VotingSessionStarted
- vérifie si on est bien au workflowStatus VotingSessionStarted (40ms)
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis VotingSessionStarted
- vérifie si un event est envoyé lorqu'on passe au workflowStatus VotingSessionEnded
- vérifie si on est bien au workflowStatus VotingSessionEnded (37ms)
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis VotingSessionEnded

<br/>


### 6. Test de tallyVotes
- vérifie si le comptage des votes retourne bien l'id de la proposition vaiqueure
- vérifie si le comptage des votes enregistre bien l'id de la proposition 0 qui est vaiqueure en cas d'égalité
- vérifie si un event est envoyé au passage au statut VotesTallied
- vérifie si on est bien au workflowStatus VotesTallied à la fin du décompte des votes

<br/>


### 7. Test isolé de tallyVotes
- vérifie si on revert bien quand on tente de compter les votes depuis un workflowStatus non autorisé
