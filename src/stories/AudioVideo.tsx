import React, { useCallback, useState } from "react";
import useRecorder, { RecorderStatus } from "../useRecorder";

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
    status,
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
      {status !== RecorderStatus.INIT && (
        <>
          <button
            onClick={startRecording}
            disabled={[
              RecorderStatus.RECORDING,
              RecorderStatus.UNREGISTERED,
            ].includes(status)}
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording(onStop)}
            disabled={[
              RecorderStatus.IDLE,
              RecorderStatus.UNREGISTERED,
            ].includes(status)}
          >
            Stop Recording
          </button>
          <button
            onClick={() => unregister()}
            disabled={[
              RecorderStatus.INIT,
              RecorderStatus.UNREGISTERED,
              RecorderStatus.RECORDING,
            ].includes(status)}
          >
            Unregister
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
