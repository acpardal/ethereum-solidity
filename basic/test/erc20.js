const ERC20 = artifacts.require("./ERC20.sol");

contract('Test all ERC20 functions', accounts => {
    const afonso = accounts[0], maria = accounts[1];

    it("Contract with 1 000 000 tokens with 18 decimals", async () => {
        let erc20Instance = await ERC20.deployed();
        let supply = await erc20Instance.totalSupply.call();
        assert.equal(supply.toString(), 10 ** 24, "contract with incorrect number of tokens");
    });

    it("Send 20 tokens", async () => {
        let erc20Instance = await ERC20.deployed();
        await erc20Instance.transfer(maria, web3.toWei(20), {from: afonso});
        let balance = await erc20Instance.balanceOf.call(maria);
        assert.equal(balance.toString(), web3.toWei(20), `Address: ${maria} balance should be 20 tokens`);
    });

    it("Allow another address to retrieve 100 tokens", async () => {
        let erc20Instance = await ERC20.deployed();
        await erc20Instance.approve(maria, web3.toWei(100), {from: afonso});
        let allowance = await erc20Instance.allowance.call(afonso, maria);
        assert.equal(allowance.toString(), web3.toWei(100), `Address: ${maria}, should be allowed to retrieve 100 tokens`);
    });

    it("Retrieve 100 tokens from contract owner", async () => {
        let erc20Instance = await ERC20.deployed();
        await erc20Instance.transferFrom(afonso, maria, web3.toWei(100), {from: maria});
        let balance = await erc20Instance.balanceOf.call(maria);
        assert.equal(balance.toString(), web3.toWei(120), `Address: ${maria} balance should be 120 tokens`);
    });

    it("Transfer mistakenly sent tokens to contract", async () => {
        let erc20Instance = await ERC20.deployed();
        await erc20Instance.transfer(ERC20.address, web3.toWei(20), {from: afonso});
        await erc20Instance.transferAnyERC20Token(ERC20.address, web3.toWei(20), {from: afonso});
        let balance = await erc20Instance.balanceOf.call(afonso);
        assert.equal(balance.toNumber(), web3.toWei(999880), `Address: ${afonso} balance should be 999880 tokens`);
    });

});
