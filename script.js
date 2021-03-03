(() => {
    class Player {
        constructor(name) {
            this.name = name
            this._held = 0
            this._current = 0
            this.heldElement = document.querySelector(`#${name} .held`)
            this.currentElement = document.querySelector(`#${name} .current`)
            this.div = document.getElementById(name)
        }

        set current(number) {
            this._current = number
            this.currentElement.innerHTML = this.current
        }

        get current() {
            return this._current
        }

        set held(number) {
            this._held = number
            this.heldElement.innerHTML = this.held
        }

        get held() {
            return this._held
        }

        set active(isActive) {
            if (isActive) {
                this.div.classList.add("active")
            } else {
                this.div.classList.remove("active")
            }
        }

        set winner(isWinner) {
            if (isWinner) {
                this.div.classList.add("winner")
            } else {
                this.div.classList.remove("winner")
            }           
        }
    
        reset() {
            this.held = 0
            this.current = 0
            this.winner = false
        }
    
        holdScore() {
            this.held += this.current
            this.current = 0
        }
    }
    
    class Die {
        constructor() {
            this.number = 1
            this.image = document.getElementById("die")
        }
    
        setNumber(number) {
            this.number = number
            this.image.src = `./img/dice${number}.png`
        }
    
        showRandom() {
            let random = Math.floor(Math.random() * 5 + 1)
            random += (random >= this.number)
            this.setNumber(random)
        }
    }
    
    class Game {
        constructor() {
            this.player1 = new Player("player1")
            this.player1.active = true
            this.player2 = new Player("player2")
            this.die = new Die()
            this.turn = 1
            this._winner = null
            this.rolling = false
            this.controls = document.getElementById("controls")
        }
    
        get currentPlayer() {
            return (this.turn === 1) ? this.player1 : this.player2
        }

        get winner() {
            return this._winner
        }

        set winner(winner) {
            this._winner = winner
            this.currentPlayer.winner = true
            this.controls.classList.add("gameOver")
        }
    
        restart() {
            this.current = 1
            this.winner = null
            this.player1.reset()
            this.player2.reset()
            this.die.setNumber(1)            
            this.controls.classList.remove("gameOver")
        }
    
        changeTurn() {
            this.currentPlayer.active = false
            this.turn = (this.turn === 1) ? 2 : 1
            this.currentPlayer.active = true

            if (this.turn === 2) {
                this.controls.classList.add("bottom")
            } else {
                this.controls.classList.remove("bottom")
            }
        }
    
        roll() {
            if (this.rolling || this.winner) {
                return
            }
    
            const interval = setInterval(() => this.die.showRandom(), 100)
            const number = Math.floor(Math.random() * 6 + 1)
            this.rolling = true
    
            setTimeout(() => {
                clearInterval(interval)
                this.die.setNumber(number)
                this.rolling = false
    
                if (number === 1) {
                    this.currentPlayer.current = 0
                    this.changeTurn()
                } else {
                    this.currentPlayer.current += number
                }
            }, 1500)
        }
    
        holdScore() {
            this.currentPlayer.holdScore()
    
            if (this.currentPlayer.held >= 20) {
                this.winner = this.currentPlayer.name
            } else {
                this.changeTurn()
            }        
        }
    }

    const preloadImages = () => {
        const img = new Image
        for(let i = 1; i < 7; i++) {
            img.src = `./img/dice${i}.png`
        }
    }
    preloadImages()

    const game = new Game()
    const rollBtn = document.getElementById("roll")
    const restartBtn = document.getElementById("restart")
    const holdBtn = document.getElementById("hold")
    
    rollBtn.addEventListener("click", () => game.roll())
    restartBtn.addEventListener("click", () => game.restart())
    holdBtn.addEventListener("click", () => game.holdScore())
})()