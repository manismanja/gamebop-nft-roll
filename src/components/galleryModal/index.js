import { useState, useEffect } from "react"
import Modal from 'react-modal'
import './index.scss'
import opensea from '../../assets/img/gallery/opensea.svg'
import { colors } from "../../constants"

export const GalleryModal = ({ isOpen, onClose, nftDetail }) => {
    const metadata = nftDetail.metadata ? JSON.parse( nftDetail.metadata ) : { attributes: [] }

    const getBackgroundColor = (metadata) => {
        if (!metadata.attributes.length)
          return colors['Default']

        metadata?.attributes.map((item) => {
            let color;
            if (item.trait_type == "Background") {
                if (colors[item.value]) {
                    color = colors[item.value]
                } else {
                    color = colors['Default']
                }

                // console.log("metadata", color)
                // if (document.getElementsByClassName('ReactModal__Content')[0]) {
                //     console.log('I am ready')
                //     document.getElementsByClassName('ReactModal__Content')[0].style.background = color;
                // }
                // for (let element of document.getElementsByClassName('ReactModal__Content')) {
                //     console.log(element)
                //     element.style.background = color;
                // }

                console.log(color)

                return color
            }
        })

        return colors['Default']
    }

    useEffect(() => {
        getBackgroundColor(metadata);
    }, [metadata])

    return (
        <div id="modal_gallery">
            <Modal 
                isOpen={ isOpen }
                onRequestClose={ onClose }
                appElement={document.getElementById('modal_gallery')} 
                className='galleryModal'
                overlayClassName="Overlay"
            >
                <div className="flex h-full relative modalWrapper" style={{ background: getBackgroundColor(metadata) }}>
                    <div className="w-full h-full modalViewer">
                        <img src={`https://ipfs.io/ipfs/QmXmuSenZRnofhGMz2NyT3Yc4Zrty1TypuiBKDcaBsNw9V/${ Number(nftDetail.token_id) + 1 }.gif`} alt='pic' />
                    </div>

                    <div className="p-8 w-full flex flex-col justify-between relative modalDetail">
                        <div className="relative" style={{ height: "calc(100% - 80px)" }}>
                            <div className="nft_name p-4 flex items-center mb-8" style={{ justifyContent: 'space-between'}}>
                                <div>
                                    NOWNFT <span className="ml-2">#{ nftDetail.token_id }</span>
                                </div>
                                <a 
                                    target={'_blank'}
                                    // href={`https://opensea.io/assets/ethereum/0x1622ddfe621f5a3fb43a95cd575fc164a7e6c158/${ nftDetail.token_id }`}>
                                    href={`https://testnets.opensea.io/assets/goerli/0xe74da0a4e7c5fc09fa793498cce70e598d8432b2/${ nftDetail.token_id }`}>
                                    <img alt="pic" src={ opensea } style={{ width: 48, height: 48 }}/>
                                </a>
                            </div>

                            <div className="nft_attributes flex flex-wrap">
                                { (metadata?.attributes).map((item, index) => (
                                    <div className="nft_attribute text-center p-4" key={`attr_${index}`}>
                                        <div>{ item.trait_type }</div>
                                        <div className="font-bold"> { item.value } </div>
                                    </div>
                                )) }
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}