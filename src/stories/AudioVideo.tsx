import React, { useCallback, useState } from "react";
import useRecorder from "../useRecorder";

function AudioVideo(): React.ReactElement {
  const [url, setUrl] = useState("");
  const onStop = useCallback((_, blobUrl) => {
    setUrl(blobUrl);
  }, []);

  const {
    startRecording,
    stopRecording,
    register,
    unregister,
    mediaRecorder,
    state,
  } = useRecorder();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <video
        ref={register}
        autoPlay
        muted
        playsInline
        style={{ width: 300, height: 300, background: "#000" }}
      />

      {url && (
        <>
          Recorded video&nbsp;:
          <video controls src={url} style={{ width: 300, height: 300 }} />
        </>
      )}
      {!!mediaRecorder && (
        <>
          <button onClick={startRecording} disabled={state === "recording"}>
            Start Recording
          </button>
          <button
            onClick={stopRecording(onStop)}
            disabled={state !== "recording"}
          >
            Stop Recording
          </button>
          <button onClick={() => unregister()} disabled={state === "recording"}>
            Unregister
          </button>
        </>
      )}
    </div>
  );
}

export default AudioVideo;
