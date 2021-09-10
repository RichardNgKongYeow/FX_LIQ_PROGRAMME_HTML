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
    uint8 public stakingFee=3;



    // saving smart contract types as state variables here
    PeceiptToken public peceiptToken;
    TetherToken public tetherToken;



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

    // TODO add in only owner modifier and contract inheritance
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
        emit Staked(msg.sender, _amount, shareofpool, block.timestamp);

        // update mUSDTpool and mUSDTfees
        uint amountaddTomUSDTpool=((100-stakingFee)*_amount)/100;
        uint amountaddTomUSDTfees=((stakingFee)*_amount)/100;
        addTomUSDTpool(amountaddTomUSDTpool);
        addTomUSDTfees(amountaddTomUSDTfees);

        // update exchange rates TODO need this here?
        updatemUSDTtoPFX();
        updatePFXtomUSDT();

    }

    function unstakeTokens(uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        uint256 shareofpool=(_amount*mUSDTtoPFX)/(10**18);

        // transfer lp Tokens back to this contract for staking
        peceiptToken.transferFrom(msg.sender, address(this), _amount);
        tetherToken.transfer(msg.sender, shareofpool);

        // update pool info
        deductFrommUSDTpool(shareofpool);
        deductFromPFXincirculation(_amount);
        emit unStaked(msg.sender, _amount, shareofpool, block.timestamp);
        
    }

    // ---OnlyOwner Functions---
    function withdrawTetherFromPool (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        tetherToken.transfer(msg.sender, _amount);
        deductFrommUSDTpool(_amount);
        updatemUSDTtoPFX();
        updatePFXtomUSDT();
        emit withdraw(msg.sender, _amount, block.timestamp);
    }

    function addTetherToPool (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        tetherToken.transferFrom(msg.sender,address(this), _amount);
        addTomUSDTpool(_amount);
        updatemUSDTtoPFX();
        updatePFXtomUSDT();
        emit add(msg.sender, _amount, block.timestamp);
    }

    function transferTetherFromFeesToPool (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        deductFrommUSDTfees(_amount);
        addTomUSDTpool(_amount);
        updatemUSDTtoPFX();
        updatePFXtomUSDT();
    }
    function withdrawTetherFromFees (uint _amount) public{
        require(_amount > 0, "amount cannot be 0");
        require(msg.sender==owner, "caller must be the owner");
        tetherToken.transfer(msg.sender, _amount);
        deductFrommUSDTfees(_amount);
        updatemUSDTtoPFX();
        updatePFXtomUSDT();
    }


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