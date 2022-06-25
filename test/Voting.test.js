console.log("████████ ██████  ██████       █████  ██      ███████ ██   ██     ██    ██ ███████");
console.log("   ██    ██   ██      ██     ██   ██ ██      ██       ██ ██       ██  ██  ██     ");
console.log("   ██    ██████   █████      ███████ ██      █████     ███         ████   █████  ");
console.log("   ██    ██      ██          ██   ██ ██      ██       ██ ██         ██    ██     ");
console.log("   ██    ██      ███████     ██   ██ ███████ ███████ ██   ██        ██    ███████");

const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Voting = artifacts.require('Voting');

contract('Voting', function (accounts) {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const voter4 = accounts[4];
    const nonVoter = accounts[5];

    let VotingInstance;
    let _workflowStatus;

    //______________________________________________________________________________________________
    // ::::::::::::: REGISTRATION ::::::::::::: // 
    //______________________________________________________________________________________________

    describe("Test de la fonction addVoter", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({ from: owner });
        });

        it('vérifie si un votant a été ajouté', async function () {
            await VotingInstance.addVoter(voter1, { from: owner });

            console.log("Votant1 est enregistré : " + (await VotingInstance.getVoter(voter1, { from: voter1 })).isRegistered);

            const _voter = (await VotingInstance.getVoter(voter1, { from: voter1 }))

            expect(_voter.isRegistered).to.be.true;
            expect(_voter.hasVoted).to.be.false;
            expect(new BN(_voter.votedProposalId)).to.bignumber.equal(new BN(0));
        });

        it("vérifie si un event est envoyé lorqu'un votant a été ajouté", async function () {
            const _resultOfAddVoter = await VotingInstance.addVoter(voter1, { from: owner });

            expectEvent(_resultOfAddVoter, 'VoterRegistered', { voterAddress: voter1 });
        });

        it('vérifie si on revert bien quand on tente d\'ajouter un votant en dehors de la phase d\'enregistrement des votants', async function () {
            //On peut bien ajouter ici un votant
            await VotingInstance.addVoter(voter1, { from: owner });

            await VotingInstance.startProposalsRegistering({ from: owner });

            //On teste les 5 phases où on ne peut pas ajouter des votants
            await expectRevert(VotingInstance.addVoter(voter2, { from: owner }), "Voters registration is not open yet");

            await VotingInstance.addProposal("proposal 0", { from: voter1 });

            await VotingInstance.endProposalsRegistering({ from: owner });

            //On teste les 5 phases où on ne peut pas ajouter des votants
            await expectRevert(VotingInstance.addVoter(voter2, { from: owner }), "Voters registration is not open yet");

            await VotingInstance.startVotingSession({ from: owner });

            await VotingInstance.setVote(0, { from: voter1 });

            //On teste les 5 phases où on ne peut pas ajouter des votants
            await expectRevert(VotingInstance.addVoter(voter2, { from: owner }), "Voters registration is not open yet");

            await VotingInstance.endVotingSession({ from: owner });

            //On teste les 5 phases où on ne peut pas ajouter des votants
            await expectRevert(VotingInstance.addVoter(voter2, { from: owner }), "Voters registration is not open yet");

            await VotingInstance.tallyVotes({ from: owner });

            //On teste les 5 phases où on ne peut pas ajouter des votants
            await expectRevert(VotingInstance.addVoter(voter2, { from: owner }), "Voters registration is not open yet");
        });

        it("vérifie si on revert bien quand on tente d'ajouter un votant déjà ajouté", async function () {
            await VotingInstance.addVoter(voter1, { from: owner });

            await expectRevert(VotingInstance.addVoter(voter1, { from: owner }), "Already registered");
        });

        it("vérifie si on revert bien quand on tente d'ajouter un votant depuis une autre addresse que l'owner", async function () {
            await expectRevert(VotingInstance.addVoter(voter1, { from: voter1 }), "Ownable: caller is not the owner");
        });
    });

    //______________________________________________________________________________________________
    // ::::::::::::: PROPOSAL ::::::::::::: // 
    //______________________________________________________________________________________________

    describe("Test de la fonction addProposal", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({ from: owner });
            //On initialise le test par ajouter un votant1
            await VotingInstance.addVoter(voter1, { from: owner });
        });

        it("vérifie si on une propostion est bien ajouté", async function () {
            //On ouvre la phase d'enregistrement des propositions
            await VotingInstance.startProposalsRegistering({ from: owner });

            await VotingInstance.addProposal("Proposal 1", { from: voter1 });
            await VotingInstance.addProposal("Proposal 2", { from: voter1 });
            await VotingInstance.addProposal("Proposal 3", { from: voter1 });

            const _result = (await VotingInstance.getOneProposal(2, { from: voter1 }))

            expect(_result.description).to.equal("Proposal 3");
        });

        it("vérifie si un event est envoyé lorqu'une proposition a été ajoutée", async function () {
            await VotingInstance.startProposalsRegistering({ from: owner });

            const _resultOfAddProposal = await VotingInstance.addProposal(voter1, { from: voter1 });
            expectEvent(_resultOfAddProposal, 'ProposalRegistered', { proposalId: new BN(0) });
        });

        it("vérifie si on revert bien quand une propostion ajoutée est vide", async function () {
            await VotingInstance.startProposalsRegistering({ from: owner });

            await expectRevert(VotingInstance.addProposal("", { from: voter1 }), "Vous ne pouvez pas ne rien proposer");
        });

        it("vérifie si on revert bien quand une propostion est ajoutée par un non votant", async function () {
            await VotingInstance.startProposalsRegistering({ from: owner });

            await expectRevert(VotingInstance.addProposal("Proposal 1", { from: nonVoter }), "You're not a voter");
        });

        it("vérifie si on revert bien quand on tente d'ajouter une propostion en dehors de la phase d'enregistrement des propositions", async function () {
            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", { from: voter1 }), "Proposals are not allowed yet");

            await VotingInstance.startProposalsRegistering({ from: owner });

            //Ici on peut voter donc on ne fait rien

            await VotingInstance.endProposalsRegistering({ from: owner });

            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", { from: voter1 }), "Proposals are not allowed yet");

            await VotingInstance.startVotingSession({ from: owner });

            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", { from: voter1 }), "Proposals are not allowed yet");

            await VotingInstance.endVotingSession({ from: owner });

            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", { from: voter1 }), "Proposals are not allowed yet");
        });

    });

    //______________________________________________________________________________________________    
    // // ::::::::::::: MODIFIER ::::::::::::: //
    //______________________________________________________________________________________________

    // Le modifier est testé dans les fonctions où il est utilisé

    //_______________________________________________________________________________________
    // ::::::::::::: GETTERS ::::::::::::: //
    //______________________________________________________________________________________________

    describe("Test des getters", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({ from: owner });
        });

        context("Test de getVoter", function () {
            it("vérifie si on récupère le bon votant avec getVoter", async function () {
                await VotingInstance.addVoter(voter1, { from: owner });

                const _voter = await VotingInstance.getVoter(voter1, { from: voter1 });

                expect(_voter.isRegistered).to.be.true;
                expect(_voter.hasVoted).to.be.false;
                expect(new BN(_voter.votedProposalId)).to.be.bignumber.equal(new BN(0))

            });

            it("vérifie si on récupère bien qu'une addresse n'est pas dans les votants", async function () {
                await VotingInstance.addVoter(voter1, { from: owner });

                const _nonVoter = await VotingInstance.getVoter(nonVoter, { from: voter1 });

                expect(_nonVoter.isRegistered).to.be.false;
                expect(_nonVoter.hasVoted).to.be.false;
                expect(new BN(_nonVoter.votedProposalId)).to.be.bignumber.equal(new BN(0))
            });

            it('vérifie si le modifier onlyVoters revert bien si on appelle getVoter depuis une adresse non voter', async function () {
                await VotingInstance.addVoter(voter1, { from: owner });

                await expectRevert(VotingInstance.getVoter(voter1, { from: nonVoter }), "You're not a voter");
            });
        });


        context("Test de getOneProposal", function () {
            it("vérifie si on récupère la bonne proposition avec getOneProposal", async function () {
                await VotingInstance.addVoter(voter1, { from: owner });

                await VotingInstance.startProposalsRegistering({ from: owner });

                await VotingInstance.addProposal("Proposal 0", { from: voter1 });

                const _proposal = await VotingInstance.getOneProposal(new BN(0), { from: voter1 });

                expect(_proposal.description).to.equal("Proposal 0");
                expect(new BN(_proposal.voteCount)).to.bignumber.equal(new BN(0))
            });

            it('vérifie si le modifier onlyVoters revert bien si on appelle getOneProposal depuis une adresse non voter', async function () {
                await VotingInstance.addVoter(voter1, { from: owner });
                await VotingInstance.startProposalsRegistering({ from: owner });
                await VotingInstance.addProposal("Proposal 0", { from: voter1 });

                await expectRevert(VotingInstance.getOneProposal(new BN(0), { from: nonVoter }), "You're not a voter");
            });


        });
    });

    //______________________________________________________________________________________________
    // ::::::::::::: VOTE ::::::::::::: //
    //______________________________________________________________________________________________

    describe("Test de setVote", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({ from: owner });
            await VotingInstance.addVoter(voter1, { from: owner });
            await VotingInstance.addVoter(voter2, { from: owner });
            await VotingInstance.startProposalsRegistering({ from: owner });
            await VotingInstance.addProposal("Proposal 1", { from: voter1 });
            await VotingInstance.addProposal("Proposal 2", { from: voter2 });
            await VotingInstance.addProposal("Proposal 3", { from: voter1 });
            await VotingInstance.endProposalsRegistering({ from: owner });
            await VotingInstance.startVotingSession({ from: owner });
        });

        it("vérifie si un vote a bien été pris en compte", async function () {
            //On verifie les conditions avant le vote
            const _proposalBefore = await VotingInstance.getOneProposal(new BN(1), { from: voter1 });

            expect(_proposalBefore.description).to.equal("Proposal 2");
            //Personne a voté pour la proposition 2
            expect(new BN(_proposalBefore.voteCount)).to.bignumber.equal(new BN(0))

            const _voter1Before = await VotingInstance.getVoter(voter1, { from: voter1 });

            expect(_voter1Before.isRegistered).to.be.true;
            //Le votant n'a pas encore voté
            expect(_voter1Before.hasVoted).to.be.false;
            //votedProposalId égale 0 car n'a pas encore voté
            expect(new BN(_voter1Before.votedProposalId)).to.bignumber.equal(new BN(0))

            //Le votant 1 vote
            await VotingInstance.setVote(new BN(1), { from: voter1 });

            //On vérifie la proposition votée
            const _proposalAfter = await VotingInstance.getOneProposal(new BN(1), { from: voter1 });

            expect(_proposalAfter.description).to.equal("Proposal 2");
            //voteCount passe bien à 1
            expect(new BN(_proposalAfter.voteCount)).to.bignumber.equal(new BN(1))

            const _voter1After = await VotingInstance.getVoter(voter1, { from: voter1 });

            expect(_voter1After.isRegistered).to.be.true;
            //Le votant a maintenant voté
            expect(_voter1After.hasVoted).to.be.true;
            //On voit qu'il a bien voté la proposition 1
            expect(new BN(_voter1After.votedProposalId)).to.bignumber.equal(new BN(1))
        });

        it("vérifie si un event est envoyé lorqu'un votant a voté", async function () {
            //Le votant 1 vote
            const _resultOfSetVote = await VotingInstance.setVote(new BN(1), { from: voter1 });

            expectEvent(_resultOfSetVote, 'Voted', { voter: voter1, proposalId: new BN(1) });
        });



        it("vérifie si on revert bien quand un votant tente de voter alors qu'il a déjà voté", async function () {
            await VotingInstance.setVote(new BN(2), { from: voter2 });
            await expectRevert(VotingInstance.setVote(new BN(1), { from: voter2 }), "You have already voted");
        });

        it("vérifie si on revert bien quand un votant tente de voter une proposition inexistante", async function () {
            await expectRevert(VotingInstance.setVote(new BN(10), { from: voter2 }), "Proposal not found");
        });

        it("vérifie si on revert bien quand un non votant tente de voter", async function () {
            await expectRevert(VotingInstance.setVote(new BN(0), { from: nonVoter }), "You're not a voter");
        });
    });

    describe("Test isolé de setVote", function () {
        it("vérifie si on revert bien quand on tente de voter en dehors de la session de vote", async function () {
            VotingInstance = await Voting.new({ from: owner });
            await VotingInstance.addVoter(voter1, { from: owner });

            //On teste les 5 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0), { from: voter1 }), "Voting session havent started yet");


            await VotingInstance.startProposalsRegistering({ from: owner });

            await VotingInstance.addProposal("Proposal 1", { from: voter1 });

            //On teste les 5 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0), { from: voter1 }), "Voting session havent started yet");

            await VotingInstance.endProposalsRegistering({ from: owner });

            //On teste les 5 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0), { from: voter1 }), "Voting session havent started yet");

            await VotingInstance.startVotingSession({ from: owner });

            //Ici on ne teste pas on peut voter
            await VotingInstance.setVote(new BN(0), { from: voter1 });

            await VotingInstance.endVotingSession({ from: owner });

            //On teste les 5 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0), { from: voter1 }), "Voting session havent started yet");

            await VotingInstance.tallyVotes({ from: owner });

            //On teste les 5 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0), { from: voter1 }), "Voting session havent started yet");
        });
    });





    // ______________________________________________________________________________________________
    // ::::::::::::: STATE ::::::::::::: //
    // ______________________________________________________________________________________________

    describe("Test des changements de statuts", function () {
        before(async function () {
            VotingInstance = await Voting.new({ from: owner });
        });

        it("vérifie si la 1ere phase est bien RegisteringVoters", async function () {
            _workflowStatus = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatus)).to.be.bignumber.equal(new BN(0));
        });

        it("vérifie si on revert bien quand on tente de passer à un statut interdit depuis RegisteringVoters", async function () {
            await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), "Registering proposals havent started yet");
            await expectRevert(VotingInstance.startVotingSession({ from: owner }), "Registering proposals phase is not finished");
            await expectRevert(VotingInstance.endVotingSession({ from: owner }), "Voting session havent started yet");

            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");
        });


        it("vérifie si un event est envoyé lorqu'on passe au workflowStatus ProposalsRegistrationStarted", async function () {
            const _resultOfChangestatus = await VotingInstance.startProposalsRegistering({ from: owner });
            expectEvent(_resultOfChangestatus, 'WorkflowStatusChange', { previousStatus: new BN(0), newStatus: new BN(1) });
        });

        it("vérifie si on est bien au workflowStatus ProposalsRegistrationStarted", async function () {
            _workflowStatus = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatus)).to.be.bignumber.equal(new BN(1));
        });

        it("vérifie si on revert bien quand on tente de passer à un statut interdit depuis ProposalsRegistrationStarted", async function () {
            await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), "Registering proposals cant be started now");

            await expectRevert(VotingInstance.startVotingSession({ from: owner }), "Registering proposals phase is not finished");
            await expectRevert(VotingInstance.endVotingSession({ from: owner }), "Voting session havent started yet");

            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");
        });


        it("vérifie si un event est envoyé lorqu'on passe au workflowStatus ProposalsRegistrationEnded", async function () {
            const _resultOfChangestatus = await VotingInstance.endProposalsRegistering({ from: owner });
            expectEvent(_resultOfChangestatus, 'WorkflowStatusChange', { previousStatus: new BN(1), newStatus: new BN(2) });
        });


        it("vérifie si on est bien au workflowStatus ProposalsRegistrationEnded", async function () {
            _workflowStatus = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatus)).to.be.bignumber.equal(new BN(2));
        });

        it("vérifie si on revert bien quand on tente de passer à un statut interdit depuis ProposalsRegistrationEnded", async function () {
            await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), "Registering proposals cant be started now");
            await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), "Registering proposals havent started yet");
            await expectRevert(VotingInstance.endVotingSession({ from: owner }), "Voting session havent started yet");

            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");
        });

        it("vérifie si un event est envoyé lorqu'on passe au workflowStatus VotingSessionStarted", async function () {
            const _resultOfChangestatus = await VotingInstance.startVotingSession({ from: owner });
            expectEvent(_resultOfChangestatus, 'WorkflowStatusChange', { previousStatus: new BN(2), newStatus: new BN(3) });
        });



        it("vérifie si on est bien au workflowStatus VotingSessionStarted", async function () {
            _workflowStatus = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatus)).to.be.bignumber.equal(new BN(3));
        });

        it("vérifie si on revert bien quand on tente de passer à un statut interdit depuis VotingSessionStarted", async function () {
            await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), "Registering proposals cant be started now");
            await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), "Registering proposals havent started yet");
            await expectRevert(VotingInstance.startVotingSession({ from: owner }), "Registering proposals phase is not finished");

            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");
        });

        it("vérifie si un event est envoyé lorqu'on passe au workflowStatus VotingSessionEnded", async function () {
            const _resultOfChangestatus = await VotingInstance.endVotingSession({ from: owner });
            expectEvent(_resultOfChangestatus, 'WorkflowStatusChange', { previousStatus: new BN(3), newStatus: new BN(4) });
        });



        it("vérifie si on est bien au workflowStatus VotingSessionEnded", async function () {
            _workflowStatus = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatus)).to.be.bignumber.equal(new BN(4));
        });

        it("vérifie si on revert bien quand on tente de passer à un statut interdit depuis VotingSessionEnded", async function () {
            await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), "Registering proposals cant be started now");
            await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), "Registering proposals havent started yet");
            await expectRevert(VotingInstance.endVotingSession({ from: owner }), "Voting session havent started yet");
            await expectRevert(VotingInstance.startVotingSession({ from: owner }), "Registering proposals phase is not finished");
        });


        //Le statut VotesTallied est testé dans les tests de la fonction tallyVotes
    });



    //______________________________________________________________________________________________
    // ::::::::::::: TALLYVOTES ::::::::::::: //
    //______________________________________________________________________________________________

    describe("Test de tallyVotes", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({ from: owner });
            await VotingInstance.addVoter(voter1, { from: owner });
            await VotingInstance.addVoter(voter2, { from: owner });
            await VotingInstance.addVoter(voter3, { from: owner });
            await VotingInstance.addVoter(voter4, { from: owner });
            await VotingInstance.startProposalsRegistering({ from: owner });
            await VotingInstance.addProposal("Proposal 0", { from: voter1 });
            await VotingInstance.addProposal("Proposal 1", { from: voter2 });
            await VotingInstance.addProposal("Proposal 2", { from: voter3 });
            await VotingInstance.endProposalsRegistering({ from: owner });
            await VotingInstance.startVotingSession({ from: owner });
            await VotingInstance.setVote(new BN(1), { from: voter1 });
            await VotingInstance.setVote(new BN(1), { from: voter2 });
            await VotingInstance.setVote(new BN(0), { from: voter3 });
        });

        it("vérifie si le comptage des votes retourne bien l'id de la proposition vaiqueure", async function () {
            await VotingInstance.endVotingSession({ from: owner });
            await VotingInstance.tallyVotes({ from: owner });

            const _winningProposalID = await VotingInstance.winningProposalID();

            //La proposition vainqueur est la proposition 1
            expect(new BN(_winningProposalID)).to.be.bignumber.equal(new BN(1));
        });

        it("vérifie si le comptage des votes enregistre bien l'id de la proposition 0 qui est vaiqueure en cas d'égalité", async function () {
            await VotingInstance.setVote(new BN(0), { from: voter4 });
            await VotingInstance.endVotingSession({ from: owner });
            await VotingInstance.tallyVotes({ from: owner });

            const _winningProposalID = await VotingInstance.winningProposalID();

            //La proposition vainqueur devient la proposition 0 car égalité avec la proposition 1 mais comme on prend le 1er du tableau, c'est la proposition 0 qui l'emporte
            expect(new BN(_winningProposalID)).to.be.bignumber.equal(new BN(0));
        });

        it("vérifie si un event est envoyé au passage au statut VotesTallied", async function () {
            await VotingInstance.endVotingSession({ from: owner });
            const _resultOfTallyVotes = await VotingInstance.tallyVotes({ from: owner });

            expectEvent(_resultOfTallyVotes, 'WorkflowStatusChange', { previousStatus: new BN(4), newStatus: new BN(5) });
        });

        it("vérifie si on est bien au workflowStatus VotesTallied à la fin du décompte des votes", async function () {
            //On teste le statut avant la fermeture du vote
            _workflowStatus = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatus)).to.be.bignumber.equal(new BN(3));

            await VotingInstance.endVotingSession({ from: owner });

            //On teste le statut apres la fermeture du vote
            _workflowStatus = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatus)).to.be.bignumber.equal(new BN(4));

            await VotingInstance.tallyVotes({ from: owner });

            //On teste le statut apres le décompte
            _workflowStatus = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatus)).to.be.bignumber.equal(new BN(5));
        });
    });

    describe("Test isolé de tallyVotes", function () {
        it("vérifie si on revert bien quand on tente de compter les votes depuis un workflowStatus non autorisé", async function () {
            VotingInstance = await Voting.new({ from: owner });

            await VotingInstance.addVoter(voter1, { from: owner });

            //On teste les 5 phases où on ne peut pas compter les votes
            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");

            await VotingInstance.startProposalsRegistering({ from: owner });

            //On teste les 5 phases où on ne peut pas compter les votes
            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");

            await VotingInstance.addProposal("Proposal 0", { from: voter1 });

            //On teste les 5 phases où on ne peut pas compter les votes
            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");

            await VotingInstance.endProposalsRegistering({ from: owner });

            //On teste les 5 phases où on ne peut pas compter les votes
            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");

            await VotingInstance.startVotingSession({ from: owner });

            await VotingInstance.setVote(0, { from: voter1 });

            //On teste les 5 phases où on ne peut pas compter les votes
            await expectRevert(VotingInstance.tallyVotes({ from: owner }), "Current status is not voting session ended");

            await VotingInstance.endVotingSession({ from: owner });

            //Ici on peut compter les votes
            await VotingInstance.tallyVotes({ from: owner });
        });
    });
});
