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
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
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

    constructor(src, width, height) {
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

    width() {
        throw new Error("Method 'width()' must be implemented.")
    }

    height() {
        throw new Error("Method 'height()' must be implemented.")
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

    image(image, x, y, width, height) {
        this.context.drawImage(image, x, y, width, height)
    }

    rect(x, y, width, height, fillStyle) {
        this.context.fillStyle = fillStyle
        this.context.fillRect(x, y, width, height)
    }

    text(text, x, y, font = "16px sans-serif", fillStyle = "#000") {
        this.context.font = font
        this.context.fillStyle = fillStyle
        this.context.fillText(text, x, y)
    }

    width() {
        return this.canvasElement.width
    }

    height() {
        return this.canvasElement.height
    }
}