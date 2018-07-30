var ERC20 = artifacts.require("./ERC20.sol");

contract('ERC20', function(accounts) {

  it("should be a contract with 1 000 000 tokens with 18 decimals", function() {
    return ERC20.deployed().then(function(instance) {
      erc20Instance = instance;

      return erc20Instance.totalSupply.call();
    }).then(function(supply) {
      assert.equal(supply.toString(), 10 ** 24, "contract with incorrect number of tokens");
    });
  });

});
