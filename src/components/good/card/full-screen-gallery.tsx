import React, { useEffect } from 'react';
import { Box, IconButton, Modal, styled } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {GoodImage} from "../../../api";

const FullScreenGalleryContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
});

const ThumbnailList = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    maxHeight: '80vh',
    padding: '10px',
    marginRight: '20px',
});

const Thumbnail = styled('img')({
    width: '80px',
    height: '80px',
    cursor: 'pointer',
    objectFit: 'cover',
    borderRadius: '5px',
    border: '2px solid transparent',
    '&.active': {
        borderColor: '#1976d2',
    },
});

const MainImageContainer = styled(Box)({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '800px', // Фиксированная ширина контейнера
    height: '600px', // Фиксированная высота контейнера
    backgroundColor: '#fff', // Фон для контейнера (опционально)
    borderRadius: '10px',
    overflow: 'hidden', // Чтобы изображение не выходило за границы
});

const MainImage = styled('img')({
    width: '100%', // Занимает всю ширину контейнера
    height: '100%', // Занимает всю высоту контейнера
    objectFit: 'contain', // Сохраняет пропорции изображения
});

const NavigationButton = styled(IconButton)({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
});

const LeftButton = styled(NavigationButton)({
    left: '10px',
});

const RightButton = styled(NavigationButton)({
    right: '10px',
});

interface FullScreenGalleryProps {
    images: GoodImage[];
    selectedImage: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    onThumbnailClick: (index: number) => void;
}

const FullScreenGallery: React.FC<FullScreenGalleryProps> = ({
                                                                 images,
                                                                 selectedImage,
                                                                 onClose,
                                                                 onNext,
                                                                 onPrev,
                                                                 onThumbnailClick,
                                                             }) => {
    // Обработчик нажатия клавиш
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                onPrev();
            } else if (event.key === 'ArrowRight') {
                onNext();
            }
        };

        // Добавляем обработчик события keydown
        window.addEventListener('keydown', handleKeyDown);

        // Убираем обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onPrev, onNext]);

    return (
        <Modal open onClose={onClose}>
            <FullScreenGalleryContainer>
                <ThumbnailList>
                    {images.map((img, index) => (
                        <Thumbnail
                            key={index}
                            src={img.image}
                            onClick={() => onThumbnailClick(index)}
                            className={index === selectedImage ? 'active' : ''}
                        />
                    ))}
                </ThumbnailList>
                <MainImageContainer>
                    <MainImage src={images[selectedImage]?.image} />
                    <LeftButton onClick={onPrev}>
                        <ChevronLeft />
                    </LeftButton>
                    <RightButton onClick={onNext}>
                        <ChevronRight />
                    </RightButton>
                </MainImageContainer>
            </FullScreenGalleryContainer>
        </Modal>
    );
};

export default FullScreenGallery;