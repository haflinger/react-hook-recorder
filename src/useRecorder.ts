import { useCallback, useEffect, useState } from "react";

const defaultContraints: MediaStreamConstraints = {
  audio: true,
  video: true,
};

type MediaRecorderOptions = {
  mimeType?: string;
  audioBitsPerSecond?: number;
  videoBitsPerSecond?: number;
  bitsPerSecond?: number;
};

type StopRecordingCallback = (blob: Blob, url: string) => void;

function useRecorder(
  mediaStreamConstraints?: Partial<MediaStreamConstraints>,
  mediaRecorderOptions?: Partial<MediaRecorderOptions>
): {
  mediaRecorder?: MediaRecorder;
  stream?: MediaStream;
  state?: RecordingState;
  startRecording: () => void;
  stopRecording: (callback: StopRecordingCallback) => () => void;
  register: (element: HTMLVideoElement) => void;
  unregister: () => void;
} {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [state, setState] = useState<RecordingState>();
  const [stream, setStream] = useState<MediaStream>();
  const [element, setElement] = useState<HTMLVideoElement | HTMLAudioElement>();

  const initStream = useCallback(
    async (element: HTMLVideoElement | HTMLAudioElement) => {
      if (!element) {
        return null;
      }

      const stream = await navigator.mediaDevices?.getUserMedia({
        ...defaultContraints,
        ...(mediaStreamConstraints ? { ...mediaStreamConstraints } : {}),
      });

      setStream(stream);

      element.srcObject = stream;

      setElement(element);

      return stream;
    },
    [mediaStreamConstraints]
  );

  const initMediaRecorder = useCallback(
    (stream: MediaStream) => {
      if (
        mediaRecorderOptions?.mimeType &&
        !MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)
      ) {
        console.warn(
          `MIME type ${mediaRecorderOptions.mimeType} not supported`
        );
      }

      const recorder = new MediaRecorder(
        stream,
        { ...mediaRecorderOptions } || {}
      );

      setMediaRecorder(recorder);
    },
    [mediaRecorderOptions]
  );

  const register = useCallback(
    async (element: HTMLVideoElement | HTMLAudioElement) => {
      if (element) {
        const stream = await initStream(element);
        return stream ? initMediaRecorder(stream) : null;
      }

      if (!element) {
        throw new Error("Please provide a valid element");
      }
    },
    [initMediaRecorder, initStream]
  );

  const unregister = useCallback(() => {
    if (element) {
      element.pause();
      element.src = "";
    }
    const tracks = stream?.getTracks();
    if (tracks && tracks?.length > 0) {
      tracks.forEach((track) => track.stop());
    }
    setMediaRecorder(undefined);
    setElement(undefined);
    setStream(undefined);
  }, [stream, element]);

  const startRecording = useCallback(() => {
    mediaRecorder?.start();
  }, [mediaRecorder]);

  const stopRecording = useCallback(
    (callback: StopRecordingCallback) => () => {
      const onData = (event: Event) => {
        const { data: blob } = event as BlobEvent;
        mediaRecorder?.removeEventListener("dataavailable", onData);
        callback(blob, URL.createObjectURL(blob));
      };
      mediaRecorder?.addEventListener("dataavailable", onData);
      mediaRecorder?.stop();
    },
    [mediaRecorder]
  );

  useEffect(() => {
    const events = ["pause", "resume", "start", "stop"];

    const onEvent = (event: Event) => {
      setState((current) => {
        const next = (event.target as MediaRecorder).state;
        return next !== current ? next : current;
      });
    };

    events.forEach((event) => mediaRecorder?.addEventListener(event, onEvent));

    return () => {
      events.forEach((event) =>
        mediaRecorder?.removeEventListener(event, onEvent)
      );
    };
  }, [mediaRecorder]);

  return {
    mediaRecorder,
    state,
    stream,
    startRecording,
    stopRecording,
    register,
    unregister,
  };
}

export const useAudioRecorder = (options?: Partial<MediaRecorderOptions>) =>
  useRecorder({ audio: true, video: false }, options);

export const useVideoRecorder = (options?: Partial<MediaRecorderOptions>) =>
  useRecorder({ audio: false, video: true }, options);

export default useRecorder;
