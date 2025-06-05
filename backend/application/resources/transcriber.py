import speech_recognition as sr
import threading

def transcribe():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("Press ENTER to start recording...")
    input()

    audio_chunks = []

    def callback(recognizer, audio):
        print("Received audio chunk")
        audio_chunks.append(audio)

    stop_listening = recognizer.listen_in_background(mic, callback)

    print("Recording... Speak now. Press ENTER to stop.")
    input()  

    stop_listening(wait_for_stop=False)
    print("Stopped recording. Processing...")

    if not audio_chunks:
        print("No audio captured.")
        return ""

    combined_audio = audio_chunks[0]
    for chunk in audio_chunks[1:]:
        combined_audio = sr.AudioData(combined_audio.get_raw_data() + chunk.get_raw_data(),
                                     combined_audio.sample_rate,
                                     combined_audio.sample_width)

    try:
        text = recognizer.recognize_google(combined_audio)
        print(f"Transcription: {text}")
        return text.lower()
    except sr.UnknownValueError:
        print("Could not understand audio.")
        return ""
    except sr.RequestError as e:
        print(f"Google Speech Recognition error: {e}")
        return ""
