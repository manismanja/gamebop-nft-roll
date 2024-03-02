import './index.scss'
import React, { useState, useEffect } from 'react'
import backPic from '../../assets/img/bg/background.jpg'
import { ApplicationModal, attributes } from '../../constants'
import { useGalleryModalToggle, useModalOpen } from '../../hooks/store'
import { GalleryModal } from '../../components/galleryModal'
import useNFTMoralis from '../../hooks/useNFTMoralis'
import placeholderSrc from '../../assets/img/gallery/placeholder.png'
import ProgressiveImg from './galleryImage'

export const MyNFT = () => {
    const [ nftDetail, setNftDetail ] = useState({})

    const [ showCount, setShowCount ] = useState(20)

    const openModal = useModalOpen( ApplicationModal.GALLERY )

    const toggleModal = useGalleryModalToggle()

    const { myNFTData } = useNFTMoralis()

    const detectScroll = () => {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 90 / 100)) {
            setShowCount(prev => prev + 20)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', detectScroll)

        return (() => window.removeEventListener('scroll', detectScroll))
    }, [])

    const onClickImage = (item) => {
        setNftDetail(item)

        toggleModal()
    }

    return (
        <div className='gallery'>
            <img className='backImg' alt='pic' src={ backPic }></img>

            <div className='container'>
                <div className='gallery__content'>
                    <h1 className='gallery__title'>My Collections</h1>

                    <div className='gallery__content__wrapper relative'>
                        { myNFTData.length > 0 && myNFTData.map((item, index) => (
                            <div className='item p-2 flex flex-col relative' key={`galleryitem__${index}`} onClick={ () => onClickImage(item) }>
                                <div className='item__title w-full'>
                                    NOWNFT #{ item.token_id }
                                </div>

                                <ProgressiveImg placeholderSrc={ placeholderSrc } src={`https://ipfs.io/ipfs/QmXmuSenZRnofhGMz2NyT3Yc4Zrty1TypuiBKDcaBsNw9V/${ Number(item.token_id) + 1 }.gif`} alt='pic' />
                            </div>
                        )) }
                    </div>

                    <GalleryModal
                        isOpen={ openModal }
                        onClose={ toggleModal }
                        nftDetail={ nftDetail }
                    />
                </div>
            </div>
        </div>
    )
}

export default MyNFT