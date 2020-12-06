const clock = document.querySelector('.js-clock');

const todoform = document.querySelector('.js-todolist-form');
const todoinput = document.querySelector('.js-todolist-input');
const ul = document.querySelector('.js-todolist');

const weather = document.querySelector('.js-weather');

const body = document.querySelector('body');

const h4 = document.querySelector('.js-name-h4');
const nameForm = document.querySelector('.js-name-form');
const nameInput = document.querySelector('.js-name-input');
const nameContainer = document.querySelector('.js-todolist-container');

const weekday = ['월요일','화요일','수요일','목요일','금요일','토요일','일요일']

let todolist = [];
const todolist_NS = 'todo';
const weather_NS = 'weather';
const user_NS = "username";

const showing = "showing";
const API = '6e22e58c6900a7ffdd1559d13f9f3311';


function loadTodo(){    
    const items = localStorage.getItem(todolist_NS);   
    if(items !== null){
        JSON.parse(items).forEach( (todo) => {paintTodo(todo.contents);} );
    }            
}

function deleteTodo(e){
    //paintTodo 삭제
    const li = e.target.parentNode;
    li.parentNode.removeChild(li);

    // localStorage 삭제
    const filtering = todolist.filter((todo) => todo.id !== parseInt(li.id));
    todolist = filtering;
    saveTodo();
 }
    

function saveTodo(){
    localStorage.setItem(todolist_NS, JSON.stringify(todolist));
}

function paintTodo(text){
    
    const li = document.createElement('li'),
        span = document.createElement('span'),
        delBtn = document.createElement('button');
    
    span.innerText = text;
    delBtn.innerText = "X";

    li.appendChild(span);
    li.appendChild(delBtn);
    ul.appendChild(li);

    const todoLength = todolist.length+1;
    li.id = todoLength;    
    const todo = {
         id : todoLength,
         contents : text
    }
    todolist.push(todo);
    saveTodo();

    delBtn.addEventListener('click', deleteTodo);
}

function handleTodo(e){
    e.preventDefault();
    const text = todoinput.value;
    paintTodo(text);
    todoinput.value ="";    
    
}

function getTime(){
const today = new Date();

const year = today.getFullYear();
const month = today.getMonth();
const date = today.getDate();

const day = today.getDay();


const hours = today.getHours();
const minutes = today.getMinutes();
const seconds = today.getSeconds();

const ampm = hours <= 12 ? '오전' : '오후';

  const newhours = hours % 12 ? hours : 12; // the hour '0' should be '12'

  clock.innerText =
  `${year}년 ${month}월 ${date}일 ${weekday[day]}
   ${ampm} ${newhours}:${minutes < 10 ? `0${hours}` : `${hours}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
}


function paintImage() {
    const IMG_NUMBER = 7;
    const number = Math.ceil(Math.random() * IMG_NUMBER);

    const image = new Image();
    image.src = `./${number}.jpg`;
    image.className = "bgImage";
    body.prepend(image);

}

function getWeather(la,lo){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${la}&lon=${lo}&appid=${API}&units=metric`)
    .then((response) => response.json())
    .then((json) => {
        const city = json.name;
        const main = json.weather[0].main;
        const temp = json.main.temp;
        weather.innerText = 
        `${city} / ${main} / ${temp}도`;
    })
    

}

function handleFail(){
    console.log("날씨 정보를 받아오는데 실패함")
}

function handleSuccess(e){
    const latitude = e.coords.latitude;
    const longitude = e.coords.longitude;

    const coordObject = {
        latitude: latitude,
        longitude: longitude
    }
    localStorage.setItem(weather_NS, JSON.stringify(coordObject));
    getWeather(latitude, longitude);
}

function getLocation(){
     navigator.geolocation.getCurrentPosition(handleSuccess, handleFail);

}

function loadWeather(){
    const loaded= localStorage.getItem(weather_NS)
    if(loaded === null){
        getLocation();
    }else{
        const get = JSON.parse(localStorage.getItem(weather_NS));        
        getWeather(get.latitude, get.longitude);
    }
}

function eraseName(){
    localStorage.removeItem(user_NS);
    h4.classList.remove(showing);
    nameForm.classList.add(showing);
    // nameForm.addEventListener('submit', handleName); 

    nameContainer.classList.remove(showing);
}


function paintName(name){
    
    nameForm.classList.remove(showing);    
    h4.classList.add(showing);    
    h4.innerText = `반가워요~ ${name}님`;

    
    const button = document.createElement('button');
    button.innerText = "X";
    h4.appendChild(button);
    button.addEventListener('click', eraseName); 
    
    nameContainer.classList.add(showing);
  
}

function handleName(e){
    e.preventDefault();
    const input = nameInput.value;   
    nameInput.value = "";    
    paintName(input);
    localStorage.setItem(user_NS, input);
}


function loadName(){
    const currentUser = localStorage.getItem(user_NS);
    if (currentUser === null){        
        nameForm.classList.add(showing);
        // nameForm.addEventListener('submit', handleName); 
    } else {
        paintName(currentUser);
    }
}


function init(){
    setInterval(getTime, 1000);
    loadTodo();
    todoform.addEventListener('submit', handleTodo);
    paintImage();
    loadWeather();
    loadName();    
    nameForm.addEventListener('submit', handleName);  
     
}
init();
