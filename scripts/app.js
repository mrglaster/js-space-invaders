const W = 64 // Ширина в клетках
const H = 36 // Высота в клетках
let tiles = [] // Плитки
let shooterIdx = (W * (H - 2)) + W / 2
const CLOUD_SIZE = { x: W / 4, y: 3, w: W / 2, h: 3 }


function createBoard() {
    const grid = document.querySelector('.grid')
    const html = document.querySelector('html')

    const width = Math.floor(html.clientWidth / W)
    const height = Math.floor(html.clientHeight / H)
    const min = Math.min(width, height)
    const side = `${min}px`

    grid.style.width = `${min * W}px`
    grid.style.height = `${min * H}px`

    for (let i = 0; i < (W * H); i++) {
        const tile = document.createElement('div')
        tile.style.width = tile.style.height = side
        // tile.style.display = 'inline-block'

        if (i === shooterIdx) {
            tile.classList.add('shooter')
        }

        const row = parseInt(i / W)
        const column = parseInt(i % W)
        if (
            row >= CLOUD_SIZE.y &&
            row <= CLOUD_SIZE.y + CLOUD_SIZE.h &&
            column >= CLOUD_SIZE.x &&
            column <= CLOUD_SIZE.x + CLOUD_SIZE.w
        ) {
            tile.classList.add('invader')
        }

        tiles.push(tile)
        grid.appendChild(tile)
    }
}

function moveShooter(event) {
    tiles[shooterIdx].classList.remove('shooter')
    switch (event.keyCode) {
        case 37: // LEFT
            if (shooterIdx % W !== 0) {
                shooterIdx--
            } 
            break
        case 39: // RIGHT
            if (shooterIdx % W < W - 1) {
                shooterIdx++
            }
            break
        case 38: // UP
            if (shooterIdx >= W) {
                shooterIdx -= W
            }
            break
        case 40: // DOWN
            if ((shooterIdx / W) < H - 1) {
                shooterIdx += W
            }
    }
    tiles[shooterIdx].classList.add('shooter')
}

function start() {
    createBoard()
    document.addEventListener('keydown', moveShooter)
}

document.addEventListener('DOMContentLoaded', start)