import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import FullScreenGallery from "./full-screen-gallery.tsx";

const GalleryContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    },
}));

const ThumbnailList = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: '5px',
    overflowX: 'auto',
    maxWidth: '100%',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'column',
        maxWidth: '100px',
        overflowY: 'auto',
        maxHeight: '400px',
    },
}));

const Thumbnail = styled('img')({
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    objectFit: 'cover',
});

const MainImageContainer = styled(Box)({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const MainImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '400px',
    cursor: 'pointer',
    objectFit: 'contain',
});

interface GalleryProps {
    images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleThumbnailClick = (index: number) => {
        setSelectedImage(index);
    };

    const handleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const handleNext = () => {
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <GalleryContainer>
            <ThumbnailList>
                {images.map((img, index) => (
                    <Thumbnail
                        key={index}
                        src={img}
                        onClick={() => handleThumbnailClick(index)}
                    />
                ))}
            </ThumbnailList>
            <MainImageContainer>
                <MainImage src={images[selectedImage]} onClick={handleFullScreen} />
            </MainImageContainer>
            {isFullScreen && (
                <FullScreenGallery
                    images={images}
                    selectedImage={selectedImage}
                    onClose={handleFullScreen}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onThumbnailClick={handleThumbnailClick}
                />
            )}
        </GalleryContainer>
    );
};

export default Gallery;