
const W = 64 // Width (in tiles)
const H = 36 // Height (in tiles)
let tiles = [] // Tiles
let shooterIdx = (W * (H - 2)) + W / 2;
const CLOUD_SIZE = { x: W / 4, y: 3, w: W / 2, h: 3 }; //Alien army

let invaders = [] //List of indices (numbers) of tiles, there are on which invaders
let direction = 1; 
let timerId;

let CLASSNAME_INVADER = 'invader';
let CLASSNAME_SHOOTER = 'shooter';
let CLASSNAME_BULLET = 'bullet';

/**Create the game field */
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
            tile.classList.add('invader');
            invaders.push(i);
        }

        tiles.push(tile)
        grid.appendChild(tile)
    }
}

/**The player move behaviour */
function moveShooter(event) {
    tiles[shooterIdx].classList.remove('shooter')
    switch (event.keyCode) {
        case 37: // Arrow left
        case 65: // A
            if (shooterIdx % W !== 0) {
                shooterIdx--
            } 
            break
        case 39: // Arrow right
        case 68: // D
            if (shooterIdx % W < W - 1) {
                shooterIdx++
            }
            break
        case 38: //Arrow up
        case 87: //W 
            if (shooterIdx >= W) {
                shooterIdx -= W
            }
            break
        case 40: //Arrow down
        case 83: // S
            if ((shooterIdx / W) < H - 1) {
                shooterIdx += W
            }
    }
    tiles[shooterIdx].classList.add('shooter');
}

/**THe shooting function */
function shoot(e){
    let bulletId; //Timer identifyer
    let bulletIdx = shooterIdx;

    /**Move bullet */
    const moveBullet = () => {
        tiles[bulletIdx].classList.remove('bullet');
        bulletIdx -= W;
        if(bulletIdx < 0){
            clearInterval(bulletId);
            return
        }
        tiles[bulletIdx].classList.add('bullet');
        if(tiles[bulletIdx].classList.contains(
            'invader', 'bullet'
        )) {
            tiles[bulletIdx].classList.remove('invader');
            tiles[bulletIdx].classList.remove('bullet');
            clearInterval(bulletId);
            const index = invaders.indexOf(bulletIdx);
            invaders.splice(index, 1);
        }
    }

    if(e.keyCode === 32){
            bulletId = setInterval(moveBullet, 100);
    }

}

/**Right edge check for the clound of enemies */
function isRightEdge(){
    let rightIdx = 0;
    invaders.forEach(idx => {
        rightIdx = Math.max(rightIdx, idx % W)
    });
    return rightIdx === W-1;
}

function isLeftEdge(){
    return invaders[0] % W <= 0;
}

function moveInvaders(){
    let righIdx = 0;
    let downIdx = 0;
    invaders.forEach(idx => {
        righIdx = Math.max(downIdx, parseInt(idx % W));
        downIdx = Math.max(downIdx, parseInt(idx / W));
    })

    if ( (isLeftEdge() && direction === -1) || (isRightEdge() && direction === 1))  {
            direction = W;
    } else if(direction === W){
        if(isLeftEdge()) direction = 1;
        else direction = -1;
    }
    
    for(const index of invaders){
        tiles[index].classList.remove('invader');
    }

    for(const i in invaders){
        invaders[i] += direction;
    }

    for(const idx of invaders){
        tiles[idx].classList.add('invader');
    }

    if (downIdx >= H - 1  || tiles[shooterIdx].classList.contains('invader', 'shooter')) { alert("GAME OVER!"); clearInterval(timerId);}

    if(invaders.length <= 0) {
         alert('YOU WON!');
         clearInterval(timerId);
    }
}


/**The main function */
function start() {
    createBoard();
    document.addEventListener('keydown', moveShooter);
    document.addEventListener('keyup', shoot);
    timerId = setInterval(moveInvaders, 500);
}

document.addEventListener('DOMContentLoaded', start);