import React, { useCallback, useRef, useState } from "react";
import useRecorder from "../useRecorder";

function VideoRTC() {
  const [url, setUrl] = useState("");
  const onStop = useCallback((blob, blobUrl) => {
    setUrl(blobUrl);
  }, []);

  const {
    startRecording,
    stopRecording,
    register,
    recording,
    ready,
  } = useRecorder();

  return (
    <div>
      <video ref={register} autoPlay muted>
        VideoRTC
      </video>
      {url && <video controls src={url} />}
      {!!ready && (
        <>
          <button onClick={startRecording} disabled={recording}>
            start
          </button>
          <button onClick={stopRecording(onStop)} disabled={!recording}>
            stop
          </button>
        </>
      )}

      <div>{recording ? "Recording" : "Standby"}</div>
    </div>
  );
}

export default VideoRTC;
