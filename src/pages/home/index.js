import './index.scss'
import React, { useState, useEffect } from 'react'
import { BigNumber } from "ethers"
import backPic from '../../assets/img/bg/background.jpg'
import useMintNFT from '../../hooks/useMintNFT'
import { formatBalance, errorFilter } from '../../utils'
import { ChainId, contractAddress, mainNetworkChainId } from '../../constants'
import { shortenAddress } from '../../helper'
import { useWeb3React } from '@web3-react/core'
import { useWalletModalToggle } from '../../hooks/store'
import { useIsTransactionPending } from '../../hooks/store/transactions'
import { Loader } from '../../components/loader'
import { NotificationManager } from 'react-notifications'

export const Home = () => {
    const { account } = useWeb3React()
    const [ count, setCount ] = useState(1)
    const [ pendingTx, setPendingTx ] = useState(null)
    const [ saleStatus, setSaleStatus ] = useState('')

    const isPending = useIsTransactionPending(pendingTx ?? undefined)

    const enableMintBtn = pendingTx === null || !isPending

    const { totalSupply, maxSupply, presaleStatus, publicsaleStatus, presalePrice, publicsalePrice, mint } = useMintNFT()

    const toggleWalletModal = useWalletModalToggle()

    const getTotalMintPrice = () => {
        let totalPrice

        if (presaleStatus) 
            totalPrice = BigNumber.from(presalePrice).mul(count)
        if (publicsaleStatus)
            totalPrice = BigNumber.from(publicsalePrice).mul(count)

        totalPrice = !totalPrice ? BigNumber.from(0) : totalPrice

        return totalPrice
    }

    const getFormattedTotalPrice = () => {
        return Number( formatBalance( getTotalMintPrice(), 18 ) )
    }

    useEffect(() => {
        if( count >= maxSupply - totalSupply )
            setCount( maxSupply - totalSupply )
        if( count <= 1 )
            setCount( 1 )

        if (account) {
            if (presaleStatus) {
                setSaleStatus('PreSale')
            } else if (publicsaleStatus) {
                setSaleStatus('PublicSale')
            } else {
                setSaleStatus('Now is not the time to mint')
            }
        }
    }, [ count, presaleStatus, publicsaleStatus ])

    const onClickMint = async () => {
        if( !account ) {
            toggleWalletModal()
            return
        }

        try {
            const val = await mint({
                mintAmount: count,
                value: getTotalMintPrice()
            })

            if (val.result) {
                if( val.status.hash )
                    setPendingTx(val.status.hash)
            } else {
                const err = val.status
                
                NotificationManager.error( errorFilter(err), 'Something went wrong!' )
            }

        } catch(e) {
            console.error('mint process error --------', e)
        }
    }

    return (
        <div className='home'>
            <img className='backImg' alt='pic' src={ backPic }></img>

            <div className='container min-h-screen relative'>
                <div className='home__mintingbox flex flex-col justify-between items-center p-12'>
                    <div className='text-red-700 text-2xl font-bold py-2'>{ saleStatus }</div>

                    <div className='text-center'>
                        <div className='text-red-700 text-2xl font-bold py-2'>MINT NOW!</div>
                        <div className='text-base py-2'>{totalSupply}/{maxSupply} minted!</div>
                    </div>

                    <div className='relative w-full text-center'>
                        <div className='flex home__mintingbox__inputbox'>
                            <button 
                                className='text-xl' 
                                onClick={() => setCount(prev => prev - 1)} 
                                disabled={ count <= 1 }
                            > - </button>

                            <input 
                                className='outline-none text-center text-2xl font-bold' 
                                type={'text'} 
                                readOnly
                                value={ count } 
                                placeholder={ count } 
                                onChange={ (e) => setCount(e.target.value) } 
                            />

                            <button 
                                className='text-xl' 
                                onClick={() => setCount(prev => prev + 1)}
                                disabled={ count >= (maxSupply - totalSupply) }
                            > + </button>
                        </div>

                        <div className='text-base py-2'> { getFormattedTotalPrice() }E + TX </div>
                    </div>

                    <div className='flex flex-col items-center home__mintingbox__mintbtn w-full'>
                        <button
                            className='text-2xl font-bold py-3 text-red-700 w-full flex justify-center items-center' 
                            onClick={ onClickMint }
                            disabled={ !enableMintBtn }
                        >
                            { (pendingTx && isPending) ? (
                                <>
                                    <Loader size='25' />
                                </>
                            ) : 'MINT' }
                        </button>

                        <a 
                            href={`https://goerli.etherscan.io/address/${ contractAddress[ ChainId['GOERLI'] ] }`} 
                            className='text-sm mt-4'
                            target={'_blank'}
                        >
                            { shortenAddress( contractAddress[ ChainId['GOERLI'] ], 10 ) }
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home