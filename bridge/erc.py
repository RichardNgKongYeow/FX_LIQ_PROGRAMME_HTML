import os
import json
from web3 import Web3
import re


class ERC20():
    
    def __init__(self,contract_address, provider=None):
        self.provider = "https://mainnet.infura.io/v3/dcaedb01c8844466887939c66e1e0082"
        self.contract_address=contract_address
        ABI = json.load(open(os.path.abspath(f"{os.path.dirname(os.path.abspath(__file__))}/assets/" + "ERC20.json")))["abi"]
        
        if re.match(r'^https*:', self.provider):
            provider = Web3.HTTPProvider(self.provider, request_kwargs={"timeout": 60})
        elif re.match(r'^ws*:', self.provider):
            provider = Web3.WebsocketProvider(self.provider)
        elif re.match(r'^/', self.provider):
            provider = Web3.IPCProvider(self.provider)
        else:
            raise RuntimeError("Unknown provider type " + self.provider)
     
        self.conn = Web3(provider)
        if not self.conn.isConnected():
            raise RuntimeError("Unable to connect to provider at " + self.provider)
        self.gasPrice = self.conn.toWei(15, "gwei"),
        self.contract = self.conn.eth.contract(address=Web3.toChecksumAddress(self.contract_address), abi=ABI)

    # Factory Read-Only Functions
    # -----------------------------------------------------------
    def _symbol(self):
        """
        Returns symbol of the token.
        """
        return self.contract.functions.symbol().call()
 

    def _name(self):
        """
        Returns name of the token.
        """
        return self.contract.functions.name().call()

    def _totalSupply(self):
        """
        Returns name of the token.
        """
        return self.conn.fromWei((self.contract.functions.totalSupply().call()),'ether')

    def _decimals(self):
        """
        Returns the decimals of the token.
        """
        return self.contract.functions.decimals().call()
    def _getbalanceof(self,account_address):
        """
        Returns the balance of the token.
        """
        return self.contract.functions.balanceOf(account_address).call()
