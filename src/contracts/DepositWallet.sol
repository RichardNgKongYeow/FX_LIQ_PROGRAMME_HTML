pragma solidity ^0.8.0;

import "./PeceiptToken.sol";
import "./TetherToken.sol";
import "./Ownable.sol";
import "./CheckContract.sol";

contract DepositWallet is CheckContract{
    // All code goes here...

    string public name = "Deposit Wallet";
    address public owner;
    uint256 public mUSDTpool;
    uint256 public mUSDTfees;
    uint256 public PFXincirculation;
    uint256 public mUSDTtoPFX;
    uint256 public PFXtomUSDT;
    uint8 stakingFee=3;



    // saving smart contract types as state variables here
    PeceiptToken public peceiptToken;
    TetherToken public tetherToken;
    address[] public stakers;

    
    mapping(address => StakerInfo) public stakerInfo;


    // --- Pool Events ---
    event mUSDTpoolUpdated(uint _mUSDTpool);
    event mUSDTfeesUpdated(uint _mUSDTfees);
    event PFXincirculationUpdated(uint _PFXincirculation);
    event mUSDTtoPFXUpdated(uint _mUSDTtoPFX);
    event PFXtomUSDTUpdated(uint _PFXtomUSDT);


    event Staked(
        address account,
        uint tetherDeposited,
        uint lpReceived,
        uint timeStamp
  );

    event unStaked(
        address account,
        uint lpDeposited,
        uint tetherReceived,
        uint timeStamp
  );
    event withdraw(
        address account,
        uint tetherWithdrawn,
        uint timeStamp
  );
    event add(
        address account,
        uint tetherAdded,
        uint timeStamp
  );
    event unstakeWithPenalty(
        address account,
        uint lpDeposited,
        uint tetherReceived,
        uint timeStamp,
        uint penalty
  );


    struct StakerInfo {
        uint256 peceiptBalance;
        uint256 stakingTimestamp;
        bool hasStaked;
        bool isStaking;
        uint256 unStakingTimestamp;
    }


    

    // constructor(PeceiptToken(type ie smart contract type ie PeceiptToken(sol)) _peceiptToken(address))
    // can just change the contract add of tethertoken here
    constructor(PeceiptToken _peceiptToken, TetherToken _tetherToken) public {
        peceiptToken=_peceiptToken;
        tetherToken=_tetherToken;
        owner=msg.sender;
    }

    // This isnt equal to the the contract's raw mUSDT balance - upon staking, some of the mUSDT will be deposited into fees segment.
    // --- External View functions for the pool ---
    function getUSDTpool() external view returns (uint) {
        return mUSDTpool;
    }
    function getPFXincirculation() external view returns (uint) {
        return PFXincirculation;
    }
    function getmUSDTtoPFX() external view returns (uint) {
        return mUSDTtoPFX;
    }
    function getPFXtomUSDT() external view returns (uint) {
        return PFXtomUSDT;
    }
    // onlyOwner add in function below
    function getUSDTfees() external view returns (uint) {
        return mUSDTfees;
    }


    function stakeTokens(uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        
        // Transfer TetherTokens to this contract for staking
        tetherToken.transferFrom(msg.sender, address(this), _amount);

        // Add user to stakers array *only if they haven't staked already
        if(!stakerInfo[msg.sender].hasStaked){
            stakers.push(msg.sender);
        }

        // update staking status
        stakerInfo[msg.sender].stakingTimestamp = block.timestamp;
        stakerInfo[msg.sender].isStaking = true;
        stakerInfo[msg.sender].hasStaked = true;
        
        // starting the pool
        uint shareofpool;
        if (PFXincirculation==0){
            shareofpool=((100-stakingFee)*_amount)/100;
        }
        else{
            shareofpool=(((100-stakingFee)*(_amount*PFXtomUSDT))/100)/(10**18);
        }

        // transfer lp token to person and update PFXpool
        peceiptToken.transfer(msg.sender, shareofpool);
        addToPFXincirculation(shareofpool);

        // update staking balance
        // this is to increment the stakingBalance amount in the array
        stakerInfo[msg.sender].peceiptBalance=stakerInfo[msg.sender].peceiptBalance+shareofpool;
        emit Staked(msg.sender, _amount, shareofpool, stakerInfo[msg.sender].stakingTimestamp);

        // update mUSDTpool and mUSDTfees
        uint amountaddTomUSDTpool=((100-stakingFee)*_amount)/100;
        uint amountaddTomUSDTfees=((stakingFee)*_amount)/100;
        addTomUSDTpool(amountaddTomUSDTpool);
        addTomUSDTfees(amountaddTomUSDTfees);

        // update exchange rates TODO need this here?
        updatemUSDTtoPFX();
        updatePFXtomUSDT();

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
        stakerInfo[msg.sender].unStakingTimestamp=block.timestamp;
        // require amount greater than 0
        require(balance > 0, "Receipt Token balance cannot be 0");
        uint256 shareofpool=(_amount*mUSDTtoPFX)/(10**18);

        // transfer lp Tokens back to this contract for staking
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
        deductFrommUSDTpool(shareofpool);
        deductFromPFXincirculation(_amount);
        emit unStaked(msg.sender, _amount, shareofpool, stakerInfo[msg.sender].unStakingTimestamp);
        
    }
    function withdrawTether (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        tetherToken.transfer(msg.sender, _amount);
        deductFrommUSDTpool(_amount);
        updatemUSDTtoPFX();
        updatePFXtomUSDT();
        emit withdraw(msg.sender, _amount, block.timestamp);
    }

    // TODO take this out
    function addTether (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        tetherToken.transferFrom(msg.sender,address(this), _amount);
        addTomUSDTpool(_amount);
        updatemUSDTtoPFX();
        updatePFXtomUSDT();
        emit add(msg.sender, _amount, block.timestamp);
    }


    // function unstakeTokensWithPenalty(uint _amount) public {
    //     stakerInfo[msg.sender].unStakingTimestamp=block.timestamp;
    //     uint256 balance = stakerInfo[msg.sender].peceiptBalance;
    //     require(balance > 0, "Receipt Token cannot be 0");
    //     peceiptToken.transferFrom(msg.sender, address(this), _amount); //return lpx token
        
    //     // stopped here
    //     uint256 timedifference=duration-(block.timestamp-stakerInfo[msg.sender].stakingTimestamp);
    //     uint256 penalty=(timedifference*dailyPenaltyRate)/86400;

    //     uint totalpeceipt=farmInfo.peceiptInCirculation;
    //     uint totaltether=farmInfo.tetherSupply;
    //     uint256 shareofpool=_amount*totaltether/totalpeceipt;
    //     uint256 withdrawableAmt=shareofpool*(100-penalty)/100;
    //     uint256 penaltyamount=shareofpool-withdrawableAmt;

        

    //     tetherToken.transfer(msg.sender, withdrawableAmt); // Unstake x token



    //     // reset staking balance
    //     stakerInfo[msg.sender].peceiptBalance=stakerInfo[msg.sender].peceiptBalance-_amount;

    //     // Update staking status
    //     if (stakerInfo[msg.sender].peceiptBalance==0){
    //         stakerInfo[msg.sender].isStaking=false;
    //     } else {
    //         stakerInfo[msg.sender].isStaking=true;
    //     }

    //     // update pool info
    //     farmInfo.tetherSupply -=withdrawableAmt;
    //     farmInfo.peceiptInCirculation -=_amount;

    //     emit unstakeWithPenalty(msg.sender, _amount, withdrawableAmt, stakerInfo[msg.sender].unStakingTimestamp, penaltyamount);
    //     // getPoolShareRatio();
    // }
    
    // function transferOwnership(address _to, uint256 _amount) public {
    //     require(_amount > 0, "amount cannot be 0");
    //     require(_to == address(_to), "Invalid address");
    //     require(_amount <= stakerInfo[msg.sender].peceiptBalance, "amount less than LP balance");

    //     peceiptToken.transferFrom(msg.sender, _to, _amount); //transfer lpXToken
    //     // update staker fields
    //     stakerInfo[msg.sender].peceiptBalance=stakerInfo[msg.sender].peceiptBalance-_amount;
    //     stakerInfo[_to].peceiptBalance=stakerInfo[_to].peceiptBalance+_amount;
    //     stakerInfo[_to].stakingTimestamp=stakerInfo[msg.sender].stakingTimestamp;


    //     if (!stakerInfo[_to].hasStaked) {
    //         stakers.push(_to);
    //     }

    //     //Update staking status
    //     stakerInfo[_to].isStaking = true;
    //     stakerInfo[_to].hasStaked = true;


    // }

    // --- Pool functionality ---
    function addTomUSDTpool(uint _amount) private{
        mUSDTpool=mUSDTpool+_amount;
        emit mUSDTpoolUpdated(mUSDTpool);
    }
    function deductFrommUSDTpool(uint _amount) private{
        mUSDTpool=mUSDTpool-_amount;
        emit mUSDTpoolUpdated(mUSDTpool);
    }
    function addToPFXincirculation(uint _amount)private{
        PFXincirculation=PFXincirculation+_amount;
        emit PFXincirculationUpdated(PFXincirculation);
    }
    function deductFromPFXincirculation(uint _amount)private{
        PFXincirculation=PFXincirculation-_amount;
        emit PFXincirculationUpdated(PFXincirculation);
    }
    function addTomUSDTfees(uint _amount) private{
        mUSDTfees=mUSDTfees+_amount;
        emit mUSDTfeesUpdated(mUSDTfees);
    }
    function deductFrommUSDTfees(uint _amount) private{
        mUSDTfees=mUSDTfees-_amount;
        emit mUSDTfeesUpdated(mUSDTfees);
    }
    function updatemUSDTtoPFX() private {
        mUSDTtoPFX=(mUSDTpool*10**18)/PFXincirculation;
        emit mUSDTtoPFXUpdated(mUSDTtoPFX);
    }
    function updatePFXtomUSDT() private {
        PFXtomUSDT=(PFXincirculation*10**18)/mUSDTpool;
        emit mUSDTtoPFXUpdated(PFXtomUSDT);
    }
        
}