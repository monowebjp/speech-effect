declare global {
    interface Window {
        webkitSpeechRecognition: typeof SpeechRecognition;
    }

    interface SpeechRecognitionEvent extends Event {
        results: SpeechRecognitionResultList;
        resultIndex: number;
    }
}
