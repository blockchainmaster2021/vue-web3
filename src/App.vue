<template>
  <v-app id="app">
    <Header/>
    <div>
      <router-view/>
    </div>
    <web3-modal-vue
        ref="web3modal"
        :theme="theme"
        :provider-options="providerOptions"
        cache-provider
    />
    <div>
      <button class="button" @click="connect">{{flag}}</button>
      <span></span>
    </div>
    <br />
    <div v-show="active">
      <span>{{account}}</span>
      <button class="button" @click="disconnect">logout</button>
      
    </div>
    <br />
    <div v-show="active">
      <h2>Address:{{account}}</h2>
      <h2>NFT Balance:{{balance}}</h2>
    </div>
    <!-- <div>
      <button class="button" @click="getinfo">{{"getinfo"}}</button>
      <h2>Address:{{account}}, NFT Balance:{{balance}} </h2>
    </div>
    <br /> -->
    <!-- <div>
      <button class="button" @click="getbalance">{{"getbalance"}}</button>
      <span>{{balance}}</span>
    </div> -->
    <!-- <img src='../src/assets/images/coinbase-wallet.svg' /> -->
  </v-app>
</template>
<script>
import Web3ModalVue from "web3modal-vue";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { WalletLink } from 'walletlink';
import Fortmatic from "fortmatic";
import {web3Modal, nftContract} from "./config/mixins";
import Header from "@/components/Header";
import coinwalletsvg from "../src/assets/images/coinbase-wallet.svg";
import walletconnectsvg from "../src/assets/images/walletconnect.svg";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import Portis from "@portis/web3";
import {FORTMATIC_KEY, CHAINID, NETWORKID} from "../src/config/setting";

export default {
  components: {
    Header,
    Web3ModalVue
  },
  mixins: [web3Modal, nftContract],
  data() {
    return {
      theme: 'dark',
      providerOptions: {
        'custom-walletconnect': {
          display: {
            logo: walletconnectsvg,
            name: 'WalletConnect',
            description: 'Scan with WalletConnect to connect',
          },
          package: WalletConnectProvider,
          connector: async (_, options) => {
            const provider = new WalletConnectProvider({
              rpc: { 1: process.env.VUE_APP_RPC_URL},
            });
            await provider.enable();
            return provider;
          },
        },
        'custom-walletlink': {
          display: {
            logo: coinwalletsvg,
            name: 'WalletLink',
            description: 'Scan with WalletLink to connect',
          },
          options: {
            appName: 'app', // Your app name
            networkUrl: process.env.VUE_APP_RPC_URL,
            chainId:CHAINID,
          },
          package: WalletLink,  
          connector: async (_, options) => {
            const { appName, networkUrl, chainId } = options
            const walletLink = new WalletLink({
              appName
            });
            const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
            await provider.enable();
            return provider;
          },
        },       
      },
      active: false,
      balance: 0,
      flag:"login",
      account:this.$store.state.web3Modal.account,
    }
  },
  created() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark'
    }
  },
  mounted() {
    console.log("changed")
    this.$nextTick(async () => {
      const web3modal = this.$refs.web3modal;
      this.$store.commit('setWeb3Modal', web3modal)
      if (web3modal.cachedProvider) {
        this.connect()
      }
    })
  },
  computed: {
    accountstr() {
      const str = this.$store.state.account;
      return str;
    },
  },
  methods: {
    connect() {
      this.$store.dispatch('connect')
    },
    disconnect() {
      this.$store.dispatch('disconnect')
    },
    getinfo() {
      // console.log('getinfo')
      this.account = this.$store.state.web3Modal.account
      this.balance = this.$store.state.web3Modal.balance
      this.active = this.$store.state.web3Modal.active
      if(this.$store.state.web3Modal.active) {
        let substring = this.$store.state.web3Modal.account;
        this.flag = substring.substr(0, 6) + "..." + substring.substr(substring.length-4,4) 
      } else {
        this.flag = "login"
      }

      // console.log(this.$store.state.web3Modal.account)
    },
    getbalance() {
      // console.log(this.$store)
      this.$store.dispatch('getUserBalance')
    }
  },
  watch: {
      '$store.state.web3Modal.active': function() {
        // this.account = this.$store.state.web3Modal.account;
        // console.log("tseet = ",this.$store.state.web3Modal.account)
        this.getinfo()
      },
      // '$store.state.web3Modal.balance': function() {
      //   // this.balance = this.$store.state.web3Modal.balance;
      //   this.getinfo()
      // }
  }
}
</script>
<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
.button {
  // background-image: linear-gradient(to rirgb(240, 1ght, rgba(255,0,0,0), 25, 125));
  background-color: #3b5ae6;
  border: round($number: 0);
  border-radius: 10px;
  color: white;
  padding: 1px 10px;
  text-align: center;
  font-size: 16px;
  align-content: center;
  margin: auto;
  opacity: 0.8;
  transition: 0.3s;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  width:120px;
  height: 50px;
}

div {
  text-align: center;
}

.button:hover {opacity: 1}
</style>
