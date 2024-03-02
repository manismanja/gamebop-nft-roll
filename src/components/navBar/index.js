import './index.scss'
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import menuIcon from '../../assets/img/navbar/menu.svg'
import { useLocation } from 'react-router-dom'
import { WalletModal } from '../walletModal'
import { useWeb3React } from '@web3-react/core'
import { shortenAddress } from '../../helper'
import { useModalOpen, useWalletModalToggle } from '../../hooks/store'
import { ApplicationModal } from '../../constants'
import metamaskImg from '../../assets/img/metamask.png'

export const NavBar = () => {
    const location = useLocation()

    const { account } = useWeb3React()

    const [ showDropDown, setShowDropDown ] = useState(false)

    const walletModalOpen = useModalOpen( ApplicationModal.WALLET )

    const toggleWalletModal = useWalletModalToggle()

    const handleClickDropDownMenu = () => {
        setShowDropDown(prev => !prev)
    }

    const detectTarget = (event) => {
        if( !event.target.matches('#dropdownMenuBtn') ) {
            setShowDropDown(false)
        }
    }

    useEffect(() => {
        window.addEventListener('click', detectTarget)

        return () => {
            window.removeEventListener('click', detectTarget)
        }
    })

    return (
        <div className='navBar w-screen'>
            <div className='container flex w-full justify-between items-center'>
                <Link className='navBar__logo' to='/'>
                </Link>

                <div className='navBar__menu'>
                    <div className={`navBar__menu__items ${ location.pathname === '/mindmap' ? 'black' : '' }`}>
                        <Link className='item' to='/'>HOME</Link>
                        <Link className='item' to='/gallery'>GALLERY</Link>
                    </div>

                    <div className='flex items-center justify-center'>
                        <button 
                            onClick={ toggleWalletModal }
                            className='navBar__connectWalletBtn flex items-center justify-center uppercase p-2 px-4 text-base'
                        >
                            <div>
                                { account ? shortenAddress( account ) : 'connect wallet' }
                            </div>

                            <img alt='pic' src={metamaskImg} width={30} height={30}></img>
                        </button>
                    </div>

                    <div className="navBar__menu__dropDownMenu">
                        <button id='dropdownMenuBtn' onClick={handleClickDropDownMenu}><img src={menuIcon} className="navBar__menu__dropDownMenu__icon" alt="menu"></img></button>
                        { showDropDown ? (
                            <div className="navBar__menu__dropDownMenu__content">
                                <Link className='item' to='/'>HOME</Link>
                                <Link className='item' to='/gallery'>GALLERY</Link>
                            </div>
                        ): null }
                    </div>

                    <WalletModal 
                        isOpen={walletModalOpen}
                        onClose={ toggleWalletModal }
                    />
                </div>
            </div>
        </div>
    )
}

export default NavBar