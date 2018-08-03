import React, { Component } from 'react'
import EpicCookiesContract from '../build/contracts/EpicCookies.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      size: 0,
      address: '',
      epicCookieInstance: undefined,
      myAddress: ''
    }

    this.sendCookies = this.sendCookies.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    
    const contract = require('truffle-contract')
    const epicCookies = contract(EpicCookiesContract)
    epicCookies.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on epicCookie.

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      epicCookies.at('0x7641A6E0aA689BFeFbE4b43346916c9CF2c8dD53').then((instance) => {
        this.setState({
          epicCookieInstance: instance,
          myAddress: accounts[0]
        })
        
        return this.state.epicCookieInstance.balanceOf.call(this.state.myAddress)
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: this.state.web3.fromWei(result).toNumber() })
      })
    })
  }

  handleSizeChange(event) {
    this.setState({size: event.target.value});
  }

  handleAddressChange(event) {
    this.setState({address: event.target.value});
  }

  sendCookies() {
    this.state.epicCookieInstance.transfer(this.state.address,  this.state.web3.toWei(this.state.size), {from: this.state.myAddress, gasPrice: 1}).then(result => {
      console.log(result);
    });
  }

  render() {
    return (
      <div className="App">

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <p>Just check how many Epic Cookies do you have!!!!</p>
              <p>{this.state.storageValue}</p>
              {this.state.storageValue > 2 && <p>YOU ARE SO FATTTTTTTTT, share some love</p>}
              {this.state.storageValue < 1 && <p>DAMN ask someone for some!</p>}
              <input onChange={this.handleSizeChange} id="size" type="text" placeholder="How many"/>
              <input onChange={this.handleAddressChange} id="address" type="text" placeholder="To Whom"/>
              <button onClick={this.sendCookies}>Send Cookies</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
