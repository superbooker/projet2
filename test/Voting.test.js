const { BN, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Voting = artifacts.require('Voting');



contract('Voting', function (accounts) {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    beforeEach(async function () {
        this.VotingInstance = await Voting.new({ from: owner });
    });

    // ::::::::::::: MODIFIER ::::::::::::: //

    it('vérifie si le modifier onlyVoters revert bien', async function () {
        await expectRevert(this.VotingInstance.getVoter(voter1, {from:owner}), "You're not a voter");
    });

    // ::::::::::::: GETTERS ::::::::::::: //

    it('vérifie si on récupère la bonne proposition avec getOneProposal', async function () {
    });

    it('vérifie si on récupère bien la bonne proposition depuis avec l\'id', async function () {
    });


    // ::::::::::::: REGISTRATION ::::::::::::: // 

    it('vérifie si un votant a été ajouté', async function () {
        const result = await this.VotingInstance.addVoter(voter1, {from:owner})
        console.log((await this.VotingInstance.getVoter(voter1, {from:voter1})).isRegistered);

        expectEvent(result, 'VoterRegistered', {voterAddress:voter1});



        // const _voter1 = (await this.VotingInstance.voters(voter1, {from:voter1})).isRegistered;
        // console.log(_voter1);



        // expect(_voter1).to.equal(true);
    });

    it('vérifie si on revert bien quand on tente d\'ajouter un votant en dehors de la phase d\'enregistrement des votants', async function () {
    });

    it("vérifie si on revert bien quand on tente d'ajouter un votant déjà ajouté", async function () {
    });

    it("vérifie si un event est envoyé lorqu'un votant a été ajouté", async function () {
    });

    // ::::::::::::: PROPOSAL ::::::::::::: // 

    it("vérifie si on une propostion est bien ajouté", async function () {
    });

    it("vérifie si on revert bien quand on tente d'ajouter une propostion en dehors de la phase d'enregistrement des propositions", async function () {
    });

    it("vérifie si on revert bien quand une propostion ajoutée est vide", async function () {
    });

    it("vérifie si un event est envoyé lorqu'une proposition a été ajoutée", async function () {
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


