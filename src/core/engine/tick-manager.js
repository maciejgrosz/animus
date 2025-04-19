import {
    useCamera,
    useComposer,
    useControls,
    useRenderer,
    useScene,
    useStats,
} from './init.js'

// local state for frame tracking
const localData = {
    timestamp: 0,
    timeDiff: 0,
    frame: null,
}

// You want the actual event object to carry this data
let frameEvent = null

class TickManager extends EventTarget {
    constructor({ timestamp, timeDiff, frame } = localData) {
        super()

        this.timestamp = timestamp
        this.timeDiff = timeDiff
        this.frame = frame
    }

    startLoop() {
        const composer = useComposer()
        const renderer = useRenderer()
        const scene = useScene()
        const camera = useCamera()
        const controls = useControls()
        const stats = useStats()

        if (!renderer) {
            throw new Error('Renderer is not initialized')
        }

        let lastTimestamp = performance.now()

        const animate = (timestamp, frame) => {
            this.timestamp = timestamp ?? performance.now()
            this.timeDiff = timestamp - lastTimestamp
            lastTimestamp = timestamp

            const timeDiffCapped = Math.min(Math.max(this.timeDiff, 0), 100)

            // Update camera controls
            controls?.update()

            // Render scene through composer (postprocessing)
            composer?.render()

            // Call tick with frame data
            this.tick(timestamp, timeDiffCapped, frame)

            // FPS monitor
            stats?.update()
        }

        renderer.setAnimationLoop(animate)
    }

    tick(timestamp, timeDiff, frame) {
        localData.timestamp = timestamp
        localData.frame = frame
        localData.timeDiff = timeDiff

        // Dispatch a new MessageEvent with updated data
        frameEvent = new MessageEvent('tick', { data: { ...localData } })
        this.dispatchEvent(frameEvent)
    }
}

export default TickManager
