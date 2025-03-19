const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

// Environment constants
const GRAVITY = 0.5
const FRICTION = 0.8
const LEVEL_DURATION = 10 // seconds

// Asset constants
const IMG_GOAL = 'data:image/webp;base64,UklGRrICAABXRUJQVlA4TKYCAAAvE8AEEGflJrZtV9n3/vyJFVIwgX8J9FTxvXOPDceRJDlK9aC1/GMS/v/w4SSwM+06kmxVmT3PcMiA/BMgIvtyl3vPso1t28Z6yO6I/nSgAP0X5KU3vQLwys0PhmCbGry8i6hMVSmoKP0o/1h8tfyAJH/If8RXSIiq/4TFl/nDMLBhJQQwJVSW2cKwUYlKqEn7WaWoCVQGWGz8q6CkUQxre4+VCkTS1Oqu9IdB/UIgai2MKOsqEMCcor/8Z7ioVGdq7UCGqrnIUQYY1MtlRh86oUalffu2N66r4qo2BfEhJxdsGMNiA8OFcRHy22s/YGmLnyJh9U+nT38GENsOm3mNMZhqMYzLqOvr8JhkEgZUtnz0ToRcEiGMa7tdxlIACXdqA4PJPyEMK2DLTepOJi3bkK2FLQg2Up2MkHTyu7ZqJUKOF3P1np9HdS7Dtx/oH+n9Nu7vo3GNAAhggSA8br7lvyVmUo31lLNJ8s+0jhNkUGveeQEmhECOz/IGMscUIGzbdjzV/GQb68vLy1yu2c6cmW3XbGRj/pc5ov8TAP/58B4IfNz/7DWscdntdFX45QdetdniZLOopl2Z9xsv18aZv8BgtAvTnRLvF69qG8+Qnu3x3CHnIqz8+VPYzDHGRyfubKKQ65NJXBAAHjSWueSIKCt/9vAyr2S4V/kI8O5y6uMiYxyVZdUIUtjFZLwBBOzsmqToWPeSFo1CCloEJP8nVm1WaiZat0zJR4pbR4kBgA8aVZuSkHNUUTVTetVIWF/5ALhXmRYz0nL3hcKDy/K+qQHpEwCE94bqbpDLre0rz9nGOC4EAPCiaDutv771eIqa8WKs/PkTeCUd7eTjhqbukQmsxAtfe+WDPUzB2Fo/Tu6F75+DSgaJuCoNPcOPH998gY8n+E8='
const IMG_HERO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAADAFBMVEVHcEwzMTEuLjBfSz8kJyuJcFU6PEBLSEQ5NjM5ODsuMTVDPj09NTAwMDJAOTMwLi4yMC8pKywyMC9PWF80PUNVXWUuLS8vLSyGbFKNclVxXEk1NDNdSj0nKCpQQjlFPjmXb0wxMDBWX2VQVlw8OjkvLy9VRDdYRzyhhmODaVBVRz9cTkBSWWA9NDAzMTJ3XkpFQEE3Mi8/R0xIQj54Uj08Z3omJyqcfFlxUDU1MzIwNDg7YXI0MTI5ODeNY0NFPzx6TzVCOjeHZUqnf1tmWks4Mi85NDJOV15SWmA1PEFMgptSWmBPWF9dST5zXEWReVtsWUh6Z08yMC84NzigkXw/OTZnVUM5QklaQDA7PD9AQ0Y2ZXyuk3YuLzF7X01JPDU2cY09MjBdh5cwPkVCfZkqKStPPzhFPz04UVw+NzW9o4E4MzFqX1duZV9BPDljSzwzMTIyS1jKw7MvLy8/TVIxTl0uMDM6W2pHPDYyMTQ3QEVOWFxESk9RWWBFS1BiTUJhTEFHOzRYRjxVRTpkSTtURTtVRTpbUEVWSj2kiGqKc1pRQjgtLjA2QkksLC43UmJOPCuIXzczV2h8ZEtDODFiPzQ1UF49T1mPemSHbE+VaERhZl5CRkU3Oj0mJylLVFRNW2GCZlBIODRzVkMyW2+Wdle9iFhLLibewZovNTlhSDtFODRjTj5ZXWJJPzdQQjm1l3ovPUQ3UFx0V0ZURz81RE5XQzosLS16gISenJmIi403MS5IfJROVl4/VztpQEI8NDBqUkJLQDlvV0JGPDVWS0RvVD03WWmXfl5XRDdfT0BiTj8sMzdWRz1ANC6AXEJCeZJNRUBlWlBGQkB6XkacgWI1Y3p2W0MlJSZ4a1g3VmVGdIg1UWF3V0MyNzo/WGMyTFmcdVQ1R1FPSEM0NDRRlLOEY0iynX1EYm6QcFJ6VDpIh6ZVOC1cW1dVcXxeRzxNWWB+YUdgVElAbYRrTjk4Xm9WUUuGiIeiiWarimOCd21PgJcvcQBAAA4ADhNHcEzB6bzuAAABAHRSTlMAOVOCHv4HAv4SCgPkMP7+lxdl3v0fSav+/v4+/v395f6DJbP9ovyA/v6F3G3BJv9K/fz3/v4N/v5asf7Kgf7V/vv+/v7m7M1Xf/4x8V59/v7+cJ/+nP2W/iDL/v5Aqe3+1/7d/rKa/v7z/rj7/el7d+T+Kv74s/7dvKTrwDXfVD2oRWL+pOBt0oB9qtL++tv+/vf+64nGvv7+/v7+4q3+751yoP7+/rX+6+mM3pu42/7x9Pfu9/FC2/Fu7/2+8f///////v////////////////////////////////////////////////////////////////////////////8Ahmb/egAAAuNJREFUKM9jYEAGvOp+fl2d7WYMWAF30MnDk0OuarNgk+RibG07fXjyDNawUE5UXb7q6lrqafFyJ2UOHtbXP6zWzQwC9TDppmZdVx43Q0MODo4DB/gOZPIAQaNvA8IAQRZBJlnZRxm3ZG/cuDGPBQhQLBBclL9Qjt+o/PbsmzdvxqE7nV3g5PtfWYcPzbG+nZT0rjqbEVVWev1556IVy5ZKvX1w547I0VMd0twIWTZF7Y8PY4qyjgWExPhLsrKynrquLcCF8LHuFXPnDd9LngQ8f/5T4+oJycOHToXCpbktXR9fcvmU8UCOVeOHxlV/Tc2DvabhbDBpxsLjF7y8Pj+SM3GSPHHihLmkRNj91/28UFlOga9Pnz7ds/VImMn5ZxISEpKsmkdNX1+YBpW3Vbvv9bu8iqni7JuWu1JSAfpSMnmlt8o/T4cEjOqxK3fVVAXFXE8f4Ofg4zvCx2cYFCxy5/YCS3aQs8W/OJ1XE+MWvxhwloPjyCGZs4cOZEurWr+7KA+UN7PNPHdgtzij58YPB8MCLSbwHzl34Mr1dbFV6Yc+yQsxbM+7dOmom5Bn6aPHJubOEyPOfXwVcczuer6gkP3bb/YMqo5HL148tG3Tg9MODx8evi9yYKaCncWXl2vEGKwuH01kKFYU2PJJPi35rJOC3fvyhBdHwhRmOZw7fbdCTNzRsYeBW1Rrs759QfxhhfOHrFMSXkyRf/Zqfvk9mYOreQ0MpBl27chdFbfY5o2DRcm1lAvRhUyMoXNNL9y6d3Iq2Nc7v68V445MTVzOvyQ6elIyEzD+rI6bfhVRhARajnIk0O/FjKmyZ86csdIDRjO31Zl7K8v0IEEqBE1TQvzpHH0C4LRh9eRiNlpyErVVuWSsaODtXetdW6nyza1AD55cRHV0dNyNHucYhysLV/v4+Ig8uayigtDP6eGh/MHoYq5xjbswCNTVeTIxxSIlNlFl9yibKJuavR6iSiAATykA44YRosCcQ58AAAAASUVORK5CYII='
const AUD_SONG_START = './audio/songStart.mp3'
const AUD_SONG_ACTION = './audio/songAction.mp3'
const AUD_FX_GOAL = './audio/fxGoal.mp3'

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

class StartScene extends Scene {
    constructor() {
        super();

        this.audios = Engine.loadAudios({
            songStart: {
                src: AUD_SONG_START,
                loop: true
            }
        });

        this.images = Engine.loadImages({
            goal: {
                src: IMG_GOAL
            }
        });
    }

    init() {
        Engine.playAudio(this.audios.songStart);
    }

    cleanup() {
        Engine.stopAudio(this.audios.songStart);
    }

    update(currentTime) {
        // Nothing to update in start screen
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawBG();
        this.drawTitle();
        ctx.drawImage(this.images.goal, 380, 100, 40, 40);
    }

    drawBG() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#87CEEB')
        gradient.addColorStop(1, '#FFF')
        ctx.fillStyle = gradient

        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    drawTitle() {
        ctx.fillStyle = '#fff';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Coin Fever`, 400, 200);

        ctx.font = '24px Arial';
        ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2 + 60);
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            SceneManager.changeScene(new Level1Scene());
        }
    }

    handleKeyUp(event) {
        // Nothing needed here
    }
}

class Level1Scene extends Scene {

    constructor() {
        super();

        this.GOAL_SIZE = 20
        this.INITIAL_GOAL_COUNT = 5
        this.GOAL_SPAWN_TIME = 1000
        this.DEFAULT_PLAYER_SPEED = 5
        this.DEFAULT_JUMP_STRENGTH = 12

        this.audios = Engine.loadAudios({
            songAction: {
                src: AUD_SONG_ACTION,
                loop: true
            },
            fxGoal: {
                src: AUD_FX_GOAL,
                loop: false
            }
        });

        this.images = Engine.loadImages({
            goal: {
                src: IMG_GOAL
            },
            hero: {
                src: IMG_HERO
            }
        });

        this.keys = {};
        this.goals = [];
        this.score = 0;
        this.timeLeft = LEVEL_DURATION;
        this.lastGoalSpawnTime = 0;
        this.lastUpdateTime = 0;

        // Define player within the scene
        this.player = {
            speed: this.DEFAULT_PLAYER_SPEED,
            jumpStrength: this.DEFAULT_JUMP_STRENGTH,
            x: 50,
            y: 200,
            width: 30,
            height: 30,
            xVelocity: 0,
            yVelocity: 0,
            isJumping: false
        };

        // Define platforms for this level
        this.platforms = [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 300, y: 250, width: 200, height: 20 },
            { x: 600, y: 150, width: 200, height: 20 },
            { x: 100, y: 200, width: 150, height: 20 }
        ];
    }

    init() {
        this.keys = {};
        this.goals = [];
        this.score = 0;
        this.timeLeft = LEVEL_DURATION;
        this.lastGoalSpawnTime = 0;
        this.lastUpdateTime = performance.now();

        // Reset player position
        this.player.x = 50;
        this.player.y = 200;
        this.player.xVelocity = 0;
        this.player.yVelocity = 0;
        this.player.isJumping = false;

        // Spawn initial goals
        for (let i = 0; i < this.INITIAL_GOAL_COUNT; i++) {
            this.spawnGoal();
        }

        Engine.playAudio(this.audios.songAction);
    }

    cleanup() {
        Engine.stopAudio(this.audios.songAction);
    }

    drawSky() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#87CEEB')
        gradient.addColorStop(1, '#FFF')
        ctx.fillStyle = gradient

        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    drawPlatforms() {
        this.platforms.forEach(platform => {
            const gradient = ctx.createLinearGradient(0, platform.y, 0, platform.y + platform.height)
            gradient.addColorStop(0, '#33CC00')
            gradient.addColorStop(1, '#CC5544')
            ctx.fillStyle = gradient

            ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        })
    }

    drawPlayer() {
        ctx.drawImage(this.images.hero, this.player.x, this.player.y, this.player.width, this.player.height)
    }

    drawStatus() {
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Time: ${Math.ceil(this.timeLeft)}s`, 10, 30);
        ctx.fillText(`Score: ${this.score}`, 10, 60);
    }

    spawnGoal() {
        let newGoal;
        do {
            newGoal = {
                x: Math.random() * (canvas.width - this.GOAL_SIZE),
                y: Math.random() * (canvas.height - this.GOAL_SIZE),
                width: this.GOAL_SIZE,
                height: this.GOAL_SIZE,
                spawnTime: Date.now()
            };
        } while (this.platforms.some(platform => Engine.checkCollision(newGoal, platform)));
        this.goals.push(newGoal);
    }

    update(currentTime) {
        // Calculate delta time
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;
        this.timeLeft -= deltaTime;

        // Check game over condition
        if (this.timeLeft <= 0) {
            SceneManager.changeScene(new GameOverScene(this.score));
            return;
        }

        // Spawn new goals
        if (currentTime - this.lastGoalSpawnTime > this.GOAL_SPAWN_TIME) {
            this.goals = this.goals.filter(goal => currentTime - goal.spawnTime < this.GOAL_SPAWN_TIME);
            this.spawnGoal();
            this.lastGoalSpawnTime = currentTime;
        }

        // Ensure there's always at least one goal
        if (this.goals.length === 0) {
            this.spawnGoal();
            this.lastGoalSpawnTime = currentTime;
        }

        // Player movement
        if (this.keys['ArrowLeft']) {
            this.player.xVelocity = -this.player.speed;
        } else if (this.keys['ArrowRight']) {
            this.player.xVelocity = this.player.speed;
        } else {
            this.player.xVelocity *= FRICTION;
        }

        if (this.keys['ArrowUp'] && !this.player.isJumping) {
            this.player.yVelocity = -this.player.jumpStrength;
            this.player.isJumping = true;
        }

        this.player.yVelocity += GRAVITY;

        this.player.x += this.player.xVelocity;
        this.player.y += this.player.yVelocity;

        // Platform collisions
        this.platforms.forEach(platform => {
            if (Engine.checkCollision(this.player, platform)) {
                if (this.player.y + this.player.height - this.player.yVelocity <= platform.y) {
                    this.player.y = platform.y - this.player.height;
                    this.player.yVelocity = 0;
                    this.player.isJumping = false;
                }
                else if (this.player.y - this.player.yVelocity >= platform.y + platform.height) {
                    this.player.y = platform.y + platform.height;
                    this.player.yVelocity = 0;
                }
                else {
                    if (this.player.x + this.player.width - this.player.xVelocity <= platform.x) {
                        this.player.x = platform.x - this.player.width;
                    } else if (this.player.x - this.player.xVelocity >= platform.x + platform.width) {
                        this.player.x = platform.x + platform.width;
                    }
                    this.player.xVelocity = 0;
                }
            }
        });

        // Goal collisions
        this.goals = this.goals.filter(goal => {
            if (Engine.checkCollision(this.player, goal)) {
                this.score += 10;
                Engine.playAudio(this.audios.fxGoal);
                return false;
            }
            return true;
        });

        // Boundary collisions
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > canvas.width) this.player.x = canvas.width - this.player.width;
        if (this.player.y + this.player.height > canvas.height) {
            this.player.y = canvas.height - this.player.height;
            this.player.yVelocity = 0;
            this.player.isJumping = false;
        }
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawSky();
        this.drawPlatforms();

        // Draw goals
        this.goals.forEach(goal => {
            ctx.drawImage(this.images.goal, goal.x, goal.y, this.GOAL_SIZE, this.GOAL_SIZE);
        });

        this.drawPlayer();
        this.drawStatus();
    }

    handleKeyDown(event) {
        this.keys[event.code] = true;
    }

    handleKeyUp(event) {
        this.keys[event.code] = false;
    }
}

class GameOverScene extends Scene {
    constructor(finalScore = 0) {
        super();

        this.audios = Engine.loadAudios({
            songStart: {
                src: AUD_SONG_START,
                loop: true
            }
        });

        this.score = finalScore;
    }

    init() {
        Engine.playAudio(this.audios.songStart);
    }

    cleanup() {
        Engine.stopAudio(this.audios.songStart);
    }

    drawSky() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#87CEEB')
        gradient.addColorStop(1, '#FFF')
        ctx.fillStyle = gradient

        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    update(currentTime) {
        // Nothing to update in game over screen
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawSky();

        // Reference to Level1Scene for drawing platforms and player
        const dummyLevel = new Level1Scene();
        dummyLevel.drawPlatforms();
        dummyLevel.drawPlayer();

        // Draw game over overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);

        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${this.score}`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 60);
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            SceneManager.changeScene(new Level1Scene());
        }
    }

    handleKeyUp(event) {
        // Nothing needed here
    }
}

// Scene Manager
const SceneManager = {
    currentScene: null,

    initialize: function(startingScene) {
        this.currentScene = startingScene;
        if (this.currentScene && this.currentScene.init) {
            this.currentScene.init();
        }
    },

    changeScene: function(newScene) {
        if (this.currentScene && this.currentScene.cleanup) {
            this.currentScene.cleanup();
        }
        this.currentScene = newScene;
        if (this.currentScene && this.currentScene.init) {
            this.currentScene.init();
        }
    },

    update: function(currentTime) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(currentTime);
        }
    },

    draw: function() {
        if (this.currentScene && this.currentScene.draw) {
            this.currentScene.draw();
        }
    },

    handleKeyDown: function(event) {
        if (this.currentScene && this.currentScene.handleKeyDown) {
            this.currentScene.handleKeyDown(event);
        }
    },

    handleKeyUp: function(event) {
        if (this.currentScene && this.currentScene.handleKeyUp) {
            this.currentScene.handleKeyUp(event);
        }
    }
};

//main

let gameLoopId

// Update main game loop and event handlers
function gameLoop(currentTime) {
    SceneManager.update(currentTime);
    SceneManager.draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    SceneManager.handleKeyDown(e);
});

document.addEventListener('keyup', (e) => {
    SceneManager.handleKeyUp(e);
});

// Initialize with the start scenario
SceneManager.initialize(new StartScene());
gameLoopId = requestAnimationFrame(gameLoop);