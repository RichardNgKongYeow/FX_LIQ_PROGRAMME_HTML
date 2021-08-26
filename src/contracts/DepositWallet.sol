pragma solidity ^0.8.0;
import "./PeceiptToken.sol";
import "./TetherToken.sol";

contract DepositWallet {
    // All code goes here...

    string public name = "Deposit Wallet";
    address public owner;
    // saving smart contract types as state variables here
    PeceiptToken public peceiptToken;
    TetherToken public tetherToken;
    uint256 public constant duration = 20 days;
    uint256 public constant dailyPenaltyRate = 1;

    address[] public stakers;
    // stakingBalance=[address:amount] (similar to)
    // mapping(address=>uint) public stakingBalance;
    // hasStaked=[address:True]
    // mapping(address=>bool) public hasStaked;
    // mapping(address=>bool) public isStaking;
    FarmInfo public farmInfo;
    mapping(address => StakerInfo) public stakerInfo;

    struct StakerInfo {
        uint256 peceiptBalance;
        uint256 stakingTimestamp;
        uint256 stakingBlock;
        bool hasStaked;
        bool isStaking;
        // uint256 poolShareRatio;
    }

    struct FarmInfo {
        uint256 blockReward;
        uint256 lastRewardBlock; // Last block number that reward distribution occurs.
        uint256 tetherSupply; // set in init, total amount of tether staked
        uint256 peceiptInCirculation; // set in init, total amount of tether staked
    }



    // constructor(PeceiptToken(type ie smart contract type ie PeceiptToken(sol)) _peceiptToken(address))
    // can just change the contract add of tethertoken here
    constructor(PeceiptToken _peceiptToken, TetherToken _tetherToken) public {
        peceiptToken=_peceiptToken;
        tetherToken=_tetherToken;
        owner=msg.sender;
    }
//  TODO this model is a one time stake. it should extend out to diff amounts and diff times staked
    // 1. stakes tokens & issues lp tokens
    function stakeTokens(uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        // code goes inside here...
        
        stakerInfo[msg.sender].stakingTimestamp = block.timestamp;
        // Transfer TetherTokens to this contract for staking
        tetherToken.transferFrom(msg.sender, address(this), _amount);

        // Add user to stakers array *only if they haven't staked already
        if(!stakerInfo[msg.sender].hasStaked){
            stakers.push(msg.sender);
        }

        // update staking status
        stakerInfo[msg.sender].isStaking = true;
        stakerInfo[msg.sender].hasStaked = true;
        
        
        uint shareofpool;
        // starting the pool
        if (farmInfo.peceiptInCirculation==0){
            shareofpool=_amount;
        }
        else{
            uint totalpeceipt=farmInfo.peceiptInCirculation;
            uint totaltether=farmInfo.tetherSupply;
            shareofpool=_amount*totalpeceipt/totaltether;
        }
            


        // update perceiptincirculation and tethersupply
        farmInfo.tetherSupply +=_amount;

        // uint256 shareofpool=_amount*(_amount/(_amount+farmInfo.tetherSupply));
        farmInfo.peceiptInCirculation +=shareofpool;
        

        peceiptToken.transfer(msg.sender, shareofpool);

        // update staking balance
        // this is to increment the stakingBalance amount in the array

        stakerInfo[msg.sender].peceiptBalance=stakerInfo[msg.sender].peceiptBalance+shareofpool;

    }
    // TODO have to burn LP tokens for the pool if they are 0
    // have to change this issuetokens

    // 2. issuing reward tokens right now logic is that u get 1 for every 1 you stake, no block time basis
    function issueTokens()public{
        // only owner can call this function
        require(msg.sender==owner, "caller must be the owner");

        // issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakerInfo[recipient].peceiptBalance;
            if(balance > 0){
                peceiptToken.transfer(recipient, balance);
            }
        }
    }
    // 3. unstake tokens
    function unstakeTokens(uint _amount) public{
        // fetch staking balance
        uint balance=stakerInfo[msg.sender].peceiptBalance;
    
        // require amount greater than 0
        require(balance > 0, "Receipt Token balance cannot be 0");
        uint256 end = stakerInfo[msg.sender].stakingTimestamp + duration;
        require(block.timestamp >= end, "too early to withdraw Tokens");
        uint totalpeceipt=farmInfo.peceiptInCirculation;
        uint totaltether=farmInfo.tetherSupply;
        uint256 shareofpool=_amount*totaltether/totalpeceipt;
        // transfer Mock Tether Tokens  to this contract for staking
        
        peceiptToken.transferFrom(msg.sender, address(this), _amount);
        tetherToken.transfer(msg.sender, shareofpool);
        // reset staking balance
        stakerInfo[msg.sender].peceiptBalance=stakerInfo[msg.sender].peceiptBalance-_amount;

        // Update staking status
        if (stakerInfo[msg.sender].peceiptBalance==0){
            stakerInfo[msg.sender].isStaking=false;
        } else {
            stakerInfo[msg.sender].isStaking=true;
        }

        // update pool info
        farmInfo.tetherSupply -=shareofpool;
        farmInfo.peceiptInCirculation -=_amount;
        
    }
    function withdrawTether (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        tetherToken.transfer(msg.sender, _amount);
        farmInfo.tetherSupply -=_amount;
    }

    // TODO take this out
    function addTether (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        tetherToken.transferFrom(msg.sender,address(this), _amount);
        farmInfo.tetherSupply +=_amount;
    }


    function unstakeTokensWithPenalty(uint _amount) public {
        uint256 balance = stakerInfo[msg.sender].peceiptBalance;
        require(balance > 0, "Receipt Token cannot be 0");
        peceiptToken.transferFrom(msg.sender, address(this), _amount); //return lpx token
        
        // stopped here
        uint256 timedifference=duration-(block.timestamp-stakerInfo[msg.sender].stakingTimestamp);
        uint256 penalty=(timedifference*dailyPenaltyRate)/86400;

        uint totalpeceipt=farmInfo.peceiptInCirculation;
        uint totaltether=farmInfo.tetherSupply;
        uint256 shareofpool=_amount*totaltether/totalpeceipt;
        uint256 withdrawableAmt=shareofpool*(100-penalty)/100;

        

        tetherToken.transfer(msg.sender, withdrawableAmt); // Unstake x token



        // reset staking balance
        stakerInfo[msg.sender].peceiptBalance=stakerInfo[msg.sender].peceiptBalance-_amount;

        // Update staking status
        if (stakerInfo[msg.sender].peceiptBalance==0){
            stakerInfo[msg.sender].isStaking=false;
        } else {
            stakerInfo[msg.sender].isStaking=true;
        }

        // update pool info
        farmInfo.tetherSupply -=withdrawableAmt;
        farmInfo.peceiptInCirculation -=_amount;

        // getPoolShareRatio();
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