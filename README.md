# Projet #2 - Alex YE
## Table of Contents
1. [Tests unitaires du projet 1 Voting](#tests-unitaires-du-projet-1-voting)
2. [Nombre de tests](#nombre-de-tests)
3. [Contenu des tests](#contenu-des-tests)
4. [Comment lancer les tests](#comment-lancer-les-tests)
5. [Resultat des tests](#resultat-des-tests)
6. [Resultat eth-gas-reporter](#resultat-eth-gas-reporter)
7. [Licence](#licence)

-----
<br /> 


## Tests unitaires du projet #1 Voting 

Le fichier Voting.sol est fourni lors de la correction du projet #1.

Les tests ont été classés dans l'ordre d'apparition des fonctions du fichier Voting.sol.

Le fichier des tests se trouvent dans test/Voting.test.js

<br /> 


## Nombre de tests

**40**


<br /> 


## Contenu des tests

### 1. Test de la fonction addVoter (5 tests)

- vérifie si un votant a été ajouté
- vérifie si un event est envoyé lorqu'un votant a été ajouté
- vérifie si on revert bien quand on tente d'ajouter un votant en dehors de la phase d'enregistrement des votants
- vérifie si on revert bien quand on tente d'ajouter un votant déjà ajouté
- vérifie si on revert bien quand on tente d'ajouter un votant depuis une autre addresse que l'owner (16ms)

### 2. Test de la fonction addProposal (5 tests)
- vérifie si on une propostion est bien ajouté
- vérifie si un event est envoyé lorqu'une proposition a été ajoutée
- vérifie si on revert bien quand une propostion ajoutée est vide
- vérifie si on revert bien quand une propostion est ajoutée par un non votant
- vérifie si on revert bien quand on tente d'ajouter une propostion en dehors de la phase d'enregistrement des propositions
    
<br/>
    
    
### 3. Test des getters (5 tests)
#### 3.1 Test de getVoter (3 tests)
- vérifie si on récupère le bon votant avec getVoter
- vérifie si on récupère bien qu'une addresse n'est pas dans les votants
- vérifie si le modifier onlyVoters revert bien si on appelle getVoter depuis une adresse non voter

<br/>


#### 3.2 Test de getOneProposal (2 tests)
- vérifie si on récupère la bonne proposition avec getOneProposal
- vérifie si le modifier onlyVoters revert bien si on appelle getOneProposal depuis une adresse non voter

<br/>

### 4. Test de setVote (5 tests)
- vérifie si un vote a bien été pris en compte
- vérifie si un event est envoyé lorqu'un votant a voté
- vérifie si on revert bien quand un votant tente de voter alors qu'il a déjà voté
- vérifie si on revert bien quand un votant tente de voter une proposition inexistante
- vérifie si on revert bien quand un non votant tente de voter

<br/>


### 5. Test isolé de setVote (1 test)
- vérifie si on revert bien quand on tente de voter en dehors de la session de vote
    
<br/>


### 6. Test des changements de statuts (14 tests)
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


### 7. Test de tallyVotes (4 tests)
- vérifie si le comptage des votes retourne bien l'id de la proposition vaiqueure
- vérifie si le comptage des votes enregistre bien l'id de la proposition 0 qui est vaiqueure en cas d'égalité
- vérifie si un event est envoyé au passage au statut VotesTallied
- vérifie si on est bien au workflowStatus VotesTallied à la fin du décompte des votes

<br/>


### 8. Test isolé de tallyVotes (1 test)
- vérifie si on revert bien quand on tente de compter les votes depuis un workflowStatus non autorisé

## Comment lancer les tests
Prérequis : 
- Installer truffle : npm install -g truffle
- Installer ganache : npm install -g ganache-cli


Ouvrir un terminal :

1. git clone https://github.com/superbooker/projet2.git
2. cd projet2
3. sudo npm install @openzeppelin/contracts --save
4. sudo npm install @openzeppelin/test-helpers --save
5. Lancer ganache : ganache
6. truffle test test/Voting.test.js



## Resultat des tests

Les tests ont était joués dans la version de tag 1.0. Les 40 tests sont passés.
Voici le résultat ci-dessous avec les temps d'exécution.


Contract: Voting

Test de la fonction addVoter
- vérifie si un votant a été ajouté (132ms, 50196 gas)
- vérifie si un event est envoyé lorqu'un votant a été ajouté (47ms, 50196 gas)
- vérifie si on revert bien quand on tente d'ajouter un votant en dehors de la phase d'enregistrement des votants (4174ms, 362021 gas)
- vérifie si on revert bien quand on tente d'ajouter un votant déjà ajouté (811ms, 50196 gas)
- vérifie si on revert bien quand on tente d'ajouter un votant depuis une autre addresse que l'owner (17ms)

Test de la fonction addProposal

- vérifie si on une propostion est bien ajouté (1369ms, 243349 gas)
- vérifie si un event est envoyé lorqu'une proposition a été ajoutée (135ms, 169260 gas)
- vérifie si on revert bien quand une propostion ajoutée est vide (131ms, 47653 gas)
- vérifie si on revert bien quand une propostion est ajoutée par un non votant (142ms, 47653 gas)
- vérifie si on revert bien quand on tente d'ajouter une propostion en dehors de la phase d'enregistrement des propositions (519ms, 139267 gas)


Test des getters

* Test de getVoter


    - vérifie si on récupère le bon votant avec getVoter (613ms, 50196 gas)
    - vérifie si on récupère bien qu'une addresse n'est pas dans les votants (357ms, 50196 gas)
    - vérifie si le modifier onlyVoters revert bien si on appelle getVoter depuis une adresse non voter (111ms, 50196 gas)

* Test de getOneProposal

    - vérifie si on récupère la bonne proposition avec getOneProposal (293ms, 174481 gas)
    - vérifie si le modifier onlyVoters revert bien si on appelle getOneProposal depuis une adresse non voter (223ms, 174481 gas)
    Test de setVote
    - vérifie si un vote a bien été pris en compte (233ms, 78013 gas)
    - vérifie si un event est envoyé lorqu'un votant a voté (50ms, 78013 gas)
    - vérifie si on revert bien quand un votant tente de voter alors qu'il a déjà voté (240ms, 78013 gas)
    - vérifie si on revert bien quand un votant tente de voter une proposition inexistante (78ms)
    - vérifie si on revert bien quand un non votant tente de voter (30ms)

Test isolé de setVote

- vérifie si on revert bien quand on tente de voter en dehors de la session de vote (2375ms, 2552905 gas)

Test des changements de statuts

- vérifie si la 1ere phase est bien RegisteringVoters (20ms)
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis RegisteringVoters (105ms)
- vérifie si un event est envoyé lorqu'on passe au workflowStatus ProposalsRegistrationStarted (46ms, 47653 gas)
- vérifie si on est bien au workflowStatus ProposalsRegistrationStarted (6ms)
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis ProposalsRegistrationStarted (252ms)
- vérifie si un event est envoyé lorqu'on passe au workflowStatus ProposalsRegistrationEnded (226ms, 58798 gas)
- vérifie si on est bien au workflowStatus ProposalsRegistrationEnded (63ms)
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis ProposalsRegistrationEnded (66ms)
- vérifie si un event est envoyé lorqu'on passe au workflowStatus VotingSessionStarted (36ms, 30530 gas)
- vérifie si on est bien au workflowStatus VotingSessionStarted (10ms)
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis VotingSessionStarted (53ms)
- vérifie si un event est envoyé lorqu'on passe au workflowStatus VotingSessionEnded (284ms, 30509 gas)
- vérifie si on est bien au workflowStatus VotingSessionEnded (107ms)
- vérifie si on revert bien quand on tente de passer à un statut interdit depuis VotingSessionEnded (60ms)

Test de tallyVotes

- vérifie si le comptage des votes retourne bien l'id de la proposition vaiqueure (145ms, 94050 gas)
- vérifie si le comptage des votes enregistre bien l'id de la proposition 0 qui est vaiqueure en cas d'égalité (232ms, 115143 gas)
- vérifie si un event est envoyé au passage au statut VotesTallied (129ms, 94050 gas)
- vérifie si on est bien au workflowStatus VotesTallied à la fin du décompte des votes (144ms, 94050 gas)
Test isolé de tallyVotes
- vérifie si on revert bien quand on tente de compter les votes depuis un workflowStatus non autorisé (799ms, 2499259 gas)

## Resultat eth-gas-reporter

![alt text](https://i.postimg.cc/XqpMqfDz/Capture-d-e-cran-2022-06-25-a-18-40-02.png)

## Licence

Le TP2 Alex YE est sous licence
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html).
