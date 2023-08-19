const table = document.querySelector("#tblBingo")
const letter = document.querySelectorAll(".letters-bingo")

const winningPositions = [
    [0, 1, 2, 3, 4],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
]

const maxNumber = 201
const minNumber = -100

let iterator = 0;
let isAnswer = false;

for (i = 0; i < 5; i++) {
    let tr = document.createElement("tr")
    table.appendChild(tr)

    for (j = 0; j < 5; j++) {
        let td = document.createElement("td")
        td.id = `${i}-${j}`
        td.style.height = "20%"
        td.style.width = "20%"
        td.classList.add("main-table-cell")

        let div = document.createElement("div")
        div.classList.add("cell-format")

        if(i % 2 === 0){
            if(j % 2 === 0){
                div.classList.add("cell-even")
            }else{
                div.classList.add("cell-odd")
            }
        }else{
            if(j % 2 === 0){
                div.classList.add("cell-odd")
            }else{
                div.classList.add("cell-even")
            }
        }

        td.appendChild(div)
        tr.appendChild(td)

        if(i === 2 && j === 2){
            td.classList.add("strickout");
            td.children[0].textContent = "X"
        }

        iterator++;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

const operators = [{
    sign: "+",
    method: function(a,b){ return a + b; }
},{
    sign: "-",
    method: function(a,b){ return a - b; }
}];

let answer = null;

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

function generateProblem() {
    const selectedOperator = Math.floor(Math.random()*operators.length);
    const sign = operators[selectedOperator].sign                  //this will give you the sign
    const num1 = getRandomInt(minNumber, maxNumber)
    const num2 = getRandomInt(minNumber, maxNumber)
    answer = operators[selectedOperator].method(num1, num2)  //this will give you the answer
    $("#problem").text(`${num1 < 0 ? `(${num1})` : num1} ${sign} ${num2 < 0 ? `(${num2})` : num2} = ?`)
    animateCSS('#problem', 'tada')
}

$("#check-answer").on("click", function() {
    const input = $("#answer-input").val()
    if(!input){
        alert("ต้องตอบคำถาม")
    }
    
    if(parseInt(input) === answer){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'ถูกต้อง',
            showConfirmButton: false,
            timer: 1500
        })
        $("#answer-input").val("")
        isAnswer = true
    }
});

const cell = document.querySelectorAll(".main-table-cell");
let winningIterator = 0
cell.forEach(e => {
    e.addEventListener("click", () => {
        if (isAnswer){
            addBingo(e)
        }else{
            alert("ตอบคำถามก่อน")
        }
    })
})

function addBingo(element) {
    element.classList.add("strickout");
    element.children[0].textContent = "X"

    if(matchWin()) {
        animateCSS('#bingo', 'bounceIn')
        setTimeout(function(){ location.reload() }, 5000)
    }else{
        generateProblem()
    }

    isAnswer = false
}

function matchWin() {
    const cell = document.querySelectorAll(".main-table-cell");

    return winningPositions.some(combination => {
        let ite = 0;
        combination.forEach(index => {
            if(cell[index].classList.contains("strickout")) ite++;
        })

        if(ite === 5) {
            let indexWin = winningPositions.indexOf(combination);
            winningPositions.splice(indexWin, 1)
        }

        return combination.every(index => {
            return cell[index].classList.contains("strickout")
        })
    })
}

generateProblem();