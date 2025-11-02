import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadFaceDetectionModels = async () => {
    if (modelsLoaded) return;

    try {
        // Load models from CDN
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights/';
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        modelsLoaded = true;
        console.log('Face detection models loaded successfully');
    } catch (error) {
        console.error('Error loading face detection models:', error);
        throw error;
    }
};

export const detectFace = async (imageElement) => {
    try {
        if (!modelsLoaded) {
            await loadFaceDetectionModels();
        }

        const detections = await faceapi
            .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

        return detections;
    } catch (error) {
        console.error('Error detecting face:', error);
        return [];
    }
};

export const hasFace = async (imageSrc) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
            try {
                const detections = await detectFace(img);
                resolve(detections.length > 0);
            } catch (error) {
                console.error('Face detection error:', error);
                resolve(false);
            }
        };
        img.onerror = () => resolve(false);
        img.src = imageSrc;
    });
};
