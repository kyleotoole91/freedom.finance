const { assert } = require('chai');
const Token = artifacts.require('Token');
const FreedomFinance = artifacts.require('FreedomFinance');

require('chai')
  .use(require('chai-as-promised'))
  .should();

function freedomFinanceTokens(n){
  return web3.utils.toWei(n, 'ether');

}

contract('Freedom.Finance', ([deployer, investor]) => {
  let token, freedomFinance;
   
  before(async () => {
    token = await Token.new();
    freedomFinance = await FreedomFinance.new(token.address);   
    //transfer all tokens to Freedom.Finance Exchange (1 million, 18 decimal places)
    await token.transfer(freedomFinance.address, freedomFinanceTokens('1000000'));
  });

  describe('Freedom.Finance deployment', async () => {
    it('contract has a name', async () => {
      const name = await freedomFinance.name();
      assert.equal(name, 'Freedom.Finance');
    });
  });

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name();
      assert.equal(name, 'Freedom.Finance Token');
    });

    it('contract has a tokens', async () => {
      let balance = await token.balanceOf(freedomFinance.address);
      assert.equal(balance.toString(), freedomFinanceTokens('1000000'));
    });
  });

  describe('buyTokens()', async () => {
    let result;
    
    before(async () => {
      //first buy 1 Freedom.Finance token 
      result = await freedomFinance.buyTokens({from: investor, 
                                               value: web3.utils.toWei('.01', 'ether')});  
    });

    it('Purchase 1 token with .01 Ether', async () => {
      //check investor balance
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), freedomFinanceTokens('1'));  
      //check Freedom.Finance balance token balance went down
      let freedomFinanceBalance;
      freedomFinanceBalance = await token.balanceOf(freedomFinance.address);   
      assert.equal(freedomFinanceBalance.toString(), freedomFinanceTokens('999999')); 
      //check Freedom.Finance balance ether balance went up
      freedomFinanceBalance = await web3.eth.getBalance(freedomFinance.address);
      assert.equal(freedomFinanceBalance.toString(), web3.utils.toWei('.01', 'Ether')); 
      // check event TokenPurchased() data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), freedomFinanceTokens('1').toString());
      assert.equal(event.rate.toString(), '100');
    });

  });

  describe('sellTokens()', async () => {
    let result;
    
    before(async () => {
      //investor must approve tokens before the sale
      await token.approve(freedomFinance.address, freedomFinanceTokens('1'), {from: investor});
      //insestor sells the tokens
      result = await freedomFinance.sellTokens(freedomFinanceTokens('1'), {from: investor});  
    });

    it('Sell 1 token for .01 Ether', async () => {
      //check investor balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), freedomFinanceTokens('0'));
      
      let freedomFinanceBalance;
      freedomFinanceBalance = await token.balanceOf(freedomFinance.address);   
      assert.equal(freedomFinanceBalance.toString(), freedomFinanceTokens('1000000')); 
      //check Freedom.Finance balance ether balance went up
      freedomFinanceBalance = await web3.eth.getBalance(freedomFinance.address);
      assert.equal(freedomFinanceBalance.toString(), web3.utils.toWei('0', 'Ether')); 
      
    });

  });
});