# react-hook-recorder

A simple react hook using [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder)

## Demo

https://codesandbox.io/s/react-hook-recorder-gbz6z

## Example

```javascript
import { useState, useCallback } from "react";
import useRecorder from "react-hook-recorder";

function Recorder() {
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

export default Recorder;
```

## API

### _`useRecorder`_

#### `Args` (mediaStreamConstraints: MediaStreamConstraints, mediaRecorderOptions: MediaRecorderOptions)

| Property               | Required | Type     | Description                                                                                                |
| ---------------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| mediaStreamConstraints | false    | `object` | [`MediaStreamConstraints`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints) object |
| mediaRecorderOptions   | false    | `object` | [`MediaRecorder`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder) object     |

#### `Returns` (object)

| Property       | Type            | Description                        |
| -------------- | --------------- | ---------------------------------- |
| mediaRecorder  | `MediaRecorder` | MediaRecorder instance ref         |
| startRecording | `function`      | function to start recording        |
| stopRecording  | `function`      | function to stop recording         |
| register       | `function`      | function to register video element |
| ready          | `boolean`       | true when stream is ready          |
