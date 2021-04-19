# react-hook-recorder

A simple react hook using [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder)

## Preview

https://codesandbox.io/s/react-hook-recorder-gbz6z

## Example

```javascript
import useRecorder from "react-hook-recorder";

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
```
