import { useCallback, useState } from "react";

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
  startRecording: () => void;
  stopRecording: (callback: StopRecordingCallback) => () => void;
  register: (element: HTMLVideoElement) => void;
  unregister: () => void;
} {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
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

  const startRecording = useCallback(
    (timeslice?: number | undefined) => {
      mediaRecorder?.start(timeslice);
      console.log(mediaRecorder);
    },
    [mediaRecorder]
  );

  const stopRecording = useCallback(
    (callback: StopRecordingCallback) => () => {
      if (mediaRecorder) {
        mediaRecorder.onerror = (e) => console.error(e);
        mediaRecorder.ondataavailable = ({ data: blob }: BlobEvent) => {
          callback(blob, URL.createObjectURL(blob));
        };
        mediaRecorder?.stop();
      }
    },
    [mediaRecorder]
  );

  return {
    mediaRecorder,
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
