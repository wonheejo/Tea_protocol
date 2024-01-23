from web3 import Web3

# URLs
url = "https://api.wemix.com" # Input the url of network
w3 = Web3(Web3.HTTPProvider(url))

# Accounts
account_address = '' # Your address
send_address = '' #The recipient's address. But you can add yours here
checked_address = w3.to_checksum_address(account_address)
checked_send_address = w3.to_checksum_address(send_address)

private_key = '' # Need to add your private key here inorder to run the script. 

# Fetch balance data
balance_sender = w3.from_wei(w3.eth.get_balance(checked_address), 'ether')
balance_recipient = w3.from_wei(w3.eth.get_balance(checked_send_address), 'ether')

print(f'The balance of { account_address } is: { balance_sender } WEMIX')
print(f'The balance of { send_address } is: { balance_recipient } WEMIX')

# Define the text message as a string
text = "" # This is where you write the text you would like to send. 

# Encode the text as bytes
text_bytes = text.encode('utf-8')
text_hex = w3.to_hex(text_bytes)
print(f"Original text: {text_bytes}") 
print(f"Hex text: {text_hex}") 
decoded = w3.to_text(text_hex)
print(f"decoded: {decoded}")

# ChainIds


# Create a transaction dictionary
tx = {
    #'from': checked_address,
    'to': checked_send_address,
    'nonce': w3.eth.get_transaction_count(checked_address),
    'value': w3.to_wei(0.00001, 'ether'),  # 0 ETH value for data transactions
    'data': w3.to_hex(text_bytes)[2:],  # Encode text as hexadecimal
    'gas': 500000,  
    'chainId': 1111, # Make sure to input the correct chain ID here. 
    'maxFeePerGas': w3.to_wei(250, 'gwei'),
    'maxPriorityFeePerGas': w3.to_wei(240, 'gwei')
}
print(f"nonce: {w3.eth.get_transaction_count(checked_address)}")
print(f"value: { w3.to_wei(0.0001, 'ether')}")
# Sign the transaction
signed_txn = w3.eth.account.sign_transaction(tx, private_key = private_key)

# Send the transaction
tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
print("send transaction worked")
transaction_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

print('Transaction Hash:', tx_hash.hex())
    
 


    


