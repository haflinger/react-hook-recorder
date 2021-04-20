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

type StopRecordingCallback = (blob: Blob, url: String) => void;

export enum RecorderStatus {
  "IDLE" = "idle",
  "INIT" = "init",
  "RECORDING" = "recording",
}

export enum RecorderError {
  "STREAM_INIT" = "stream-init",
  "RECORDER_INIT" = "recorder-init",
}

function useRecorder(
  mediaStreamConstraints?: Partial<MediaStreamConstraints>,
  mediaRecorderOptions?: Partial<MediaRecorderOptions>
) {
  const mediaRecorderRef = useRef<MediaRecorder>();
  const streamRef = useRef<MediaStream>();
  const [status, setStatus] = useState<RecorderStatus>(RecorderStatus.INIT);
  const [error, setError] = useState<RecorderError>();

  const register = useCallback((element: HTMLVideoElement) => {
    initStream(element).then(initMediaRecorder).catch(setError);
  }, []);

  const startRecording = useCallback(() => {
    setStatus(RecorderStatus.RECORDING);
    mediaRecorderRef.current?.start();
  }, []);

  const stopRecording = useCallback(
    (callback: StopRecordingCallback) => () => {
      setStatus(RecorderStatus.IDLE);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.ondataavailable = ({
          data: blob,
        }: BlobEvent) => {
          callback(blob, URL.createObjectURL(blob));
        };
        mediaRecorderRef.current?.stop();
      }
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
    } catch (err) {
      throw new Error(RecorderError.STREAM_INIT);
    }
  }, []);

  const initMediaRecorder = useCallback((stream: MediaStream) => {
    if (
      mediaRecorderOptions?.mimeType &&
      !MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)
    ) {
      console.warn(`MIME type ${mediaRecorderOptions.mimeType} not supported`);
    }

    try {
      const recorder = new MediaRecorder(
        stream,
        { ...mediaRecorderOptions } || {}
      );
      mediaRecorderRef.current = recorder;
      setStatus(RecorderStatus.IDLE);
    } catch {
      throw new Error(RecorderError.RECORDER_INIT);
    }
  }, []);

  if (!navigator.mediaDevices) {
    throw new Error("Navigator is not compatible");
  }

  return {
    mediaRecorder: mediaRecorderRef?.current,
    stream: streamRef?.current,
    startRecording,
    stopRecording,
    register,
    status,
    error,
  };
}

export default useRecorder;
