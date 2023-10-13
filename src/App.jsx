import { useRef, useEffect, useState } from "react";
import "./App.css";
import * as faceapi from "face-api.js";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();

  const [amount, setAmount] = useState(0);

  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  // OPEN YOU FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // LOAD MODELS FROM FACE API

  const loadModels = () => {
    faceapi.nets.tinyFaceDetector.loadFromUri("/models").then(faceMyDetect);
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length !== amount) {
        setAmount(detections.length);
      }

      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 720,
        height: 560,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 720,
        height: 560,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
    }, 100);
  };

  return (
    <div className="myapp">
      <h1>Face Detection</h1>
      <div className="appvide">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
      <p>
        {amount === 0
          ? "There are no faces in the frame"
          : amount === 1
          ? "There is 1 face in the frame"
          : `There are ${amount} faces in the frame`}
      </p>
      <canvas ref={canvasRef} width="720" height="560" className="appcanvas" />
    </div>
  );
}

export default App;
