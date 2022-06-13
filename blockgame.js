//Confirm javascript connection
console.log("Script file connected");

//global variables 
document.querySelector("body").addEventListener("keypress", getinput(KeyboardEvent));
let gamefield = document.querySelector("#field");
let scoreboard = document.querySelector("#scoreboard");
let currentbackground = [];
let currentblock = [];
let score = 0;
let fallcounter = 0;
let input = "";
let gameloop = "";

//preparation (onload event): create background.
function backgrounddefault(){
    for(let y=0;y<20;y++){
        let row = [];
        for(let x=0;x<10;x++){
            let col = "0";
            row.push(col);
        }
        currentbackground.push(row);
    }
}

//preparation (keyboard event listener)
function getinput(event){
    let input = event.key;
    console.log(input);
    //move block left when conditions met
    if((input == "a"|| input == "ArrowLeft") && currentblock.x >= 1){
        let countery = 0;
        let ifmoveleft = 0;
        for(let y of currentblock.form){
            if(currentbackground[currentblock.y + countery][currentblock.x - 1] != "2"){
                ifmoveleft += 1;
            }
            countery += 1;
        }
        if(ifmoveleft == (currentblock.h + 1)){
            currentblock.x -= 1;
        }
    }
    //move block right when conditions met
    else if((input == "d"|| input == "ArrowRight") && (currentblock.x + currentblock.w) <= 8){
        let countery = 0;
        let ifmoveright = 0;
        for(let y of currentblock.form){
            if(currentbackground[currentblock.y + countery][currentblock.x + currentblock.w + 1]!= "2"){
                ifmoveright += 1;
            }
            countery += 1;
        }
        if(ifmoveright == (currentblock.h + 1)){
            currentblock.x += 1;
        }
    }
    //move block down when conditions met
    else if((input == "s" || input == "ArrowDown") && (currentblock.y + currentblock.h) <= 19){
        let ifmovedown = 0;
        let countery = 0;
        for(let y of currentblock.form){
            let counterx = 0;
            for( let x of y){
                if(currentbackground[currentblock.y + currentblock.h + 1][currentblock.x + counterx] != "2"){
                    if(currentblock.h >= 1 && currentblock.h == countery){
                        ifmovedown += 1;
                    }
                    else if(currentblock.h == 0){
                        ifmovedown += 1;
                    }
                }
                counterx += 1;
            }
            countery += 1;
        }
        if(ifmovedown == (currentblock.w + 1)){
            currentblock.y += 1;
        }
    }
    //rotate block
    else if(input == "w" || input == "ArrowUp"){
        if(currentblock.type == 0 && currentbackground[currentblock.y][currentblock.x + 1] != "2" && currentbackground[currentblock.y + 1][currentblock.x + 1] != "2" && (currentblock.x + 1) <= 9){
            currentblock.h = 0;
            currentblock.w = 1;
            currentblock.type = 3;
            currentblock.form = [["1","1"]];
        }
        else if(currentblock.type == 3 && currentbackground[currentblock.y + 1][currentblock.x] != "2" && currentbackground[currentblock.y + 1][currentblock.x + 1] != "2" && (currentblock.y + 1) <= 19){
            currentblock.h = 1;
            currentblock.w = 0;
            currentblock.type = 0;
            currentblock.form = [["1"],["1"]];
        }
    }
}

//step 1: create a clean 2d array with all "0" for every single iteration.
function craetnewfield(){
    let gamefield = [];
    for(let y=0;y<20;y++){
        let row = [];
        for(let x=0;x<10;x++){
            let col = "0";
            row.push(col);
        }
        gamefield.push(row);
    }
    return gamefield;
}

//step 2: update the 2darray with previously stacked blocks in it
function getbackground(gamefield, background){
    for(let y=0;y<20;y++){
        for(let x=0;x<10;x++){
            if(background[y][x] == "2"){
                gamefield[y][x] = "2";
            }
        }
    }
    return gamefield;
}

//step 3: create game blocks, called when needed to spawn a new block, return necessary information to generate a new block
function generatenewblockinfo(){
    let block = [];
    let blockh = 0;
    let blockw = 0;
    let currentx = 4;   //4 for default center positoin
    let currenty = 0; 
    let blockform = [];
    let newnumber = Math.random() * 4;
    let rnumber = parseInt(newnumber);
    
    // when rnumber < 1, block will be the vertical long strip
    if(rnumber < 1){
        blockh = 1;
        blockw = 0;
        blockform = [["1"],["1"]];
    }
    // when 1 < rnumber < 2, block will be the square
    else if(rnumber < 2){
        blockh = 1;
        blockw = 1;
        blockform = [["1","1"],["1","1"]];
    }
    // when 2 < rnumber < 3, block will be the L shape 
    else if(rnumber < 3){
        blockh = 0;
        blockw = 0;
        blockform = [["1"]];
    }
    // when 3 < rnumber < 4, block will be horizontal long strip
    else if(rnumber < 4){
        blockh = 0;
        blockw = 1;
        blockform = [["1","1"]];
    }

    block = { w:blockw, h:blockh, x:currentx ,y: currenty, type:rnumber, form:blockform};
    return block;
}

//step. 4-1: if block will stack up or reaches 20th row, update gamefield
function updatebackground(block){
    let countery = 0;

    for(let y of block.form){
        let counterx = 0;
        for(let x of y){
            if(x == "1"){
                currentbackground[block.y + countery][block.x + counterx] = "2";
            }
            counterx +=1; 
        }
        countery += 1;
    }
}

//step. 4-2: check if row complete
function ifrowcomplete(field){
    let rownumber = 0;
    let completerownumber = [];

    for(let y of field){
        let blocknumber = 0;
        for(let x of y){
            if(x == "2"){
                blocknumber += 1;
            }
        }
        if(blocknumber == 10){
            completerownumber.push(rownumber);
        }
        rownumber += 1;
    }

    let completerowtotal = completerownumber.length;
    let startingrownumber = completerownumber[0];

    field.splice(startingrownumber, completerowtotal);
    for(let i=0;i<completerowtotal;i++){
        let row=["0","0","0","0","0","0","0","0","0","0"]
        field.splice(0,0,row)
    }

    if(completerowtotal > 1){
        score += 30;
    }

    else if(completerowtotal > 0){
        score += 10;
    }
    scoreboard.innerHTML = "Score: " + score;
}

//step. 4-3: check if game over
function ifgameover(field){
    let countery = 0;
    for(let y of currentblock.form){
        let counterx = 0;
        for(let x of y){
            if(field[currentblock.y + countery][currentblock.x + counterx] == "2"){
                console.log("gameover");
                clearInterval(gameloop);
                alert("game over!\nPlase refresh page to try again\nScore: " + score);
            }
            counterx += 1;
        }
        countery += 1;
    }
}

//step. 4: calculate if block should fall or stack
function fallingcalculate(gamefield, block){
    let keepgoing = 0;

    let countery = 0;
    for(let y of block.form){
        let counterx = 0;
        for(let x of y){
            if((block.y + block.h + 1 == 20) || gamefield[block.y + block.h + 1][block.x+counterx] == "2"){
                 keepgoing += 1;
            }
            counterx += 1;
        }
        countery += 1;
    }
    if(keepgoing > 0){
        updatebackground(block);
        currentblock = generatenewblockinfo();
        ifrowcomplete(currentbackground);
        ifgameover(currentbackground);
    }
    else{
        block.y += 1;
    }
}

//step. 5: print out field
function printfield(field, block){
    let svgstrings = "";
    let transy = 1;

    for(let y of field){
        let transx = 3;
        for(let x of y){
            if(x == "0"){
                svgstrings += '<rect x="0" y="0" width="28" height="28" fill="black" transform="translate('+ transx * 30 +','+ transy * 30 +')"/>';;
            }
            else if(x == "2"){
                svgstrings += '<rect x="0" y="0" width="28" height="28" fill="green" transform="translate('+ transx * 30 +','+ transy * 30 +')"/>';
            }
            transx += 1;
        }
        transy += 1;
    }
    let countery = 1;
    for(let by of block.form){
        let counterx = 3;
        for(let bx of by){
            if(bx == "1"){
                svgstrings += '<rect x="0" y="0" width="28" height="28" fill="blue" transform="translate('+ (block.x + counterx) * 30 +','+ (block.y + countery) * 30 +')"/>';
            }
            counterx += 1;
        }
        countery += 1;
    }
    gamefield.innerHTML = svgstrings;
}


//Event loop/ onload page default
function ondefault(){
   currentblock = generatenewblockinfo();
   backgrounddefault();
   let array = craetnewfield();
   let array2 = getbackground(array, currentbackground);
   printfield(array2, currentblock);
}

function refreshpage(){
    location.reload();
}

//Game loop function
function fortesting(){
    gameloop =  setInterval(function(){
                        let array = craetnewfield();
                        let array2 = getbackground(array, currentbackground);
                        if(fallcounter == 1000){
                            fallingcalculate(array2, currentblock);
                            fallcounter = 0;
                        }
                        printfield(array2, currentblock);
                        fallcounter += 50;
                    }
                ,50);
}

window.refreshpage = refreshpage;
window.ondefault = ondefault;
window.fortesting = fortesting;
window.getinput = getinput;