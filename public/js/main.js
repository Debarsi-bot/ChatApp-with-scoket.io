const socket = io();
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

//receive message sent by server
socket.on('message', message=>{
  console.log(message)
  outputMessageToDom(message)

  //scroll down to last message
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//submit a message
chatForm.addEventListener('submit', (e)=>{
  // stop form submission
  e.preventDefault()
  //extract the message
  const message = e.target.elements.msg.value
  
  //emit a message to the server with the extracted message as the payload
  socket.emit('chatMessage', message)
  //clear chat box input after the message has been sent to server
  e.target.msg.value = ''
  e.target.elements.msg.focus()
  
})

//show messaage to client's DOM
function outputMessageToDom(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class = "meta">${message.username} <span>${message.time}</span></p>
                   <p class = "text">
                   ${message.text}
                   </p>`
  document.querySelector('.chat-messages').appendChild(div)

}