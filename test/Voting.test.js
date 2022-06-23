const { BN, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Voting = artifacts.require('Voting');



contract('Voting', function (accounts) {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const nonVoter = accounts[2];

    let VotingInstance;

    // ::::::::::::: REGISTRATION ::::::::::::: // 
    describe("Test de la fonction addVoter", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
        });

        it('vérifie si un votant a été ajouté', async function () {
            await VotingInstance.addVoter(voter1, {from:owner});

            console.log("Votant1 est enregistré : " + (await VotingInstance.getVoter(voter1, {from:voter1})).isRegistered);

            const _result = (await VotingInstance.getVoter(voter1, {from:voter1})).isRegistered

            expect(_result).to.be.true;
        });

        it("vérifie si un event est envoyé lorqu'un votant a été ajouté", async function () {
            const _resultOfAddVoter = await VotingInstance.addVoter(voter1, {from:owner});

            expectEvent(_resultOfAddVoter, 'VoterRegistered', {voterAddress:voter1});
        });

        it('vérifie si on revert bien quand on tente d\'ajouter un votant en dehors de la phase d\'enregistrement des votants', async function () {
            await VotingInstance.startProposalsRegistering({from:owner});

            //On teste les 3 phases où on ne peut pas ajouter des propositons
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

    // ::::::::::::: PROPOSAL ::::::::::::: // 
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

        it("vérifie si on revert bien quand on tente d'ajouter une propostion en dehors de la phase d'enregistrement des propositions", async function () {
            //On teste les 3 phases où on ne peut pas ajouter des propositons
            await expectRevert(VotingInstance.addProposal("Proposal1", {from:voter1}), "Proposals are not allowed yet");

            await VotingInstance.startProposalsRegistering({from:owner});

            await VotingInstance.endProposalsRegistering({from:owner});

            await expectRevert(VotingInstance.addProposal("Proposal1", {from:voter1}), "Proposals are not allowed yet");

            await VotingInstance.startVotingSession({from:owner});

            await expectRevert(VotingInstance.addProposal("Proposal1", {from:voter1}), "Proposals are not allowed yet");

            await VotingInstance.endVotingSession({from:owner});

            await expectRevert(VotingInstance.addProposal("Proposal1", {from:voter1}), "Proposals are not allowed yet");
        });

        it("vérifie si on revert bien quand une propostion ajoutée est vide", async function () {
        });

        it("vérifie si un event est envoyé lorqu'une proposition a été ajoutée", async function () {
        });

        it("vérifie si on revert bien quand une propostion ajoutée par un non votant", async function () {
        });
    });
    

    // beforeEach(async function () {
    //     VotingInstance = await Voting.new({ from: owner });
    // });


    // ::::::::::::: MODIFIER ::::::::::::: //

    it('vérifie si le modifier onlyVoters revert bien si on appelle une fonction onlyVoters depuis une adresse non voter', async function () {
        await expectRevert(this.VotingInstance.getVoter(voter1, {from:owner}), "You're not a voter");
    });

    // ::::::::::::: GETTERS ::::::::::::: //

    it('vérifie si on récupère la bonne proposition avec getOneProposal', async function () {
    });

    it('vérifie si on récupère bien la bonne proposition depuis avec l\'id', async function () {
    });

    // ::::::::::::: VOTE ::::::::::::: //

    it("vérifie si un vote a bien été pris en compte", async function () {
        
    });

    it("vérifie si on revert bien quand on tente de voter en dehors de la session de vote", async function () {
    });

    it("vérifie si on revert bien quand un votant tente de voter alors qu'il a déjà voté", async function () {
    });

    it("vérifie si on revert bien quand un votant tente de voter une proposition inexistante", async function () {
    });

    it("vérifie si un event est envoyé lorqu'un votant a voté", async function () {
    });


    // ::::::::::::: STATE ::::::::::::: //

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


    // ::::::::::::: TALLYVOTES ::::::::::::: //

    it("vérifie si on revert bien quand on tente de compter les votes depuis un workflowStatus non autorisé", async function () {
    });

    it("vérifie si le comptage des votes enregistre bien l'id de la proposition vaiqueure", async function () {
    });

    it("vérifie si on passe bien au workflowStatus VotesTallied à la fin du décompte des votes", async function () {
    });

    it("vérifie si un event est envoyé à la fin du décompte des votes", async function () {
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


