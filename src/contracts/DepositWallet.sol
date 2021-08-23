pragma solidity ^0.5.0;

import "./PeceiptToken.sol";
import "./TetherToken.sol";

contract DepositWallet {
    // All code goes here...

    string public name = "Deposit Wallet";
    address public owner;
    // saving smart contract types as state variables here
    PeceiptToken public peceiptToken;
    TetherToken public tetherToken;
    

    address[] public stakers;
    // stakingBalance=[address:amount] (similar to)
    mapping(address=>uint) public stakingBalance;
    // hasStaked=[address:True]
    mapping(address=>bool) public hasStaked;
    mapping(address=>bool) public isStaking;


    struct StakerInfo {
        uint256 stakingBalance;
        uint256 stakingTimestamp;
        uint256 stakingBlock;
        bool hasStaked;
        bool isStaking;
        uint256 poolShareRatio;
    }

    struct FarmInfo {
        uint256 blockReward;
        uint256 lastRewardBlock; // Last block number that reward distribution occurs.
        uint256 farmableSupply; // set in init, total amount of tokens farmable
    }



    // constructor(PeceiptToken(type ie smart contract type ie PeceiptToken(sol)) _peceiptToken(address))
    // can just change the contract add of tethertoken here
    constructor(PeceiptToken _peceiptToken, TetherToken _tetherToken) public {
        peceiptToken=_peceiptToken;
        tetherToken=_tetherToken;
        owner=msg.sender;
    }

    // 1. stakes tokens & issues lp tokens
    function stakeTokens(uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        // code goes inside here...

        // Transfer TetherTokens to this contract for staking
        tetherToken.transferFrom(msg.sender, address(this), _amount);

        // update staking balance
        // this is to increment the stakingBalance amount in the array

        stakingBalance[msg.sender]=stakingBalance[msg.sender]+_amount;

        // Add user to stakers array *only if they haven't staked already
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // update staking status
        isStaking[msg.sender]=true;
        hasStaked[msg.sender]=true;


        peceiptToken.transfer(msg.sender, _amount);


    }

    // 2. issuing reward tokens right now logic is that u get 1 for every 1 you stake, no block time basis
    function issueTokens()public{
        // only owner can call this function
        require(msg.sender==owner, "caller must be the owner");

        // issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                tetherToken.transfer(recipient, balance);
            }
        }
    }
    // 3. unstake tokens
    function unstakeTokens(uint _amount) public{
        // fetch staking balance
        uint balance=stakingBalance[msg.sender];
    
        // require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // transfer Mock Tether Tokens  to this contract for staking
        tetherToken.transfer(msg.sender, _amount);
        peceiptToken.transferFrom(msg.sender, address(this), _amount);

        // reset staking balance
        stakingBalance[msg.sender]=stakingBalance[msg.sender]-_amount;

        // Update staking status
        isStaking[msg.sender]=false;
        
    }






    // 4. issuing reward tokens

    // function getPoolTotalBalance() public {
    //     uint256 totalBalance;
    //     for (uint256 i = 0; i < stakers.length; i++) {
    //         address recipient = stakers[i];
    //         uint256 balance = stakerInfo[recipient].stakingBalance;
    //         totalBalance = balance + totalBalance;
    //     }
    //     farmInfo.farmableSupply = totalBalance;
    // }
}