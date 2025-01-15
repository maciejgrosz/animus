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

        logging.info(f"Received audio data length: {len(audio_data)}")
        if len(audio_data) == 0:
            logging.error("Empty audio data received on backend.")

        if not isinstance(audio_data, list) or not all(isinstance(i, (int, float)) for i in audio_data):
            return jsonify({"error": "'audio_data' must be a list of numbers"}), 400

        # Normalize audio data
        max_val = max(abs(min(audio_data)), max(audio_data))
        normalized_audio = [x / max_val for x in audio_data] if max_val > 0 else audio_data

        # Metrics for Visualization
        peak_amplitude = max(abs(x) for x in normalized_audio)
        energy = sum(x**2 for x in normalized_audio) / len(normalized_audio)
        zcr = sum(1 for i in range(1, len(normalized_audio)) if normalized_audio[i-1] * normalized_audio[i] < 0) / len(normalized_audio)

        # FFT for frequency spectrum
        fft_data = np.fft.fft(normalized_audio)
        frequencies = np.fft.fftfreq(len(normalized_audio), d=1 / 44100)  # Assume 44.1 kHz sample rate
        magnitude_spectrum = np.abs(fft_data)
        valid_indices = (frequencies >= 0) & (frequencies < 22050)  # Only positive frequencies below Nyquist
        dominant_frequency = frequencies[valid_indices][np.argmax(magnitude_spectrum[valid_indices])]

        # Prepare frequency bands for visualization (reduce resolution)
        bands = np.linspace(0, len(magnitude_spectrum[valid_indices]) - 1, 32, dtype=int)  # 32 bands
        band_energies = [np.mean(magnitude_spectrum[valid_indices][b:b + 1]) for b in bands]

        # Construct response
        response = {
            "peak_amplitude": float(peak_amplitude),
            "energy": float(energy),
            "zcr": float(zcr),
            "dominant_frequency": float(dominant_frequency),
            "frequency_bands": [float(energy) for energy in band_energies]
        }

        logging.info(f"Audio Analysis: {response}")
        return jsonify(response), 200

    except Exception as e:
        logging.error(f"Error processing audio: {e}")
        return jsonify({"error": "Internal Server Error"}), 500





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)