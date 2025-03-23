import { useEffect, useState } from "react";
import { useRef } from "react";

import "./App.css";

function App() {
  const [sessionTime, setSessionTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [actualTiming, setActualTiming] = useState(sessionTime * 60);
  const [swap, setSwap] = useState(false);
  const [running, setRunning] = useState(false);
  const [label, setLabel] = useState("Session");

  const beep = document.querySelector<HTMLAudioElement>("#beep");

  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    console.log("arranca", running, intervalRef);
    if (running) {
      if (actualTiming <= 0) {
        setSwap((prevSwap) => {
          beep?.play();
          const newSwap = !prevSwap;
          setLabel(newSwap ? "Break" : "Session");
          setActualTiming(60 * (newSwap ? breakTime : sessionTime));
          console.log("termino y cambio de contador");

          return newSwap;
        });
        return;
      }
      intervalRef.current = setInterval(() => {
        setActualTiming((prev) => prev - 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, actualTiming, swap, sessionTime, breakTime]);

  useEffect(() => {
    setLabel(swap ? "Break" : "Session");

    console.log("swapeado", swap);
  }, [swap]);

  useEffect(() => {
    if (!running) {
      setActualTiming(sessionTime * 60);
    }
  }, [sessionTime]);

  const calcSeconds = (val: number) => (val % 60).toString().padStart(2, "0");
  const calcMinutes = (val: number) =>
    Math.floor(val / 60)
      .toString()
      .padStart(2, "0");

  const audioReset = (audio: HTMLAudioElement | null) => {
    audio?.pause();
    audio ? (audio.currentTime = 0) : "";
  };

  return (
    <div className="max-w-5xl m-auto mt-32 w bg-blue-500 flex flex-row flex-wrap justify-around">
      <div className="bg-red-50 flex-1/2 flex flex-wrap flex-row">
        <div className="flex-1/1 text-center text-xl" id="break-label">Break Length</div>
        <button
        className="bg-"
          id="break-decrement"
          onClick={() =>
            running
              ? undefined
              : setBreakTime(breakTime > 1 ? breakTime - 1 : breakTime)
          }
        >
          -
        </button>

        <h2 className="" id="break-length">
          {breakTime}
        </h2>

        <button
          className="bg-amber-300"
          id="break-increment"
          onClick={() =>
            running
              ? undefined
              : setBreakTime(breakTime < 60 ? breakTime + 1 : breakTime)
          }
        >
          +
        </button>
      </div>

      <div className="flex-1/2">
        <div id="session-label">Session Length</div>

        <button
          id="session-decrement"
          onClick={() =>
            running
              ? undefined
              : setSessionTime(sessionTime > 1 ? sessionTime - 1 : sessionTime)
          }
        >
          -
        </button>
        <h2 id="session-length">{sessionTime}</h2>

        <button
          id="session-increment"
          onClick={() =>
            running
              ? undefined
              : setSessionTime(sessionTime < 60 ? sessionTime + 1 : sessionTime)
          }
        >
          +
        </button>
      </div>
      <h1 id="timer-label">{label}</h1>
      <h1 id="time-left">{`${calcMinutes(actualTiming)}:${calcSeconds(actualTiming)}`}</h1>
      <button id="start_stop" onClick={() => setRunning(!running)}>
        {running ? "pausar" : "continuar"}
      </button>
      <button
        id="reset"
        onClick={() => {
          setSwap(false);
          setRunning(false);
          setActualTiming(sessionTime * 60);
          setBreakTime(5);
          setSessionTime(25);
          audioReset(beep);
        }}
      >
        reset
      </button>
      <audio
        id="beep"
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </div>
  );
}

export default App;
