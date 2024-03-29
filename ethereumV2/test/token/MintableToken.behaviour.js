const BigNumber = web3.BigNumber;

const { ZEPPELIN_LOCATION } = require("../helper.js");
const { assertRevert } = require(ZEPPELIN_LOCATION + 'openzeppelin-contracts/test/helpers/assertRevert');

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeMintableToken ([owner, anotherAccount, minter]) {
  describe('as a basic mintable token', function () {
    describe('after token creation', function () {
      it('sender should be token owner', async function () {
        const tokenOwner = await this.token.owner({ from: owner });
        tokenOwner.should.equal(owner);
      });
    });

    describe('minting finished', function () {
      describe('when the token minting is not finished', function () {
        it('returns false', async function () {
          const mintingFinished = await this.token.mintingFinished();
          assert.equal(mintingFinished, false);
        });
      });

      describe('when the token is minting finished', function () {
        beforeEach(async function () {
          await this.token.finishMinting({ from: owner });
        });

        // finish minting should have no affect in BTCR.
        it('returns false', async function () {
          const mintingFinished = await this.token.mintingFinished();
          assert.equal(mintingFinished, false);
        });
      });
    });

    describe('finish minting', function () {
      describe('when the sender is the token owner', function () {
        const from = owner;

        describe('when the token minting was not finished', function () {
          it('finishes token minting', async function () {
            await this.token.finishMinting({ from });

            // finish minting should have no affect in BTCR.
            const mintingFinished = await this.token.mintingFinished();
            assert.equal(mintingFinished, false);
          });

          // finish minting should have no affect in BTCR.
          it('does not emit a mint finished event', async function () {
            const { logs } = await this.token.finishMinting({ from });

            assert.equal(logs.length, 0);
            //assert.equal(logs[0].event, 'MintFinished');
          });
        });

        describe('when the token minting was already finished', function () {
          beforeEach(async function () {
            await this.token.finishMinting({ from });
          });

          // finish minting should have no affect in BTCR so the below should not revert.
          it('does not revert', async function () {
            await this.token.finishMinting({ from });
          });
        });
      });

      describe('when the sender is not the token owner', function () {
        const from = anotherAccount;

        describe('when the token minting was not finished', function () {
          it('reverts', async function () {
            await assertRevert(this.token.finishMinting({ from }));
          });
        });

        describe('when the token minting was already finished', function () {
          beforeEach(async function () {
            await this.token.finishMinting({ from: owner });
          });

          // finish minting still has the onlyOwner modifier so should revert from non owner. 
          it('revert', async function () {
              await assertRevert(this.token.finishMinting({ from }));
          });
        });
      });
    });

    describe('mint', function () {
      const amount = 100;

      describe('when the sender has the minting permission', function () {
        const from = minter;

        describe('when the token minting is not finished', function () {
          it('mints the requested amount', async function () {
            await this.token.mint(owner, amount, { from });

            const balance = await this.token.balanceOf(owner);
            assert.equal(balance, amount);
          });

          it('emits a mint and a transfer event', async function () {
            const { logs } = await this.token.mint(owner, amount, { from });

            assert.equal(logs.length, 2);
            assert.equal(logs[0].event, 'Mint');
            assert.equal(logs[0].args.to, owner);
            assert.equal(logs[0].args.amount, amount);
            assert.equal(logs[1].event, 'Transfer');
          });
        });

        describe('when the token minting is finished', function () {
          beforeEach(async function () {
            await this.token.finishMinting({ from: owner });
          });

          // finish minting should have no affect in BTCR so the below should not revert.
          it('does not revert', async function () {
            await this.token.mint(owner, amount, { from });
          });
        });
      });

      describe('when the sender has not the minting permission', function () {
        const from = anotherAccount;

        describe('when the token minting is not finished', function () {
          it('reverts', async function () {
            await assertRevert(this.token.mint(owner, amount, { from }));
          });
        });

        describe('when the token minting is already finished', function () {
          beforeEach(async function () {
            await this.token.finishMinting({ from: owner });
          });

          it('reverts', async function () {
            await assertRevert(this.token.mint(owner, amount, { from }));
          });
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeMintableToken,
};
