import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  X,
  Image as ImageIcon,
} from 'lucide-react';

const ImageSlider = ({ images = [], topicTitle = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const sliderRef = useRef(null);

  if (!images || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectImage = (idx) => {
    setCurrentIndex(idx);
  };

  const handleOpenLightbox = (img) => {
    setLightboxImage(img);
    setFullscreenOpen(true);
  };

  return (
    <div className="space-y-4" ref={sliderRef}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-yellowSubtle border border-brand-yellowBorder text-brand-dark">
            <ImageIcon className="w-5 h-5 text-brand-yellow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">
                Visual Concept Slider
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-brand-yellow text-brand-dark text-[10px] font-black uppercase">
                {images.length} {images.length === 1 ? 'Diagram' : 'Diagrams'}
              </span>
            </div>
            <p className="text-xs text-brand-textSecondary">
              Interactive visual diagrams for {topicTitle}
            </p>
          </div>
        </div>

        {/* Quick jump pills if multiple images */}
        {images.length > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-textSecondary uppercase mr-1">
              Jump to:
            </span>
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectImage(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentIndex === idx
                    ? 'bg-brand-dark text-brand-yellow shadow-sm scale-105'
                    : 'bg-brand-surfaceHover text-brand-textSecondary hover:text-brand-dark hover:bg-brand-border'
                }`}
              >
                Image {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Interactive Carousel */}
      <div className="space-y-3">
        <div className="relative bg-gradient-to-b from-[#181614] via-[#110F0E] to-[#0A0908] rounded-2xl overflow-hidden border-2 border-brand-dark shadow-xl flex items-center justify-center min-h-[300px] sm:min-h-[400px] p-4 sm:p-6 group">
          {/* Top Left: Slide Counter Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-brand-yellow text-brand-dark font-black text-xs rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Visual {currentIndex + 1} of {images.length}
              </span>
            </span>
          </div>

          {/* Top Right: Lightbox Expand */}
          <button
            type="button"
            onClick={() => handleOpenLightbox(currentImg)}
            className="absolute top-4 right-4 z-10 p-2.5 bg-black/70 hover:bg-brand-yellow hover:text-brand-dark text-white rounded-xl backdrop-blur-sm transition-all border border-white/10 shadow-lg active:scale-95"
            title="Expand Image to Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Current Displayed Image */}
          <div className="w-full flex items-center justify-center">
            <img
              src={currentImg.url}
              alt={currentImg.title || `Visual diagram ${currentIndex + 1}`}
              className="max-h-[340px] sm:max-h-[440px] w-auto max-w-full object-contain mx-auto rounded-xl drop-shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => handleOpenLightbox(currentImg)}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-brand-yellow text-brand-dark flex items-center justify-center shadow-xl transition-all active:scale-90 z-10 border border-brand-dark/10"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-brand-yellow text-brand-dark flex items-center justify-center shadow-xl transition-all active:scale-90 z-10 border border-brand-dark/10"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Dots */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-1">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-200 ${
                  currentIndex === idx
                    ? 'w-8 h-2.5 bg-brand-yellow rounded-full shadow-sm'
                    : 'w-2.5 h-2.5 bg-[#D5CEBF] hover:bg-brand-dark rounded-full'
                }`}
                aria-label={`Jump to visual ${idx + 1}`}
                title={`Visual ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setFullscreenOpen(false)}
        >
          <button
            type="button"
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white text-brand-dark rounded-full transition-colors z-50 shadow-xl"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage ? lightboxImage.url : currentImg.url}
            alt="Expanded visual diagram"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
