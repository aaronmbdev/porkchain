# Chaincode

[![ Tests for Pig Chaincode](https://github.com/aaronmbdev/porkchain/actions/workflows/go.yml/badge.svg)](https://github.com/aaronmbdev/porkchain/actions/workflows/go.yml)

This folder contains all the smart contracts to be deployed in the network. Inside the pig/ folder there are several contracts. The most important files are the following:



| File            | Description                                                                                                                                           |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| entities.go     | This file contains the definition of the dataclasses that are used by the contracts.                                                                  |
| strings.go      | This file contains the hard-coded strings of the chaincode. Mostly error messages.                                                                    |
| xxx-contract.go | This set of files are the different contracts that make the chaincode. Each one of them is done for each kind of entity such as meat, pig, cage, etc. |
| xxx-test.go     | A test file contains the relevant unit tests for a given contract.                                                                                    |