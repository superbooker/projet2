const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Voting = artifacts.require('Voting');



contract('Voting', function (accounts) {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    beforeEach(async function () {
        this.VotingInstance = await Voting.new({ from: owner });
    });

    it('vérifie si un votant a été ajouté', async function () {
        const result = await this.VotingInstance.addVoter(voter1, {from:owner})
        console.log((await this.VotingInstance.getVoter(voter1, {from:voter1})).isRegistered);

        expectEvent(result, 'VoterRegistered', {voterAddress:voter1});



        // const _voter1 = (await this.VotingInstance.voters(voter1, {from:voter1})).isRegistered;
        // console.log(_voter1);



        // expect(_voter1).to.equal(true);
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


