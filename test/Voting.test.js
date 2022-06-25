const { BN, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
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

    //______________________________________________________________________________________________
    // ::::::::::::: REGISTRATION ::::::::::::: // 
    //______________________________________________________________________________________________

    describe("Test de la fonction addVoter", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
        });

        it('vérifie si un votant a été ajouté', async function () {
            await VotingInstance.addVoter(voter1, {from:owner});

            console.log("Votant1 est enregistré : " + (await VotingInstance.getVoter(voter1, {from:voter1})).isRegistered);

            const _voter = (await VotingInstance.getVoter(voter1, {from:voter1}))

            expect(_voter.isRegistered).to.be.true;
            expect(_voter.hasVoted).to.be.false;
            expect(new BN(_voter.votedProposalId)).to.bignumber.equal(new BN(0))
        });

        it("vérifie si un event est envoyé lorqu'un votant a été ajouté", async function () {
            const _resultOfAddVoter = await VotingInstance.addVoter(voter1, {from:owner});

            expectEvent(_resultOfAddVoter, 'VoterRegistered', {voterAddress:voter1});
        });

        it('vérifie si on revert bien quand on tente d\'ajouter un votant en dehors de la phase d\'enregistrement des votants', async function () {
            await VotingInstance.startProposalsRegistering({from:owner});

            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addVoter(voter1, {from:owner}), "Voters registration is not open yet");

            await VotingInstance.endProposalsRegistering({from:owner});
        
            await expectRevert(VotingInstance.addVoter(voter1, {from:owner}), "Voters registration is not open yet");

            await VotingInstance.startVotingSession({from:owner});
        
            await expectRevert(VotingInstance.addVoter(voter1, {from:owner}), "Voters registration is not open yet");

            await VotingInstance.endVotingSession({from:owner}); 
            
            await expectRevert(VotingInstance.addVoter(voter1, {from:owner}), "Voters registration is not open yet");
        });

        it("vérifie si on revert bien quand on tente d'ajouter un votant déjà ajouté", async function () {
            await VotingInstance.addVoter(voter1, {from:owner});

            await expectRevert(VotingInstance.addVoter(voter1, {from:owner}), "Already registered");
        });

        it("vérifie si on revert bien quand on tente d'ajouter un votant depuis une autre addresse que l'owner", async function () {
            await expectRevert(VotingInstance.addVoter(voter1, {from:voter1}), "Ownable: caller is not the owner");
        });
    });

    //______________________________________________________________________________________________
    // ::::::::::::: PROPOSAL ::::::::::::: // 
    //______________________________________________________________________________________________

    describe("Test de la fonction addProposal", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
            //On initialise le test par ajouter un votant1
            await VotingInstance.addVoter(voter1, {from:owner});
        });

        it("vérifie si on une propostion est bien ajouté", async function () {
            //On ouvre la phase d'enregistrement des propositions
            await VotingInstance.startProposalsRegistering({from:owner});

            await VotingInstance.addProposal("Proposal 1",{from:voter1});
            await VotingInstance.addProposal("Proposal 2",{from:voter1});
            await VotingInstance.addProposal("Proposal 3",{from:voter1});

            const _result = (await VotingInstance.getOneProposal(2, {from:voter1}))

            expect(_result.description).to.equal("Proposal 3");
        });

        it("vérifie si un event est envoyé lorqu'une proposition a été ajoutée", async function () {
            await VotingInstance.startProposalsRegistering({from:owner});

            const _resultOfAddProposal = await VotingInstance.addProposal(voter1, {from:voter1});
            expectEvent(_resultOfAddProposal, 'ProposalRegistered', {proposalId:new BN(0)});
        });

        it("vérifie si on revert bien quand une propostion ajoutée est vide", async function () {
            await VotingInstance.startProposalsRegistering({from:owner});

            await expectRevert(VotingInstance.addProposal("", {from:voter1}), "Vous ne pouvez pas ne rien proposer");
        });

        it("vérifie si on revert bien quand une propostion est ajoutée par un non votant", async function () {
            await VotingInstance.startProposalsRegistering({from:owner});

            await expectRevert(VotingInstance.addProposal("Proposal 1", {from:nonVoter}), "You're not a voter");
        });

        it("vérifie si on revert bien quand on tente d'ajouter une propostion en dehors de la phase d'enregistrement des propositions", async function () {
            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", {from:voter1}), "Proposals are not allowed yet");

            await VotingInstance.startProposalsRegistering({from:owner});

            //Ici on peut voter donc on ne fait rien

            await VotingInstance.endProposalsRegistering({from:owner});

            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", {from:voter1}), "Proposals are not allowed yet");

            await VotingInstance.startVotingSession({from:owner});

            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", {from:voter1}), "Proposals are not allowed yet");

            await VotingInstance.endVotingSession({from:owner});

            //On teste les 4 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", {from:voter1}), "Proposals are not allowed yet");
        });

    });

    //______________________________________________________________________________________________    
    // // ::::::::::::: MODIFIER ::::::::::::: //
    //______________________________________________________________________________________________

    // describe("Test de la fonction addProposal", function () {
    //     it('vérifie si le modifier onlyVoters revert bien si on appelle une fonction onlyVoters depuis une adresse non voter', async function () {
    //         VotingInstance = await Voting.new({from:owner});
    //         await expectRevert(VotingInstance.getVoter(voter1, {from:owner}), "You're not a voter");
    //     });
    // });

    //_______________________________________________________________________________________
    // ::::::::::::: GETTERS ::::::::::::: //
    //______________________________________________________________________________________________

    describe("Test des getters", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
        });

        context("Test de getVoter", function () {
            it("vérifie si on récupère le bon votant avec getVoter", async function () {
                await VotingInstance.addVoter(voter1, {from:owner});

                const _voter = await VotingInstance.getVoter(voter1, {from:voter1});

                expect(_voter.isRegistered).to.be.true;
                expect(_voter.hasVoted).to.be.false;
                expect(new BN(_voter.votedProposalId)).to.bignumber.equal(new BN(0))

            });

            it("vérifie si on récupère bien qu'une addresse n'est pas dans les votants", async function () {
                await VotingInstance.addVoter(voter1, {from:owner});

                const _nonVoter = await VotingInstance.getVoter(nonVoter, {from:voter1});

                expect(_nonVoter.isRegistered).to.be.false;
                expect(_nonVoter.hasVoted).to.be.false;
                expect(new BN(_nonVoter.votedProposalId)).to.bignumber.equal(new BN(0))
            });
        });


        context("Test de getOneProposal", function () {
            it("vérifie si on récupère la bonne proposition avec getOneProposal", async function () {
                await VotingInstance.addVoter(voter1, {from:owner});
                
                await VotingInstance.startProposalsRegistering({from:owner});

                await VotingInstance.addProposal("Proposal 1",{from:voter1});

                const _proposal = await VotingInstance.getOneProposal(new BN(0), {from:voter1});

                expect(_proposal.description).to.equal("Proposal 1");
                expect(new BN(_proposal.voteCount)).to.bignumber.equal(new BN(0))
            });
    
        });
    });

    //______________________________________________________________________________________________
    // ::::::::::::: VOTE ::::::::::::: //
    //______________________________________________________________________________________________

    describe("Test de setVote", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
            await VotingInstance.addVoter(voter1, {from:owner});
            await VotingInstance.addVoter(voter2, {from:owner});
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.addProposal("Proposal 1",{from:voter1});
            await VotingInstance.addProposal("Proposal 2",{from:voter2});
            await VotingInstance.addProposal("Proposal 3",{from:voter1});
            await VotingInstance.endProposalsRegistering({from:owner});
            await VotingInstance.startVotingSession({from:owner});
        });

        it("vérifie si un vote a bien été pris en compte", async function () {
            //On verifie les conditions avant le vote
            const _proposalBefore = await VotingInstance.getOneProposal(new BN(1), {from:voter1});

            expect(_proposalBefore.description).to.equal("Proposal 2");
            //Personne a voté pour la proposition 2
            expect(new BN(_proposalBefore.voteCount)).to.bignumber.equal(new BN(0))

            const _voter1Before = await VotingInstance.getVoter(voter1, {from:voter1});

            expect(_voter1Before.isRegistered).to.be.true;
            //Le votant n'a pas encore voté
            expect(_voter1Before.hasVoted).to.be.false;
            //votedProposalId égale 0 car n'a pas encore voté
            expect(new BN(_voter1Before.votedProposalId)).to.bignumber.equal(new BN(0))

            //Le votant 1 vote
            await VotingInstance.setVote(new BN(1),{from:voter1});

            //On vérifie la proposition votée
            const _proposalAfter = await VotingInstance.getOneProposal(new BN(1), {from:voter1});

            expect(_proposalAfter.description).to.equal("Proposal 2");
            //voteCount passe bien à 1
            expect(new BN(_proposalAfter.voteCount)).to.bignumber.equal(new BN(1))

            const _voter1After = await VotingInstance.getVoter(voter1, {from:voter1});

            expect(_voter1After.isRegistered).to.be.true;
            //Le votant a maintenant voté
            expect(_voter1After.hasVoted).to.be.true;
            //On voit qu'il a bien voté la proposition 1
            expect(new BN(_voter1After.votedProposalId)).to.bignumber.equal(new BN(1))
        });

        it("vérifie si un event est envoyé lorqu'un votant a voté", async function () {
            //Le votant 1 vote
            const _resultOfSetVote = await VotingInstance.setVote(new BN(1),{from:voter1});

            expectEvent(_resultOfSetVote, 'Voted', {voter: voter1, proposalId: new BN(1)});
        });



        it("vérifie si on revert bien quand un votant tente de voter alors qu'il a déjà voté", async function () {
            await VotingInstance.setVote(new BN(2),{from:voter2});
            await expectRevert(VotingInstance.setVote(new BN(1),{from:voter2}), "You have already voted");
        });

        it("vérifie si on revert bien quand un votant tente de voter une proposition inexistante", async function () {
            await expectRevert(VotingInstance.setVote(new BN(10),{from:voter2}), "Proposal not found");
        });

        it("vérifie si on revert bien quand un non votant tente de voter", async function () {
            await expectRevert(VotingInstance.setVote(new BN(0),{from:nonVoter}), "You're not a voter");
        });
    });

    describe("Test isolé de setVote", function () {
        it("vérifie si on revert bien quand on tente de voter en dehors de la session de vote", async function () {
            VotingInstance = await Voting.new({from:owner});
            await VotingInstance.addVoter(voter1, {from:owner});

            //On teste les 4 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0),{from:voter1}), "Voting session havent started yet");
            

            await VotingInstance.startProposalsRegistering({from:owner});

            //On teste les 4 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0),{from:voter1}), "Voting session havent started yet");

            await VotingInstance.addProposal("Proposal 1",{from:voter1});

            //On teste les 4 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0),{from:voter1}), "Voting session havent started yet");

            await VotingInstance.endProposalsRegistering({from:owner});

            //On teste les 4 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0),{from:voter1}), "Voting session havent started yet");

            await VotingInstance.startVotingSession({from:owner});

            //Ici on ne fait rien car on peut voter

            await VotingInstance.endVotingSession({from:owner});

            //On teste les 4 phases où on ne peut pas voter
            await expectRevert(VotingInstance.setVote(new BN(0),{from:voter1}), "Voting session havent started yet");
        });         
    });





    //______________________________________________________________________________________________
    // ::::::::::::: STATE ::::::::::::: //
    //______________________________________________________________________________________________

    it("vérifie si le 1er état est bien RegisteringVoters", async function () {
        
    });


    it("vérifie si on passe bien au workflowStatus RegisteringVoters", async function () {
        
    });

    it("vérifie si un event est envoyé lorqu'on passe au workflowStatus RegisteringVoters", async function () {
    });

    it("vérifie si on revert bien quand on tente de passer au workflowStatus RegisteringVoters depuis un status non autorisé", async function () {
    });




    it("vérifie si on passe bien au workflowStatus ProposalsRegistrationStarted", async function () {
        
    });

    it("vérifie si un event est envoyé lorqu'on passe au workflowStatus ProposalsRegistrationStarted", async function () {
    });

    it("vérifie si on revert bien quand on tente de passer au workflowStatus ProposalsRegistrationStarted depuis un status non autorisé", async function () {
    });





    it("vérifie si on passe bien au workflowStatus ProposalsRegistrationEnded", async function () {
        
    });

    it("vérifie si un event est envoyé lorqu'on passe au workflowStatus ProposalsRegistrationEnded", async function () {
    });

    it("vérifie si on revert bien quand on tente de passer au workflowStatus ProposalsRegistrationEnded depuis un status non autorisé", async function () {
    });





    it("vérifie si on passe bien au workflowStatus VotingSessionStarted", async function () {
        
    });

    it("vérifie si un event est envoyé lorqu'on passe au workflowStatus VotingSessionStarted", async function () {
    });

    it("vérifie si on revert bien quand on tente de passer au workflowStatus VotingSessionStarted depuis un status non autorisé", async function () {
    });


    //______________________________________________________________________________________________
    // ::::::::::::: TALLYVOTES ::::::::::::: //
    //______________________________________________________________________________________________

    describe.only("Test de tallyVotes", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
            await VotingInstance.addVoter(voter1, {from:owner});
            await VotingInstance.addVoter(voter2, {from:owner});
            await VotingInstance.addVoter(voter3, {from:owner});
            await VotingInstance.addVoter(voter4, {from:owner});
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.addProposal("Proposal 0",{from:voter1});
            await VotingInstance.addProposal("Proposal 1",{from:voter2});
            await VotingInstance.addProposal("Proposal 2",{from:voter3});
            await VotingInstance.endProposalsRegistering({from:owner});
            await VotingInstance.startVotingSession({from:owner});
            await VotingInstance.setVote(new BN(1),{from:voter1});
            await VotingInstance.setVote(new BN(1),{from:voter2});
            await VotingInstance.setVote(new BN(0),{from:voter3});
        });

        it("vérifie si le comptage des votes enregistre bien l'id de la proposition vaiqueure", async function () {
            await VotingInstance.endVotingSession({from:owner});
            await VotingInstance.tallyVotes({from:owner});
        
            const _winningProposalID = await VotingInstance.winningProposalID();
    
            //La proposition vainqueur est la proposition 1
            expect(new BN(_winningProposalID)).to.be.bignumber.equal(new BN(1));
        });
    
        it("vérifie si le comptage des votes enregistre bien l'id de la proposition 0 qui est vaiqueure en cas d'égalité", async function () {
            await VotingInstance.setVote(new BN(0),{from:voter4});
            await VotingInstance.endVotingSession({from:owner});
        
            const _winningProposalID = await VotingInstance.winningProposalID();
    
            //La proposition vainqueur devient la proposition 0
            expect(new BN(_winningProposalID)).to.be.bignumber.equal(new BN(0));
        });

        it("vérifie si un event est envoyé au passage au statut VotesTallied", async function () {
             await VotingInstance.endVotingSession({from:owner});
             const _resultOfTallyVotes = await VotingInstance.tallyVotes({from:owner});


            expectEvent(_resultOfTallyVotes, 'WorkflowStatusChange', {previousStatus: new BN(4), newStatus: new BN(5)});

        });

        it("vérifie si on passe bien au workflowStatus VotesTallied à la fin du décompte des votes", async function () {
            const _workflowStatusBefore = await VotingInstance.workflowStatus();
            expect(new BN(_workflowStatusBefore)).to.bignumber.equal(new BN(4));
            
            await VotingInstance.endVotingSession({from:owner});
            await VotingInstance.tallyVotes({from:owner});

            const _workflowStatus = await VotingInstance.workflowStatus();

            expect(new BN(_workflowStatus)).to.bignumber.equal(new BN(5));
        });
    
        it("vérifie si on revert bien quand on tente de compter les votes depuis un workflowStatus non autorisé", async function () {
            
        });
    });







    // await VotingInstance.startProposalsRegistering({from:owner});

    // await VotingInstance.endProposalsRegistering({from:owner});


    // await VotingInstance.startVotingSession({from:owner});


    // await VotingInstance.endVotingSession({from:owner});




    // it('a un symbole', async function () {
    //     expect(await this.VotingInstance.symbol()).to.equal(_symbol);
    // });
    // it('a une valeur décimal', async function () {
    //     expect(await this.VotingInstance.decimals()).to.be.bignumber.equal(_decimals);
    // });
    // it('vérifie la balance du propriétaire du contrat', async function () {
    //     let balanceOwner = await this.VotingInstance.balanceOf(owner);
    //     let totalSupply = await this.VotingInstance.totalSupply();
    //     expect(balanceOwner).to.be.bignumber.equal(totalSupply);
    // });
    // it('vérifie si un transfer est bien effectué', async function () {
    //     let balanceOwnerBeforeTransfer = await this.VotingInstance.balanceOf(owner);
    //     let balanceRecipientBeforeTransfer = await this.VotingInstance.balanceOf(recipient);
    //     let amount = new BN(10);

    //     await this.VotingInstance.transfer(recipient, amount, { from: owner });
    //     let balanceOwnerAfterTransfer = await this.VotingInstance.balanceOf(owner);
    //     let balanceRecipientAfterTransfer = await this.VotingInstance.balanceOf(recipient);

    //     expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
    //     expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
    // });

    
    // it('vérifie si un approve est bien effectué', async function () {
    //     //Autorisation donnée du owner au spender avant approve
    //     let allowedSpenderBeforeApprove = await this.VotingInstance.allowance(owner,spender);
    //     let amount = new BN(10);

    //     //approve du owner au spender de 10 wei
    //     await this.VotingInstance.approve(spender, amount, { from: owner });

    //     //Autorisation donnée du owner au spender après approve
    //     let allowedSpenderAfterApprove = await this.VotingInstance.allowance(owner,spender);
        
    //     //L'autorisation après approve doit etre égale à avant + 10
    //     expect(allowedSpenderAfterApprove).to.be.bignumber.equal(allowedSpenderBeforeApprove.add(amount));
    // });
    

    // it('vérifie si un transferFrom est bien effectué', async function () {
    //     //Balance du owner avant transfert
    //     let balanceOwnerBeforeTransfer = await this.VotingInstance.balanceOf(owner);
    //     //Balance du destinataire avant transfert
    //     let balanceRecipientBeforeTransfer = await this.VotingInstance.balanceOf(recipient);

    //     //Autorisation donnée du owner au spender avant approve
    //     let allowedSpenderBeforeApprove = await this.VotingInstance.allowance(owner, spender);

    //     let amount = new BN(10);

    //     //approve du owner au spender de 10 wei
    //     await this.VotingInstance.approve(spender, amount, { from: owner });

    //     //Autorisation donnée du owner au spender apres approve
    //     let allowedSpenderAfterApprove = await this.VotingInstance.allowance(owner,spender);
    //     //L'autorisation après approve doit etre égale à avant + 10
    //     expect(allowedSpenderAfterApprove).to.be.bignumber.equal(allowedSpenderBeforeApprove.add(amount));

    //     //Tranfert du owner vers le recipient réalisé par le spender
    //     await this.VotingInstance.transferFrom(owner, recipient, amount, { from: spender });

    //     //balance du owner apres tranfert
    //     let balanceOwnerAfterTransfer = await this.VotingInstance.balanceOf(owner);

    //     //balance du récipient apres transfert
    //     let balanceRecipientAfterTransfer = await this.VotingInstance.balanceOf(recipient);

    //     //Balance du owner apres tranfert doit etre égale à balance avant - 10 
    //     expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));

    //     //Balance du recipient apres tranfert doit etre égale à balance avant + 10 
    //     expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));

    //     //L'autorisation donnée du owner au spender après tranfert doit etre égale à apres approve - 10
    //     let allowedSpenderAfterTransferFrom = await this.VotingInstance.allowance(owner,spender);
    //     expect(allowedSpenderAfterTransferFrom).to.be.bignumber.equal(allowedSpenderAfterApprove.sub(amount));
    // });

});


