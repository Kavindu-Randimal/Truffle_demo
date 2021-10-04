let CrowdFundingWithDeadline = artifacts.require('./CrowdFundingWithDeadline')

contract('CrowdFundingWithDeadline',function(accounts){
    let contract;
    let contractCreater = accounts[0];
    let beneficiary = accounts [1];

    const ONE_ETH = 100000000000000000;

    const ONGOING_STATE = '0';
    const FAILED_STATE = '1';
    const SUCCEEDED_STATE = '2';
    const PAIO_OUT_STATE = '3';

    beforeEach(async function(){
        contract = await CrowdFundingWithDeadline.new(
            'funding',
            1,
            10,
            beneficiary,
            {
                from:contractCreater,
                gas:2000000
            }
        );
    });
    it('contract is initialized', async function(){
        let campaignName = await contract.name.call()
        expect(campaignName).to.equal('funding');

        let targetAmount = await contract.targetAmount.call()
        expect(targetAmount.toNumber()).to.equal(ONE_ETH);

        let actualBeneficiary = await contract.beneficiary.call()
        expect(actualBeneficiary).to.equal(beneficiary);

        let state = await contract.state.call()
        expect(state.valueOf()).to.equal(ONGOING_STATE)

    })

    it('funds are contributed', async function(){
        await contract.contribute({
            value : ONE_ETH,
            from : contractCreater
        });
        
        let contributed = await contract.amounts.call(contractCreater);
        expect(contributed.toNumber()).to.equal(ONE_ETH);

        let totalCollected = await contract.totalCollected.call();
        expect(totalCollected.toNumber()).to.equal(ONE_ETH);
    })
})