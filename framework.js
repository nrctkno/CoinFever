class Engine {
    #audio

    constructor() {
        this.#audio = new AudioManager();
    }

    audio() {
        return this.#audio;
    }

    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
    }

    loadAssets(definitions) {
        const assets = {};
        for (const [name, def] of Object.entries(definitions)) {
            if (def instanceof AudioDefinition) {
                const audio = new Audio(def.src);
                audio.loop = def.loop || false;
                assets[name] = audio;
                continue;
            } else if (def instanceof ImageDefinition) {
                const image = new Image();
                image.src = def.src;
                assets[name] = image;
            } else {
                console.warn(`Unknown asset type for ${name}:`, def);
                continue;
            }
        }
        return assets;
    }
}

class AssetDefinition {
    constructor(src) {
        this.src = src;
    }
}

class ImageDefinition extends AssetDefinition {
    constructor(src, width, height) {
        super(src);
    }
}

class AudioDefinition extends AssetDefinition {
    constructor(src, loop = false) {
        super(src);
        this.loop = loop;
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
};

class Scene {
    constructor(manager) {
        this.manager = manager;
    }

    init() {}
    draw() {}
    cleanup() {}
    onTick(currentTime) {}
    onKeyDown(event) {}
    onKeyUp(event) {}
}

class SceneManager {
    #engine;
    #currentScene;
    #previousScene;

    constructor(engine) {
        this.#engine = engine;
        this.#currentScene = null;
        this.#previousScene = null;
    }

    engine() {
        return this.#engine;
    }

    previousScene() {
        return this.#previousScene;
    }

    changeScene(newSceneClass, ...args) {
        if (this.#currentScene) {
            this.#currentScene.cleanup();
        }
        this.#previousScene = this.#currentScene;
        this.#currentScene = new newSceneClass(this, ...args);
        this.#currentScene.init();
    }

    tick(currentTime) {
        if (this.#currentScene) {
            this.#currentScene.onTick(currentTime);
        }
    }

    draw() {
        if (this.#currentScene) {
            this.#currentScene.draw();
        }
    }

    keyDown(event) {
        if (this.#currentScene) {
            this.#currentScene.onKeyDown(event);
        }
    }

    keyUp(event) {
        if (this.#currentScene) {
            this.#currentScene.onKeyUp(event);
        }
    }
}