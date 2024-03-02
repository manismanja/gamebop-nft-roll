import { useMoralisWeb3Api } from "react-moralis"
import { useActiveWeb3React } from "."
import React, { useState, useEffect, useCallback } from 'react'
import { ChainId, contractAddress, MoralisAPIKey } from "../constants"

// start moralis server
const Moralis = require('moralis')
const serverUrl = MoralisAPIKey.serverUrl
const appId = MoralisAPIKey.appId
Moralis.start({ serverUrl, appId })

const useNFTMoralis = () => {
    const { account, chainId } = useActiveWeb3React()
    const Web3Api = useMoralisWeb3Api()
    const [ allNFTData, setAllNFTData ] = useState([])
    const [ myNFTData, setMyNFTData ] = useState([])

    const fetchNFTsForContract = useCallback(async () => {
        const oldTime = new Date().getTime()
        
        let cursor = null

        while(true) {
            const options = {
                chain: "goerli",
                address: contractAddress[ ChainId['GOERLI'] ],
                cursor: cursor,
            }

            const ethNFTs = await Web3Api.token.getAllTokenIds(options);

            console.log(ethNFTs)

            cursor = ethNFTs.cursor

            setAllNFTData( prev => ([ ...prev, ...ethNFTs.result ]) )

            if( cursor === "" || cursor === null )
                break
        }

        const newTime = new Date().getTime()
        console.error('time elapsed: ', (newTime - oldTime))
    }, [ setAllNFTData ])

    const fetchNFTsForOwner = useCallback(async () => {
        if (!account)
            return;

        const oldTime = new Date().getTime()
        
        let cursor = null

        while(true) {
            const options = {
                chain: "goerli",
                address: account,
                token_addresses: contractAddress[ ChainId['GOERLI'] ],
                cursor: cursor,
            }

            const ethNFTs = await Web3Api.account.getNFTs(options);

            console.log(ethNFTs)

            cursor = ethNFTs.cursor

            setMyNFTData( prev => ([ ...prev, ...ethNFTs.result ]) )

            if( cursor === "" || cursor === null )
                break
        }

        const newTime = new Date().getTime()
        console.error('time elapsed: ', (newTime - oldTime))
    }, [ setMyNFTData ])


    useEffect(() => {
        fetchNFTsForContract()
        fetchNFTsForOwner()
    }, [ setAllNFTData, setMyNFTData ])

    return { allNFTData, myNFTData }
}

export default useNFTMoralis