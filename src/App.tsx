import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { Howl } from 'howler';
import Typed from 'typed.js';
import { Mail } from 'lucide-react';
import { cards, initialMusic } from './data';

function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const typedRef = useRef<Typed | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Howl | null>(null);

  const envelopeAnimation = useSpring({
    transform: isEnvelopeOpen ? 'scale(0) rotate(720deg)' : 'scale(1) rotate(0deg)',
    opacity: isEnvelopeOpen ? 0 : 1,
    config: config.molasses,
  });

  const contentAnimation = useSpring({
    transform: isEnvelopeOpen ? 'scale(1)' : 'scale(0)',
    opacity: isEnvelopeOpen ? 1 : 0,
    delay: isEnvelopeOpen ? 500 : 0,
    config: config.gentle,
  });

  const fadeAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    reset: true,
    key: currentCard,
  });

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    soundRef.current = new Howl({
      src: [initialMusic],
      loop: true,
      volume: 0.5,
      autoplay: true,
    });
  };

  useEffect(() => {
    if (textRef.current && isEnvelopeOpen) {
      if (typedRef.current) {
        typedRef.current.destroy();
      }

      typedRef.current = new Typed(textRef.current, {
        strings: [cards[currentCard].text],
        typeSpeed: 50,
        showCursor: true,
        cursorChar: '|',
      });
    }

    if (currentCard === 6 && soundRef.current && isEnvelopeOpen) {
      soundRef.current.unload();
      soundRef.current = new Howl({
        src: [cards[6].music!],
        loop: true,
        volume: 0.5,
        autoplay: true,
      });
    }

    return () => {
      typedRef.current?.destroy();
    };
  }, [currentCard, isEnvelopeOpen]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(./public/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(10px)',
        filter: 'grayscale(30%)',
        transition: 'filter 0.5s ease-in-out, backdrop-filter 0.5s ease-in-out',
      }}>
      {!isEnvelopeOpen ? (
        <animated.div
          style={envelopeAnimation}
          onClick={handleEnvelopeOpen}
          className="cursor-pointer group"
        >
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-16 transform transition-transform group-hover:scale-105">
            <Mail className="w-32 h-32 text-rose-500 animate-bounce" />
            <p className="text-2xl font-serif text-rose-600 mt-4 text-center">
              Click to Open
            </p>
          </div>
        </animated.div>
      ) : (
        <animated.div 
          style={contentAnimation}
          className="max-w-4xl w-full bg-black bg-opacity-[2px] rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="relative h-[60vh] md:h-[70vh]">
            {currentCard === 14 ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl mb-8">
                  <img 
                    src={cards[currentCard].image}
                    alt="Special photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  ref={textRef}
                  className="text-white text-2xl md:text-4xl text-center font-serif"
                ></div>
              </div>
            ) : (
              <>
                <img 
                  src={cards[currentCard].image}
                  alt="Card background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-8">
                  <div 
                    ref={textRef}
                    className="text-white text-2xl md:text-4xl text-center font-serif"
                  ></div>
                </div>
              </>
            )}
          </div>

          <div className="p-6 bg-black/0 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentCard === 0}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600 transition-colors"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentCard === cards.length - 1}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600 transition-colors"
            >
              Next
            </button>
          </div>
        </animated.div>
      )}
    </div>
  );
}

export default App;