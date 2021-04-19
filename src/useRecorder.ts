import { useCallback, useRef, useState } from "react";

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

function useRecorder(
  mediaStreamConstraints?: Partial<MediaStreamConstraints>,
  mediaRecorderOptions?: Partial<MediaRecorderOptions>
) {
  const mediaRecorderRef = useRef<MediaRecorder>();
  const streamRef = useRef<MediaStream>();
  const [recording, setRecording] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  const register = useCallback((element: HTMLVideoElement) => {
    initStream(element).then(initMediaRecorder);
  }, []);

  const startRecording = useCallback(() => {
    setRecording(true);
    mediaRecorderRef.current?.start();
  }, []);

  const stopRecording = useCallback(
    (callback: (blob: Blob, url: String) => void) => {
      return () => {
        setRecording(false);
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.ondataavailable = ({
            data: blob,
          }: BlobEvent) => {
            callback(blob, URL.createObjectURL(blob));
          };
          mediaRecorderRef.current?.stop();
        }
      };
    },
    []
  );

  const initStream = useCallback(async (videoRef: HTMLVideoElement) => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        ...defaultContraints,
        ...(mediaStreamConstraints ? { ...mediaStreamConstraints } : {}),
      });
      videoRef.srcObject = streamRef.current;
      return streamRef.current;
    } catch {
      throw new Error("Unable to get stream");
    }
  }, []);

  const initMediaRecorder = useCallback((stream: MediaStream) => {
    if (
      mediaRecorderOptions?.mimeType &&
      !MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)
    ) {
      console.warn(`MIME type ${mediaRecorderOptions.mimeType} not supported`);
    }

    const recorder = new MediaRecorder(
      stream,
      { ...mediaRecorderOptions } || {}
    );
    mediaRecorderRef.current = recorder;
    setReady(true);
  }, []);

  if (!navigator.mediaDevices) {
    throw new Error("Navigator is not compatible");
  }

  return {
    mediaRecorder: mediaRecorderRef?.current,
    startRecording,
    stopRecording,
    recording,
    register,
    ready,
  };
}

export default useRecorder;
