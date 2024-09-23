"use client";

import { useEffect, useRef, useState } from "react";
import Search from "@/components/ui/search";

const languages = [{ text: "ज्ञान भंडार" }, { text: "ಜ್ಞಾನ ಭಂಡಾರ" }];

export default function HeroSection() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true); // New state to track typing status

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroElement = heroRef.current;

      if (heroElement) {
        const scrollFactor = scrollPosition / window.innerHeight;
        heroElement.style.transform = `perspective(1000px) rotateX(${
          scrollFactor * 10
        }deg) translateZ(${scrollFactor * -200}px)`;
        heroElement.style.opacity = 1 - scrollFactor * 0.5;
      }
    };

    const typingEffect = () => {
      const currentText = languages[currentLanguageIndex].text;

      if (isTyping) {
        if (typedText.length < currentText.length) {
          setTypedText((prev) => prev + currentText[typedText.length]);
        } else {
          setIsTyping(false); // Stop typing when full text is displayed
          setTimeout(() => {
            setCurrentLanguageIndex((prev) => (prev + 1) % languages.length);
            setTypedText(""); // Reset typed text for the next language
            setIsTyping(true); // Start typing the next language
          }, 1300); // Wait before starting the next language
        }
      }
    };

    const typingInterval = setInterval(typingEffect, 100); // Speed of typing

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(typingInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [typedText, currentLanguageIndex, isTyping]);

  return (
    <section
      ref={heroRef}
      className="w-full py-12 md:py-24 bg-black flex flex-col items-center justify-center transition-transform duration-500 ease-out"
    >
      <div className="text-center space-y-6 px-4 sm:px-6 md:px-8 lg:px-12">
        <h1
          ref={titleRef}
          className="text-center font-extrabold tracking-tight text-white leading-tight transition-opacity duration-300 ease-in-out"
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to
          </span>
          <span
            className="block text-6xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
            style={{ minHeight: "90px" }}
          >
            {typedText}
          </span>
          (Jñāna Bhāṇḍāra)
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2">
            <span className="ml-2" aria-hidden="true">
              📚
            </span>
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-indigo-300 mt-4">
            Connecting with knowledge
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-indigo-300 mt-2">
            like never before
          </span>
        </h1>
        <div className="flex flex-col items-center mt-8 w-full">
          <div className="w-full max-w-lg">
            <Search placeholder="Find your next read..." searchButton={true} />
          </div>
        </div>
        <p
          ref={descriptionRef}
          className="mx-auto max-w-[80%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] text-gray-400 md:text-lg lg:text-xl leading-relaxed transition-opacity duration-300 ease-in-out"
        >
          Explore. Discover. Immerse yourself in the world of knowledge with our
          intuitive and powerful library management system.
        </p>
      </div>
    </section>
  );
}
