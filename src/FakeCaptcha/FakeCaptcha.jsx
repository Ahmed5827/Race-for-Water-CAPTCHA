import { useState, useRef, useEffect } from "react";
import "./FakeCaptcha.css"; // Assume styles are defined here
import Mini_Game from "../Mini_Game/Mini_Game";
import waterDictionary from "./Words";
import { MoonLoader } from 'react-spinners';
import { CiCircleCheck } from "react-icons/ci";

const FakeCaptcha = () => {
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);
  const [isVerifyWindowVisible, setIsVerifyWindowVisible] = useState(false);

  const checkboxWindowRef = useRef(null);
  const verifyWindowRef = useRef(null);
  const verifyWindowArrowRef = useRef(null);

  const [word, setWord] = useState({});
  const [selectedWord, setSelectedWord] = useState("");
  const [checked,setchecked] = useState(false);
  const handleWordChange = (newWord) => {
    setSelectedWord(newWord);
  };

  const getRandomWord = () => {
    const keys = Object.keys(waterDictionary);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const value = waterDictionary[randomKey];
    return { [randomKey]: value };
  };

  const handleResult = () => {
    setWord(getRandomWord());
  };

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  useEffect(() => {
    
    if (Object.keys(word)[0] === selectedWord)
    {
      console.log("winner")
      setIsVerifyWindowVisible(false)
      setchecked(true)
    }
    else{
      
      console.log("try again")
    }
  }, [selectedWord]);

  const toggleVerifyWindow = () => {
    console.log("toggleVerifyWindow called");
    setIsVerifyWindowVisible((prev) => {
      if (!prev) {
        console.log("Opening verification window");
        const verifyWindow = verifyWindowRef.current;
        const checkboxWindow = checkboxWindowRef.current;
        const verifyWindowArrow = verifyWindowArrowRef.current;

        if (verifyWindow && checkboxWindow) {
          console.log("verifyWindow and checkboxWindow found");

          // Set initial position for the verification window
          verifyWindow.style.display = "block";
          verifyWindow.style.visibility = "visible";
          verifyWindow.style.opacity = "1";
          verifyWindow.style.top = `${checkboxWindow.offsetTop - 80}px`;
          verifyWindow.style.left = `${checkboxWindow.offsetLeft + 54}px`;

          // Adjust if the window is too high
          if (verifyWindow.offsetTop < 5) {
            verifyWindow.style.top = "5px";
          }

          // Adjust if the window goes out of the right side of the viewport
          if (
            verifyWindow.offsetLeft + verifyWindow.offsetWidth >
            window.innerWidth - 10
          ) {
            verifyWindow.style.left = `${checkboxWindow.offsetLeft - 8}px`;
          }

          // Ensure the arrow is positioned relative to the checkboxWindow
          if (verifyWindowArrow) {
            console.log("verifyWindowArrow found");

            // Adjust the position of the arrow relative to the checkbox window
            const arrowOffsetTop = checkboxWindow.offsetTop + 24;
            const arrowOffsetLeft = checkboxWindow.offsetLeft + 45;

            // Apply the arrow position and visibility
            verifyWindowArrow.style.top = `${arrowOffsetTop}px`;
            verifyWindowArrow.style.left = `${arrowOffsetLeft}px`;
            verifyWindowArrow.style.visibility = "visible";
            verifyWindowArrow.style.opacity = "1";
          }
        }
      }
      return !prev;
    });
  };
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <>
      <div className="container-fluid">
        <div className="fkrc-container fkrc-m-p">
          <div
            ref={checkboxWindowRef}
            className="checkboxWindowRef fkrc-m-p fkrc-block"
          >
            <div className="checkboxBtnRef-container fkrc-m-p">
              { (checked)? <CiCircleCheck size={50} style={{marginTop : "50%" , color:"green" }  }/>: (isVerifyWindowVisible)? <MoonLoader size={60} /> :              <button
                type="button"
                id="checkboxBtnRef"
                className="checkboxBtnRef fkrc-m-p fkrc-line-normal"
                onClick={() => {
                  console.log("Button clicked!");
                  toggleVerifyWindow();
                }}
              ></button>}

            </div>
            <p className="fkrc-im-not-a-robot fkrc-m-p fkrc-line-normal">
              {(checked)? "verified":"I'm not a robot"}

            </p>

            <img
              src="captcha_logo.svg"
              className="fkrc-captcha-logo fkrc-line-normal"
              alt="captcha logo"
            />
            <p className="checkboxBtnRef-desc fkrc-m-p fkrc-line-normal">
              CAPTCHA
            </p>
            <p className="checkboxBtnRef-desc fkrc-m-p fkrc-line-normal">
              Privacy - Terms
            </p>
          </div>
        </div>

        {isVerifyWindowVisible && (
          <div >
            
          <div
            id="verifyWindowRef"
            className="verifyWindowRef"
            style={{ position: "absolute", top: "30px", left: "50px"  }}
          >
            
            <div className="fkrc-verifywin-container">
              <header className="fkrc-verifywin-header">
                <span className="fkrc-verifywin-header-text-medium fkrc-m-p fkrc-block">
                Mini Game captcha
                </span>
                <span className="fkrc-verifywin-header-text-big fkrc-m-p fkrc-block">
                Guess the word
                </span>
                <span className="fkrc-verifywin-header-text-medium fkrc-m-p fkrc-block">
                { "Hint : " +Object.values(word)[0] }
                </span>
              </header>
              <div className="fkrc-verifywin-main">
                <div style={{ paddingBottom: "2%", paddingTop: "2%" }}>
                  <Mini_Game
                    letters={Object.keys(word)[0].split("")}
                    onWordChange={handleWordChange}
                  />
                </div>
              </div>

              <footer className="fkrc-verifywin-footer">
                <div className="fkrc-verifywin-footer-left">
                  {'Press the "Again" to get a new word.'}
                </div>
                <button
                  type="button"
                  className="fkrc-verifywin-verify-button fkrc-block"
                  id="fkrc-verifywin-verify-button"
                  onClick={handleResult}
                >
                  Again
                </button>
              </footer>
            </div>
            <img
              src="captcha_arrow.svg"
              alt="arrow"
              className="verifyWindowArrowRef"
              id="verifyWindowArrowRef"
              ref={verifyWindowArrowRef}
            />
          </div>
          </div>
        )}

        <div style={{ paddingBottom: "2%", paddingTop: "2%" }}>
          {checkboxDisabled && (
            <Mini_Game
              letters={shuffleArray(Object.keys(word)[0].toLowerCase().split(""))}
              onWordChange={handleWordChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FakeCaptcha;
