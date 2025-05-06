// useMIDI.js
import { useEffect } from 'react';

export default function useMIDI(onMIDIMessage) {
    useEffect(() => {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then((midiAccess) => {
                for (let input of midiAccess.inputs.values()) {
                    input.onmidimessage = onMIDIMessage;
                }
            });
        } else {
            console.warn("Web MIDI not supported in this browser.");
        }
    }, [onMIDIMessage]);
}
