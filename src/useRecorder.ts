import { useCallback, useEffect, useRef, useState } from "react";

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
  constraints?: Partial<MediaStreamConstraints>,
  options?: Partial<MediaRecorderOptions>
) {
  const videoRef = useRef<HTMLVideoElement>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const streamRef = useRef<MediaStream>();
  const [recording, setRecording] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  const register = useCallback((element: HTMLVideoElement) => {
    videoRef.current = element;
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

  const initStream = useCallback(async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        ...defaultContraints,
        ...(constraints ? { ...constraints } : {}),
      });
      if (videoRef?.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      return streamRef.current;
    } catch {
      throw new Error("Unable to get stream");
    }
  }, []);

  const initMediaRecorder = useCallback((stream: MediaStream) => {
    if (options?.mimeType && !MediaRecorder.isTypeSupported(options.mimeType)) {
      console.warn(`MIME type ${options.mimeType} not supported`);
    }

    const recorder = new MediaRecorder(stream, { ...options } || {});
    mediaRecorderRef.current = recorder;
    setReady(true);
  }, []);

  useEffect(() => {
    initStream().then(initMediaRecorder);
  }, [initStream, initMediaRecorder]);

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
