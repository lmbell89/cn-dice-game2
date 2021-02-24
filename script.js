class Player {
    constructor(name) {
        this.name = name
        this.held = 0
        this.current = 0
        this.heldElement = document.querySelector(`#${name} .held`)
        this.currentElement = document.querySelector(`#${name} .current`)
    }

    reset() {
        this.held = 0
        this.current = 0
    }

    holdScore(score) {
        this.held += score
        this.heldElement.innerHTML = this.held
        this.currentElement.innerHTML = 0
    }

    addToCurrent(score) {
        this.current += score
        this.currentElement.innerHTML = this.current
    }
}

class Game {
    constructor(player1Name, player2Name) {
        this.player1 = new Player(player1Name)
        this.player2 = new Player(player2Name)
        this.turn = 1
        this.winner = null
    }

    get currentPlayer() {
        if (this.turn === 1) {
            return this.player1
        } else {
            return this.player2
        }
    }

    startNew() {
        this.current = 1
        this.finished = false
        this.player1.reset()
        this.player2.reset()
    }

    changeTurn() {
        this.turn = this.turn === 1 ? 2 : 1
    }

    handleRoll(number) {
        if (number === 1) {
            this.currentPlayer().addScore(0)
            this.changeTurn()
        } else {
            this.currentPlayer().addScore(number)
        }
    }

    holdScore() {
        this.currentPlayer().held += this.currentPlayer().current
        document.querySelector(`#player${this.turn} heldScore`).innerHTML = this.currentPlayer().held

        if (this.currentPlayer().held >= 20) {
            this.winner = this.currentPlayer().name
        } else {
            this.changeTurn()
        }        
    }
}

const rollDie = (iters) => {
    rollBtn.disabled = true

    const die = document.getElementById("die")

    const promise = new Promise(resolve => {

        const showRandom = (current, i) => {
            let nextNumber = Math.floor(Math.random() * 5 + 1)
            nextNumber+= +(nextNumber >= currentNumber)
            die.style.backgroundImage = URL(`./img/dice${nextNumber}.png`)

            if (i >= iters) {
                setTimeout(() => showRandom(nextNumber, ++i), 250)
            } else {
                setTimeout(() => resolve(Math.floor(Math.random() * 6 + 1), 250))
            }
        }
    })

    promise.then(number => {
        die.style.backgroundImage = URL(`./img/dice${number}.png`)
        game.handleRoll(number)
        rollBtn.disabled = false
    })
}


const game = new Game("Player 1", "Player 2")
const rollBtn = document.getElementById("rollBtn")

rollBtn.addEventListener("click", () => {
    if(!rollBtn.disabled) {
        rollDie(10)
    }
})

