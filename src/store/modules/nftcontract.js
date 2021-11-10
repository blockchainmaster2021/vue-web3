import {getNftContract } from "@/utils/contract";
import web3Modal from "@/store/modules/web3Modal";



const contractInfoStore = {
    state: {
        balance: 0,
    },
    getters: {},
    mutations: {
        setBalance(state, balance) {
            state.balance = balance
        },
    },
    actions: {
        async getUserBalance({commit}) {
            const info = await getInfo(web3Modal.state.account)
            commit('setBalance', info.balance.toNumber())
            // commit('balance', info.owner)
        },
    },
}
export default contractInfoStore

export const getInfo = async (account) => {
    console.log(account)
    const contract = getNftContract()
    let balance;
    balance = await contract.balanceOf(account)
    return {
        balance
    }
}
