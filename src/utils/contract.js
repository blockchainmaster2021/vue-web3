import NftContractAbi from '../config/abi/nftcontractabi.json'
import {ethers} from "ethers";
import {simpleRpcProvider} from "@/utils/web3";
import store from '@/store'
import {CONTRACT_ADDRESS} from "../config/setting";

export const getNftContract = () => {
    const {library} = store.state.web3Modal
    const signer = library.getSigner()
    return getContract(NftContractAbi, CONTRACT_ADDRESS[0], signer)
}

const getContract = (abi, address, signer = null) => {

    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
}