// const io = require('socket.io')
const socket = io("http://localhost:8000");
const audio = new Audio('ting.mp3')
const data =[];


const form  = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer =document.querySelector(".container");
const user_name = document.getElementById('user_name');
const all_users = document.getElementById('all_users');
const user_count =document.querySelector(".user_count");
const list =document.getElementById('list');

user_name.style.color='blue'

const append=(data,position)=>{
const messageElement = document.createElement('div');
messageElement.classList.add('message');
messageElement.classList.add(position);
messageElement.innerText=data;
messageContainer.append(messageElement);
if(position=='left'){
    audio.play()
}

} 

function verifyPropt(value){
  if(value=='' || value==null || value == 'Name required!'){
      return false;
  }else{
    return true;
  }
}

const names = prompt('Enter your name to join','Name required!');
let res =verifyPropt(names)
if(!res){
    alert("Please enter a valid name!")
    window.location.reload();
}
socket.emit('new-user-joined',names);
user_name.innerText=names;
socket.emit('setdata')

function toggleDropdown() {
  var dropdown = document.getElementById("users_div");
  if (dropdown.style.display === "none") {
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
}

all_users.addEventListener('click',()=>{
    toggleDropdown();
}) 

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`,'right');
    socket.emit('send',message);
    messageInput.value=""; 
})

socket.on('setdata',(data)=>{
    console.log(data);
    let count=0;
    list.innerHTML=null;
    for(let key in data){
        let li =document.createElement('li');
        li.innerText=data[key];
        list.append(li);
        count++;
    }
   user_count.innerText=count;
    
})
socket.on('user-joined',({name,data})=>{
    append(`${name} joined the chat`,'right')    
    socket.emit('setdata')
})
socket.on('receive',(data)=>{
    append(`${data.message} : ${data.user}`,'left')
    socket.emit('setdata')

    
})
socket.on('left',name=>{
    append(`${name} disconnected!`,'right')
    socket.emit('setdata')

})
