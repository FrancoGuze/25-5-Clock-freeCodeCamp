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
    <div className="max-w-2xl m-auto px-3 pb-12 mt-32 min-h-120 rounded-4xl border-8 border-primary-900 shadow-2xl shadow-secondary-800 bg-primary-800 flex flex-row flex-wrap  justify-around gap-y-6">
      <h1 className=" text-5xl h-fit flex-1/1 text-center text-zinc-300 mt-6 ">
        25 + 5 Clock
      </h1>
      <div className="text-zinc-300 w-48 p-1.5 rounded-4xl border-4 border-primary-900 bg-secondary-800 flex flex-wrap flex-row content-center self-center justify-center gap-x-6 gap-y-5.5 py-6">
        <div className="flex-1/1 text-center text-2xl" id="break-label">
          Break Length
        </div>
        <button
          className="text-5xl *:size-9 *:p-1 *:rounded-full "
          id="break-decrement"
          onClick={() =>
            running
              ? undefined
              : setBreakTime(breakTime > 1 ? breakTime - 1 : breakTime)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="bg-blue-950 transition-all duration-75 border-secondary-700 border-2 hover:bg-secondary-900 active:border-0 "
            viewBox="0 0 448 512"
          >
            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
          </svg>
        </button>

        <h2 className="text-3xl mt-2" id="break-length">
          {breakTime}
        </h2>

        <button
          className="text-5xl *:size-9 *:p-1 *:rounded-full "
          id="break-increment"
          onClick={() =>
            running
              ? undefined
              : setBreakTime(breakTime < 60 ? breakTime + 1 : breakTime)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="bg-blue-950 transition-all duration-75 border-secondary-700 border-2 hover:bg-secondary-900 active:border-0 "
            viewBox="0 0 448 512"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
        </button>
      </div>

      <div className="text-zinc-300 w-48 p-1.5 rounded-4xl border-4 border-primary-900 bg-secondary-800 flex flex-wrap flex-row content-center self-center justify-center gap-x-6 gap-y-5.5 py-6">
        <div
          className="flex-1/1 text-center text-2xl place-self-center"
          id="session-label"
        >
          Session Length
        </div>
        <button
          className="text-5xl *:size-9 *:p-1 *:rounded-full "
          id="session-decrement"
          onClick={() =>
            running
              ? undefined
              : setSessionTime(sessionTime > 1 ? sessionTime - 1 : sessionTime)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="bg-blue-950 transition-all duration-75 border-secondary-700 border-2 hover:bg-secondary-900 active:border-0 "
            viewBox="0 0 448 512"
          >
            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
          </svg>
        </button>

        <h2 className="text-3xl " id="session-length">
          {sessionTime}
        </h2>
        <button
          className="text-5xl *:size-9 *:p-1 *:rounded-full "
          id="session-increment"
          onClick={() =>
            running
              ? undefined
              : setSessionTime(sessionTime < 60 ? sessionTime + 1 : sessionTime)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="bg-blue-950 transition-all duration-75 border-secondary-700 border-2 hover:bg-secondary-900 active:border-0 "
            viewBox="0 0 448 512"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
        </button>
      </div>

      <div className=" text-zinc-300 flex-1/1 border-4 h-58 border-secondary-900 bg-secondary-800 rounded-4xl mx-5 flex flex-row flex-wrap justify-center pt-6 pb-8">
        <div className="bg-primary-900 flex h-28 flex-col items-center pt-2 pb-3 px-6 rounded-2xl border-[6px] border-primary-950">
          <h1 className="text-4xl mb-2 mt-1" id="timer-label">
            {label}
          </h1>
          <h1
            className="my-1"
            id="time-left"
          >{`${calcMinutes(actualTiming)}:${calcSeconds(actualTiming)}`}</h1>
        </div>

        <div className="flex-1/1 flex flex-row justify-center items-center gap-4 mt-5 *:min-w-28">
          <button
            className=" bg-blue-950 py-0.5 rounded-lg transition-all duration-75 border-secondary-700 border-2 hover:bg-secondary-900 active:border-0 "
            id="start_stop"
            onClick={() => setRunning(!running)}
          >
            {running ? "pausar" : "continuar"}
          </button>
          <button
            className=" bg-blue-950 py-0.5 rounded-lg transition-all duration-75 border-secondary-700 border-2 hover:bg-secondary-900 active:border-0 "
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
        </div>
      </div>
      <audio
        id="beep"
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </div>
  );
}

export default App;
