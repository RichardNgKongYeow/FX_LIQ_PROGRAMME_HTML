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
    

    address[] public stakers;
    // stakingBalance=[address:amount] (similar to)
    mapping(address=>uint) public stakingBalance;
    // hasStaked=[address:True]
    mapping(address=>bool) public hasStaked;
    mapping(address=>bool) public isStaking;
    FarmInfo public farmInfo;

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
        uint shareofpool;
        if (farmInfo.peceiptInCirculation==0 && farmInfo.tetherSupply==0){
            shareofpool=_amount;
        } else{
            uint totalpeceipt=farmInfo.peceiptInCirculation;
            uint totaltether=farmInfo.tetherSupply;
            shareofpool=_amount*totalpeceipt/totaltether;
        }
            


        // update perceiptincirculation and tethersupply
        farmInfo.tetherSupply +=_amount;

        // uint256 shareofpool=_amount*(_amount/(_amount+farmInfo.tetherSupply));
        farmInfo.peceiptInCirculation +=_amount;
        

        peceiptToken.transfer(msg.sender, shareofpool);


    }
    // TODO have to burn LP tokens for the pool if they are 0

    // 2. issuing reward tokens right now logic is that u get 1 for every 1 you stake, no block time basis
    function issueTokens()public{
        // only owner can call this function
        require(msg.sender==owner, "caller must be the owner");

        // issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                peceiptToken.transfer(recipient, balance);
            }
        }
    }
    // 3. unstake tokens
    function unstakeTokens(uint _amount) public{
        // fetch staking balance
        uint balance=stakingBalance[msg.sender];
    
        // require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");
        uint totalpeceipt=farmInfo.peceiptInCirculation;
        uint totaltether=farmInfo.tetherSupply;
        uint256 shareofpool=_amount*totaltether/totalpeceipt;
        // transfer Mock Tether Tokens  to this contract for staking
        tetherToken.transfer(msg.sender, shareofpool);
        peceiptToken.transferFrom(msg.sender, address(this), _amount);

        // reset staking balance
        stakingBalance[msg.sender]=stakingBalance[msg.sender]-_amount;

        // Update staking status
        if (stakingBalance[msg.sender]==0){
            isStaking[msg.sender]=false;
        } else {
            isStaking[msg.sender]=true;
        }

        
        farmInfo.tetherSupply -=shareofpool;
        farmInfo.peceiptInCirculation -=_amount;
        
    }
    function withdrawTether (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        tetherToken.transfer(msg.sender, _amount);
        farmInfo.tetherSupply -=_amount;
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