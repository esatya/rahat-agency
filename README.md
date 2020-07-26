# Rahat

Ethereum based aid distribution through SMS using ERC-20 token

# Getting started

This is a web-based application with node-js as backend and uses truffle as a tool to compile and deploy contracts.
It uses MongoDB as a database for regular non-blockchain data persistence and solidity smart contract to execute transactions on ethereum blockchain. This software is designed to work on following environments

-   ```Node-js --version == 10.18.1```
    
-  ``` Yarn --version == 1.21.1```
    
-   ```MongoDB --version >= 4.2.8```
    

## Prerequisite

To run this software on your machine locally you need to have the following packages installed globally.

-  ``` Truffle --version == 5.1.22```
    

- ```npm install -g truffle@5.1.22```
    

-  ``` ganache -- version >= 2.0.0```
    

-   ```npm install -g ganache```
    

## Installing

To setup this software on your machine locally, first clone this repository to your local machine and create a folder named ‘config’ on root of this repository. You need to add three files here

-   Local.json
    
-   client.json
    
-   setup.js
    

  

To start this software - run Ganache then perform the following actions:

1.  Install required dependencies on both frontend and backend:
     ```yarn setup```

2. Deploy contracts to the blockchain 
    ```truffle migrate```

3. Start backend
    ```yarn start```
    
4. Start frontend
    ```Yarn client```
    

  


## coding style tests

This repository uses eslint to enforce air-bnb coding styles.

# Deployment

To deploy this software on production you need to

-   Deploy contracts on mainnet Or any public/private ethereum network.
    
-   Update your mnemonic key in truffle-config.js  
    Note: If you have real ether in your wallet never upload mnemonic key or private key. you can put it in .env or config files.
    
-   Now to deploy to your preferred network:
      ```Truffle migrate --network <Network name>```

# Contributing

Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in Gitter in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://lab.rumsan.net/esatya/cash-aid/-/blob/stage/CONTRIBUTING.md)
