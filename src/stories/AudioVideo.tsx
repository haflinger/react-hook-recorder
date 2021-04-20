import React, { useCallback, useState } from "react";
import useRecorder, { RecorderStatus } from "../useRecorder";

function AudioVideo() {
  const [url, setUrl] = useState("");
  const onStop = useCallback((blob, blobUrl) => {
    setUrl(blobUrl);
  }, []);

  const { startRecording, stopRecording, register, status } = useRecorder();

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
      {status !== RecorderStatus.INIT && (
        <>
          <button
            onClick={startRecording}
            disabled={status === RecorderStatus.RECORDING}
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording(onStop)}
            disabled={status !== RecorderStatus.RECORDING}
          >
            Stop Recording
          </button>
        </>
      )}
      <div>
        <strong>Status :</strong>&nbsp;
        {status}
      </div>
    </div>
  );
}

export default AudioVideo;
