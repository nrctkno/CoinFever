const Engine = {
    checkCollision: function (obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
    },

    loadAudios: function(audioDefinitions) {
        const audios = {};
        for (const [name, config] of Object.entries(audioDefinitions)) {
            const audio = new Audio(config.src);
            audio.loop = config.loop || false;
            audios[name] = audio;
        }
        return audios;
    },

    loadImages: function(imageDefinitions) {
        const images = {};
        for (const [name, imageData] of Object.entries(imageDefinitions)) {
            const image = new Image();
            image.src = imageData.src;
            images[name] = image;
        }
        return images;
    },

    playAudio: function (audio) {
        audio.currentTime = 0
        audio.play().catch(e => console.log("Audio play failed:", e))
    },

    stopAudio: function (audio) {
        audio.pause()
        audio.currentTime = 0
    },

    bindKeyboardEvents: function (element, sceneManager) {
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault(); // Prevent default action for Escape key
            }
            sceneManager.handleKeyDown(event);
        });

        element.addEventListener('keyup', (event) => {
            sceneManager.handleKeyUp(event);
        });
    }
}


class Scene {
    constructor() {
        this.audios = {};
        this.images = {};
    }

    init() {}
    cleanup() {}
    update(currentTime) {}
    draw() {}
    handleKeyDown(event) {}
    handleKeyUp(event) {}
}

// Scene Manager - converted to a class
class SceneManager {
    constructor() {
        this.currentScene = null;
        this.previousScene = null;
    }

    previousScene() {
        return this.previousScene;
    }

    initialize(startingScene) {
        this.currentScene = startingScene;
        this.currentScene.init();
    }

    changeScene(newScene) {
        this.currentScene.cleanup();
        this.previousScene = this.currentScene;
        this.currentScene = newScene;
        this.currentScene.init();
    }

    update(currentTime) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(currentTime);
        }
    }

    draw() {
        if (this.currentScene && this.currentScene.draw) {
            this.currentScene.draw();
        }
    }

    handleKeyDown(event) {
        if (this.currentScene && this.currentScene.handleKeyDown) {
            this.currentScene.handleKeyDown(event);
        }
    }

    handleKeyUp(event) {
        if (this.currentScene && this.currentScene.handleKeyUp) {
            this.currentScene.handleKeyUp(event);
        }
    }
}