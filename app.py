from flask import Flask, jsonify, request, render_template
import numpy as np
import logging

app = Flask(__name__)

# Setup basic logging
logging.basicConfig(level=logging.INFO)


# Serve the frontend
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process-audio', methods=['POST'])
def process_audio():
    try:
        data = request.json

        if not data or 'audio_data' not in data:
            return jsonify({"error": "Missing 'audio_data' in request body"}), 400

        audio_data = data['audio_data']

        if not isinstance(audio_data, list) or not all(isinstance(i, (int, float)) for i in audio_data):
            return jsonify({"error": "'audio_data' must be a list of numbers"}), 400

        # Normalize audio data
        max_val = max(abs(min(audio_data)), max(audio_data))
        normalized_audio = [x / max_val for x in audio_data] if max_val > 0 else audio_data

        # Raw amplitude range
        raw_amplitude_range = max(audio_data) - min(audio_data)

        # Calculate metrics
        peak_amplitude = max(abs(x) for x in normalized_audio)
        energy = sum(x**2 for x in normalized_audio) / len(normalized_audio)
        zcr = sum(1 for i in range(1, len(normalized_audio)) if normalized_audio[i-1] * normalized_audio[i] < 0) / len(normalized_audio)

        # Signal-to-Noise Ratio (SNR)
        noise_threshold = 0.01
        signal_power = np.mean(np.square(normalized_audio))
        noise_power = np.mean(np.square([x for x in normalized_audio if abs(x) < noise_threshold]))
        snr = 10 * np.log10(max(signal_power, 1e-10) / max(noise_power, 1e-10))

        # Dominant frequency
        fft_data = np.fft.fft(normalized_audio)
        frequencies = np.fft.fftfreq(len(normalized_audio), d=1/44100)  # Assume 44.1 kHz sample rate
        magnitude_spectrum = np.abs(fft_data)
        valid_indices = (frequencies > 0) & (frequencies < 22050)  # Limit to valid range
        dominant_frequency = frequencies[valid_indices][np.argmax(magnitude_spectrum[valid_indices])]

        # Determine sound type
        if raw_amplitude_range > 1:  # Clearly loud
            sound_type = "Loud (e.g., clap)"
        elif raw_amplitude_range < 0.1:  # Clearly quiet
            sound_type = "Quiet (e.g., silence)"
        else:
            # Ambiguous case - refine with energy and SNR
            if energy > 0.005 or snr > 20:
                sound_type = "Loud (e.g., clap)"
            else:
                sound_type = "Quiet (e.g., silence)"

        # Logging
        response = {
            "raw_amplitude_range": float(raw_amplitude_range),
            "peak_amplitude": float(peak_amplitude),
            "energy": float(energy),
            "zcr": float(zcr),
            "snr": float(snr),
            "dominant_frequency": float(dominant_frequency),
            "sound_type": sound_type
        }
        logging.info(
            f"Classification Decision: raw_amplitude_range={raw_amplitude_range}, energy={energy}, snr={snr}, sound_type={sound_type}")

        return jsonify(response), 200

    except Exception as e:
        logging.error(f"Error processing audio: {e}")
        return jsonify({"error": "Internal Server Error"}), 500





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)