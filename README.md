<p align="center">
  <a href='https://coveralls.io/github/esatya/rahat-agency?branch=master'>
    <img src='https://coveralls.io/repos/github/esatya/rahat-agency/badge.svg?branch=master' alt='Coverage Status' /></a>

  <a href="https://github.com/esatya/rahat-agency/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/esatya/rahat/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg" alt="License" />
  </a>
</p>


# Rahat - Blockchain-based Aid Distribution (Agency Dashboard)

_Important: This project is part of [Rahat Project](https://github.com/esatya/rahat). Please make sure you have setup Rahat service first._

Rahat is a blockchain-based digital relief distribution management platform for humanitarian agencies to support marginalized communities. It issues, manages and monitors relief distribution in the form of digital tokens. It creates a transparent, efficient and cheaper way to distribute cash or goods. It mobilizes the local community encouraging financial resilience and freedom. For more information please visit https://rahat.io.

Rahat’s main features are:

- Dashboard for aid agencies to issue relief tokens to recipients & to onboard local community vendors. Agencies can audit all transactional information real-time.
- Mobile based wallet app for local vendors to initiate & record relief token transaction in a blockchain network & cash transfer from banks.
- A SMS feature for recipients to receive their token and/or assigned digital card with QR code to buy relief products from participating local merchants.
- Transaction data in blockchain network to verify the flow of tokens.
- A platform for local authorities & aid agencies to connect.

## Installing

1 Update .env file to add url of your Rahat server
`REACT_APP_API_SERVER=http://localhost:3800 REACT_APP_BLOCKCHAIN_EXPLORER={netowrk gateway}`

2.  Install required dependencies and compile smart contracts
    `yarn install`

3.  Start the server
    `yarn start`
4.  Now, in your browser go to http://localhost:3000 and follow the setup instructions on screen.

## Coding Styles

This repository uses eslint to enforce air-bnb coding styles.

# Important: for Production

When you deploy Rahat for production. Please make sure you backup the server's private key securely in an offline wallet, as it will contain some Ethers to perform various server tasks tasks.

# Contributing
Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in [Discord](https://discord.gg/AV5j2T94VR) in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://docs.rahat.io/docs/next/Contribution-Guidelines).
