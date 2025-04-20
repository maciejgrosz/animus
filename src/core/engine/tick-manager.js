import {
    useCamera,
    useComposer,
    useControls,
    useRenderer,
    useScene,
} from './init.js'

import { bassRef, midRef, trebleRef } from '../audioRefs.js'

// local state for frame tracking
const localData = {
    timestamp: 0,
    timeDiff: 0,
    frame: null,
    bass: 0,
    mid: 0,
    treble: 0,
    time: 0,
}

let frameEvent = null

class TickManager extends EventTarget {
    constructor({ timestamp, timeDiff, frame } = localData) {
        super()
        this.timestamp = timestamp
        this.timeDiff = timeDiff
        this.frame = frame
    }

    startLoop() {
        console.log('🚀 TickManager: startLoop() called')

        const composer = useComposer()
        const renderer = useRenderer()
        const scene = useScene()
        const camera = useCamera()
        const controls = useControls()

        if (!renderer) {
            throw new Error('Renderer is not initialized')
        }

        let lastTimestamp = performance.now()

        const animate = (timestamp, frame) => {
            this.timestamp = timestamp ?? performance.now()
            this.timeDiff = timestamp - lastTimestamp
            lastTimestamp = timestamp

            const timeDiffCapped = Math.min(Math.max(this.timeDiff, 0), 100)

            // Update camera + postprocessing
            controls?.update()
            composer?.render()

            const eventData = {
                timestamp,
                timeDiff: timeDiffCapped,
                frame,
                bass: bassRef.current,
                mid: midRef.current,
                treble: trebleRef.current,
                time: performance.now() / 1000,
            }

            this.tick(eventData)
        }

        renderer.setAnimationLoop(animate)
    }

    tick(data) {
        Object.assign(localData, data)
        frameEvent = new MessageEvent('tick', { data: { ...localData } })
        this.dispatchEvent(frameEvent)
    }
}

export default TickManager
