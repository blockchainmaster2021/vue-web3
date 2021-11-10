import {getLibrary} from "@/utils/web3";
import {ethers} from "ethers";
import {parseInt} from 'lodash'

import { getInfo } from "./nftcontract";

const web3ModalStore = {
    state: {
        web3Modal: null,

        library: getLibrary(),
        active: false,
        account: null,
        chainId: 0,
        balance:0,
    },
    mutations: {
        setWeb3Modal(state, web3Modal) {
            state.web3Modal = web3Modal
        },
        setLibrary(state, library) {
            state.library = library
        },
        setActive(state, active) {
            state.active = active
        },
        setBalance(state, balance) {
            state.balance = balance;
        },
        setAccount(state, account) {
            if(account != null) {
                state.account = account.toLowerCase()
            } else {
                state.account = account
            }
        },
        setChainId(state, chainId) {
            state.chainId = chainId
        }
    },
    actions: {
        async connect({state, commit, dispatch}) {
            // console.log(state)
            const provider = await state.web3Modal.connect()
            const library = new ethers.providers.Web3Provider(provider)
            library.pollingInterval = 12000
            commit('setLibrary', library)

            const accounts = await library.listAccounts()            
            console.log(accounts)
            const info = await getInfo(accounts[0].toLowerCase())
            // console.log(info)
            if(info.balance <= 0 || !info) {
                alert("You haven't any nft token")
                await dispatch('disconnect')
                return
            } else {
                commit("setBalance", info.balance)
            }
            
            if (accounts.length > 0) {
                commit('setAccount', accounts[0])
            }

            const network = await library.getNetwork()
            commit('setChainId', network.chainId)
            // console.log("active")
            commit('setActive', true)

            provider.on("connect", async (info) => {
                let chainId = parseInt(info.chainId)
                commit('setChainId', chainId)
                console.log("connect", info)
            });

            provider.on("accountsChanged", async (accounts) => {
                // if (accounts.length > 0) {
                //     commit('setAccount', accounts[0])
                // } else {
                //     await dispatch('disconnect')
                // }
                await dispatch('disconnect')
                console.log("accountsChanged")
            });
            provider.on("chainChanged", async (chainId) => {
                // chainId = parseInt(chainId)
                // commit('setChainId', chainId)
                // console.log("chainChanged", chainId)
                await dispatch('disconnect')
            });
        },
        async disconnect({state, commit}) {
            const { web3 } = this.state;
            if (web3 && web3.currentProvider && web3.currentProvider.close) {
                await web3.currentProvider.close();
            }
            await state.web3Modal.clearCachedProvider();
            commit('setAccount', null)
            commit('setActive', false)
            commit('setBalance', 0)
            commit('setLibrary', getLibrary())
        }
    }
}

export default web3ModalStore;