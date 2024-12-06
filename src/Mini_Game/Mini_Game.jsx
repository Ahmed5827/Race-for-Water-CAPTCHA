import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import "./Mini_Game.css";

function Mini_Game({ letters, onWordChange }) {
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [lines, setLines] = useState([]);
    const [currentMousePos, setCurrentMousePos] = useState(null);
    const circleRef = useRef(null);
    const letterRefs = useRef([]); // Array of refs, one per letter
    const svgRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.button === 0) {
            e.preventDefault();
            setIsMouseDown(true);
            setSelectedLetters([]); // Clear selected letters on new drag
            setLines([]);
            setCurrentMousePos(null);
        }
    };

    const handleMouseUp = (e) => {
        if (e.button === 0) {
            setIsMouseDown(false);
            setCurrentMousePos(null);
            setLines([]);
            // Send the selected word to the parent component
            onWordChange(selectedLetters.map(item => item.letter).join(""));
        }
    };

    const handleMouseMove = (e) => {
        if (!isMouseDown) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;
        setCurrentMousePos({ x: mouseX, y: mouseY });

        let closestLetterIndex = null;

        // Check if the mouse is within a letter's bounding box
        letterRefs.current.forEach((letterRef, index) => {
            if (letterRef) { // Check for null or undefined
                const rect = letterRef.getBoundingClientRect();
                const isWithinLetter = (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                );
        
                if (isWithinLetter) {
                    closestLetterIndex = index;
                    return; // Exit early when a letter is found
                }
            }
        });

        if (closestLetterIndex !== null) {
            const closestLetter = letters[closestLetterIndex];

            // Only add the letter if it hasn't been added consecutively
            if (selectedLetters[selectedLetters.length - 1]?.index !== closestLetterIndex) {
                setSelectedLetters((prev) => [
                    ...prev,
                    { letter: closestLetter, index: closestLetterIndex }
                ]);

                if (selectedLetters.length > 0) {
                    const prevLetterRect = letterRefs.current[selectedLetters[selectedLetters.length - 1].index].getBoundingClientRect();
                    const currentLetterRect = letterRefs.current[closestLetterIndex].getBoundingClientRect();

                    const lineX1 = prevLetterRect.left + prevLetterRect.width / 2 - svgRect.left;
                    const lineY1 = prevLetterRect.top + prevLetterRect.height / 2 - svgRect.top;
                    const lineX2 = currentLetterRect.left + currentLetterRect.width / 2 - svgRect.left;
                    const lineY2 = currentLetterRect.top + currentLetterRect.height / 2 - svgRect.top;

                    setLines((prevLines) => [
                        ...prevLines,
                        {
                            x1: lineX1,
                            y1: lineY1,
                            x2: lineX2,
                            y2: lineY2,
                        },
                    ]);
                }
            }
        }
    };

    const circleDiameter = 53;
    const circleRadius = circleDiameter / 2;
    const letterRadius = circleRadius + 25;

    return (
        <div className="container" onMouseUp={handleMouseUp}>
            <svg ref={svgRef} className="svg-overlay">
                {lines.map((line, index) => (
                    <line
                        key={index}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="black"
                        strokeWidth="2"
                    />
                ))}
                {isMouseDown && selectedLetters.length > 0 && currentMousePos && (
                    <line
                        x1={
                            letterRefs.current[selectedLetters[selectedLetters.length - 1].index].getBoundingClientRect().left +
                            letterRefs.current[selectedLetters[selectedLetters.length - 1].index].getBoundingClientRect().width / 2 - svgRef.current.getBoundingClientRect().left
                        }
                        y1={
                            letterRefs.current[selectedLetters[selectedLetters.length - 1].index].getBoundingClientRect().top +
                            letterRefs.current[selectedLetters[selectedLetters.length - 1].index].getBoundingClientRect().height / 2 - svgRef.current.getBoundingClientRect().top
                        }
                        x2={currentMousePos.x}
                        y2={currentMousePos.y}
                        stroke="black"
                        strokeWidth="2"
                    />
                )}
            </svg>

            <div
                ref={circleRef}
                className="circle"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                {letters.map((letter, index) => {
                    const angle = (index * 360) / letters.length;
                    const x = circleRadius + letterRadius * Math.cos((angle * Math.PI) / 180);
                    const y = circleRadius + letterRadius * Math.sin((angle * Math.PI) / 180);

                    return (
                        <div
                            className={`letter ${selectedLetters.some(item => item.index === index) ? "selected" : ""}`}
                            key={index}
                            style={{
                                position: 'absolute',
                                left: `${x }px`,
                                top: `${y }px`,
                                transformOrigin: 'center center',
                            }}
                            ref={(el) => (letterRefs.current[index] = el)}
                        >
                            {letter}
                        </div>
                    );
                })}
            </div>

            <div className="word-display">
               <small> {selectedLetters.map(item => item.letter).join("")}</small>
            </div>
        </div>
    );
}

// Add PropTypes for validation
Mini_Game.propTypes = {
    letters: PropTypes.arrayOf(PropTypes.string).isRequired,
    onWordChange: PropTypes.func.isRequired,
};

export default Mini_Game;