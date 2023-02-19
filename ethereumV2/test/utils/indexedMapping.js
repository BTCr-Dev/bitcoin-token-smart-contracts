const BigNumber = web3.BigNumber

const { ZEPPELIN_LOCATION } = require("../helper.js");
const { expectThrow } = require(ZEPPELIN_LOCATION + 'openzeppelin-contracts/test/helpers/expectThrow');

require("chai")
    .use(require("chai-as-promised"))
    .use(require('chai-bignumber')(BigNumber))
    .should()

const IndexedMappingBTCrub = artifacts.require("./mock/IndexedMappingBTCrub.sol");

contract('IndexedMappingBTCrub', function(accounts) {

    beforeEach('setup contract for each test', async () => {
        admin = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
        user3 = accounts[3];
        user4 = accounts[4];
        indexedMappingBTCrub = await IndexedMappingBTCrub.new();
    });

    it("add one address and check it exists.", async function () {
        await indexedMappingBTCrub.add(user1);
        exists = await indexedMappingBTCrub.exists(user1);
        exists.should.equal(true);
    });

    it("add one address and check first value is it.", async function () {
        await indexedMappingBTCrub.add(user1);
        v0 = await indexedMappingBTCrub.getValue(0);
        v0.should.equal(user1);
    });

    it("add one address and check value list.", async function () {
        await indexedMappingBTCrub.add(user1);
        valueList = await indexedMappingBTCrub.getValueList();
        valueList[0].should.equal(user1);
        (valueList.length).should.equal(1);
    });

    it("one add and one remove, check address does not exist.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.remove(user1);
        exists = await indexedMappingBTCrub.exists(user1);
        exists.should.equal(false);
    });

    it("one add and one remove, check reading index 0 reverts.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.remove(user1);
        await expectThrow(indexedMappingBTCrub.getValue(0));
    });

    it("one add and one remove, check value list is empty.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.remove(user1);

        valueList = await indexedMappingBTCrub.getValueList();
        (valueList.length).should.equal(0);
    });

    it("add multiple (3) addreses, check they all exist.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        exists1 = await indexedMappingBTCrub.exists(user1);
        exists2 = await indexedMappingBTCrub.exists(user2);
        exists3 = await indexedMappingBTCrub.exists(user3);

        exists1.should.equal(true);
        exists2.should.equal(true);
        exists3.should.equal(true);
    });

    it("add multiple (3) addreses, check get value for each.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        v0 = await indexedMappingBTCrub.getValue(0);
        v1 = await indexedMappingBTCrub.getValue(1);
        v2 = await indexedMappingBTCrub.getValue(2);

        v0.should.equal(user1);
        v1.should.equal(user2);
        v2.should.equal(user3);
    });

    it("add multiple (3) addreses, check value list.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);
        valueList = await indexedMappingBTCrub.getValueList();

        (valueList.length).should.equal(3);
        valueList[0].should.equal(user1);
        valueList[1].should.equal(user2);
        valueList[2].should.equal(user3);
    });

    it("multiple (3) adds and remove all, check addresses do not exist.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.remove(user2);
        await indexedMappingBTCrub.remove(user3);

        exists1 = await indexedMappingBTCrub.exists(user1);
        exists2 = await indexedMappingBTCrub.exists(user2);
        exists3 = await indexedMappingBTCrub.exists(user3);
        
        exists1.should.equal(false);
        exists2.should.equal(false);
        exists3.should.equal(false);
    });


    it("multiple (3) adds and remove all, check reading index 0 reverts.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.remove(user2);
        await indexedMappingBTCrub.remove(user3);

        await expectThrow(indexedMappingBTCrub.getValue(0));
    });

    it("multiple (3) adds and remove first, check remaining values.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user1);

        valueList = await indexedMappingBTCrub.getValueList();
        (valueList.length).should.equal(2);
        (valueList[0]).should.equal(user3);
        (valueList[1]).should.equal(user2);

        exists1 = await indexedMappingBTCrub.exists(user1);
        exists1.should.equal(false);
        exists2 = await indexedMappingBTCrub.exists(user2);
        exists2.should.equal(true);
        exists3 = await indexedMappingBTCrub.exists(user3);
        exists3.should.equal(true);
        
    });

    it("multiple (3) adds and remove second, check remaining values.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user2);

        valueList = await indexedMappingBTCrub.getValueList();
        (valueList.length).should.equal(2);
        (valueList[0]).should.equal(user1);
        (valueList[1]).should.equal(user3);

        exists1 = await indexedMappingBTCrub.exists(user1);
        exists1.should.equal(true);
        exists2 = await indexedMappingBTCrub.exists(user2);
        exists2.should.equal(false);
        exists3 = await indexedMappingBTCrub.exists(user3);
        exists3.should.equal(true);
    });

    it("multiple (3) adds and remove last, check remaining values.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user3);

        valueList = await indexedMappingBTCrub.getValueList();
        (valueList.length).should.equal(2);
        (valueList[0]).should.equal(user1);
        (valueList[1]).should.equal(user2);

        exists1 = await indexedMappingBTCrub.exists(user1);
        exists1.should.equal(true);
        exists2 = await indexedMappingBTCrub.exists(user2);
        exists2.should.equal(true);
        exists3 = await indexedMappingBTCrub.exists(user3);
        exists3.should.equal(false);
    });

    it("multiple (3) adds and remove all, check value list is empty.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.remove(user2);
        await indexedMappingBTCrub.remove(user3);

        valueList = await indexedMappingBTCrub.getValueList();
        (valueList.length).should.equal(0);
    });

    it("multiple (3) adds and remove some (2), check expected address exist.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.remove(user3);

        exists1 = await indexedMappingBTCrub.exists(user1);
        exists2 = await indexedMappingBTCrub.exists(user2);
        exists3 = await indexedMappingBTCrub.exists(user3);
        
        exists1.should.equal(false);
        exists2.should.equal(true);
        exists3.should.equal(false);
    });


    it("multiple (3) adds and remove some (2), check index 0 and that access index 1 reverts.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.remove(user3);

        v0 = await indexedMappingBTCrub.getValue(0);
        v0.should.equal(user2);

        await expectThrow(indexedMappingBTCrub.getValue(1));
    });

    it("multiple (3) adds and remove some (2), check value list.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.remove(user3);

        valueList = await indexedMappingBTCrub.getValueList();
        (valueList.length).should.equal(1);
        (valueList[0]).should.equal(user2);
    });

    it("add, remove, add and check it exists.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.add(user2);

        exists = await indexedMappingBTCrub.exists(user2);
        exists.should.equal(true);
    });

    it("add, remove, add and check first value is it.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.add(user2);

        v0 = await indexedMappingBTCrub.getValue(0);
        v0.should.equal(user2);
    });

    it("add, remove, add and check value list.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.remove(user1);
        await indexedMappingBTCrub.add(user2);

        valueList = await indexedMappingBTCrub.getValueList();
        valueList[0].should.equal(user2);
        (valueList.length).should.equal(1);
    });

    it("add already existing value, see that getting false and value list is not malformed.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);
        await indexedMappingBTCrub.add(user4);

        added = await indexedMappingBTCrub.add.call(user3);
        await indexedMappingBTCrub.add(user3);
        added.should.equal(false);

        valueList = await indexedMappingBTCrub.getValueList();
        (valueList.length).should.equal(4);
        valueList[0].should.equal(user1);
        valueList[1].should.equal(user2);
        valueList[2].should.equal(user3);
        valueList[3].should.equal(user4);
    });

    it("remove non existing value, see that getting false and value list is not malformed.", async function () {
        await indexedMappingBTCrub.add(user1);
        await indexedMappingBTCrub.add(user2);
        await indexedMappingBTCrub.add(user3);

        removed = await indexedMappingBTCrub.remove.call(user4);
        await indexedMappingBTCrub.remove(user4);

        removed.should.equal(false);

        valueList = await indexedMappingBTCrub.getValueList();
        (valueList.length).should.equal(3);
        valueList[0].should.equal(user1);
        valueList[1].should.equal(user2);
        valueList[2].should.equal(user3);
    });
});
