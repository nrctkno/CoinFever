class Engine {
    #audio
    #scene
    #canvas

    /**
     * @param {Canvas} canvas
     */
    constructor(canvas) {
        this.#audio = new AudioManager()
        this.#scene = new SceneManager(this)
        this.#canvas = canvas
        this.registerKeyboardEvents()
    }

    registerKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.#scene.keyDown(e)
        })
        document.addEventListener('keyup', (e) => {
            this.#scene.keyUp(e)
        })
    }

    audio() {
        return this.#audio
    }

    scene() {
        return this.#scene
    }

    canvas() {
        return this.#canvas
    }

    checkCollision(obj1, obj2) {
        return obj1.pos.x < obj2.pos.x + obj2.size.x &&
            obj1.pos.x + obj1.size.x > obj2.pos.x &&
            obj1.pos.y < obj2.pos.y + obj2.size.y &&
            obj1.pos.y + obj1.size.y > obj2.pos.y
    }

    loadAssets(definitions) {
        const assets = {}
        for (const [name, def] of Object.entries(definitions)) {
            if (def instanceof AudioDefinition) {
                const audio = new Audio(def.src)
                audio.loop = def.loop || false
                assets[name] = audio
                continue
            } else if (def instanceof ImageDefinition) {
                const image = new Image()
                image.src = def.src
                assets[name] = image
            } else {
                console.warn(`Unknown asset type for ${name}:`, def)
                continue
            }
        }
        return assets
    }

    run() {
        const loop = (currentTime) => {
            this.#scene.tick(currentTime)
            this.#scene.render()
            requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
    }
}

class AssetDefinition {

    constructor(src) {
        this.src = src
    }
}

class ImageDefinition extends AssetDefinition {

    constructor(src) {
        super(src)
    }
}

class AudioDefinition extends AssetDefinition {

    constructor(src, loop = false) {
        super(src)
        this.loop = loop
    }
}

class AudioManager {

    constructor() {
    }

    play(audio) {
        audio.currentTime = 0
        audio.play().catch(e => console.log("Audio play failed:", e))
    }

    stop(audio) {
        audio.pause()
        audio.currentTime = 0
    }
}

class Scene {

    /**
     * @param {SceneManager} manager
     */
    constructor(manager) {
        this.manager = manager
    }

    setup() {}
    tearDown() {}
    onRender() {}
    onTick(currentTime) {}
    onKeyDown(event) {}
    onKeyUp(event) {}
}

class SceneManager {
    #engine
    #currentScene
    #previousScene

    /**
     * @param {Engine} engine
     */
    constructor(engine) {
        this.#engine = engine
        this.#currentScene = null
        this.#previousScene = null
    }

    engine() {
        return this.#engine
    }

    previousScene() {
        return this.#previousScene
    }

    change(newSceneClass, ...args) {
        if (this.#currentScene) {
            this.#currentScene.tearDown()
        }
        this.#previousScene = this.#currentScene
        this.#currentScene = new newSceneClass(this, ...args)
        this.#currentScene.setup()
    }

    tick(currentTime) {
        if (this.#currentScene) {
            this.#currentScene.onTick(currentTime)
        }
    }

    render() {
        if (this.#currentScene) {
            this.#currentScene.onRender()
        }
    }

    keyDown(event) {
        if (this.#currentScene) {
            this.#currentScene.onKeyDown(event)
        }
    }

    keyUp(event) {
        if (this.#currentScene) {
            this.#currentScene.onKeyUp(event)
        }
    }
}

class Canvas {

    constructor() {
        if (new.target === Canvas) {
            throw new TypeError("Cannot construct Canvas instances directly")
        }
    }

    clear() {
        throw new Error("Method 'clear()' must be implemented.")
    }

    image(image, x, y, width, height) {
        throw new Error("Method 'drawImage()' must be implemented.")
    }

    rect(x, y, width, height, fillStyle) {
        throw new Error("Method 'drawRect()' must be implemented.")
    }

    text(text, x, y, font = "16px sans-serif", fillStyle = "#000") {
        throw new Error("Method 'drawText()' must be implemented.")
    }

    size() {
        throw new Error("Method 'size()' must be implemented.")
    }

    gradient(x0, y0, x1, y1, colorStopPairs) {
        throw new Error("Method 'gradient()' must be implemented.")
    }
}

class Web2dCanvas extends Canvas {
    constructor(canvasElement) {
        super()
        this.canvasElement = canvasElement
        this.context = canvasElement.getContext('2d')
    }

    clear() {
        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
    }

    /**
     *
     * @param {Image} image
     * @param {Point} pos
     * @param {Point} size
     */
    image(image, pos, size) {
        this.context.drawImage(image, pos.x, pos.y, size.x, size.y)
    }

    /**
     * @param {Point} pos
     * @param {Point} size
     */
    rect(pos, size, fillStyle) {
        this.context.fillStyle = fillStyle
        this.context.fillRect(pos.x, pos.y, size.x, size.y)
    }

    /**
     * @param {string} text
     * @param {Point} pos
     */
    text(text, pos, font = "16px sans-serif", fillStyle = "#000", align = "left") {
        this.context.font = font
        this.context.fillStyle = fillStyle
        this.context.textAlign = align
        this.context.fillText(text, pos.x, pos.y)
    }

    size() {
        return Point.from(this.canvasElement.width, this.canvasElement.height)
    }

    /**
     * @param {Point} start
     * @param {Point} end
     */
    gradient(start, end, colorStopPairs) {
        const gradient = this.context.createLinearGradient(start.x, start.y, end.x, end.y)
        for (const [offset, color] of colorStopPairs) {
            gradient.addColorStop(offset, color)
        }
        return gradient
    }

    rgba(r, g, b, a) {
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }

    rgb(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`
    }
}