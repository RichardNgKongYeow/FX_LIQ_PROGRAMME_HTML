


def _create_transaction_params(self, value=0, gas=1500000):
        return {
            "from": self.address,
            "value": value,
            'gasPrice': 1,
            "gas": gas,
            "nonce": self.conn.eth.getTransactionCount(self.address),
        }

def _send_transaction(self, func, params):
    tx = func.buildTransaction(params)
    signed_tx = self.conn.eth.account.signTransaction(tx, private_key=self.private_key)
    return self.conn.eth.sendRawTransaction(signed_tx.rawTransaction)



