/**
 * This is the client side application.
 * all the connection up and down takes place here.
 */

const socket = io();

const $message_form = document.querySelector('#message-form');
const $send_btn = document.querySelector('#sendchat');
const $messages  = document.querySelector('#messages');
const $chat_input = document.getElementById('chatinput');
const $location_btn = document.querySelector('#showlocation');
const $message_templates = document.querySelector('#message-template').innerHTML;
const $location_message_template = document.querySelector('#location-message-template').innerHTML


const {username, roomname} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.emit('join', {username,roomname})


// WElcome user (or) A new user has been connected (or) a user is disconnected messages pop up here.
socket.on('welcome', (message) => {
    //console.log(message);
    const html = Mustache.render($message_templates, {
        recipient: message.username,
        message: message.message,
        createdAt: moment(message.createdAt).format('hh:mm a')

    });
    $messages.insertAdjacentHTML('beforeend', html)
})



//sending the message from the input field to the server...
$message_form.addEventListener('submit', (e)=>{
    e.preventDefault();

    $send_btn.setAttribute('disabled', 'disabled')

    const message = $chat_input.value
    socket.emit('chat', { message, username }, (reply)=>{
        $send_btn.removeAttribute('disabled')
        $chat_input.focus();
        $chat_input.value = '';
        console.log(reply);
    })
})
//getting the acknowledgement and displaying the input value from the server.
socket.on('reply', (message) => {

    const html = Mustache.render($message_templates, {
        recipient: message.username,
        message: message.message,
        createdAt: moment(message.createdAt).format('hh:mm a')

    });
    $messages.insertAdjacentHTML('beforeend', html)
    //console.log(message);
})



//Sending the geolocation on button click to the server..
$location_btn.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Browser does not support Geolocation');
    }
    navigator.geolocation.getCurrentPosition((pos)=>{

        $location_btn.setAttribute('disabled', 'disabled');
        socket.emit('mylocation', pos.coords.latitude, pos.coords.longitude, username, (ack) => {
            console.log(ack);
            $location_btn.removeAttribute('disabled');
        });
    })
})
//getting the geolocation from the server and displaying it
socket.on('location', (loc) => {
    const html = Mustache.render($location_message_template,{
        recipient: loc.username,
        loc: loc.message,
        createdAt: moment(loc.createdAt).format('hh:mm a')

    });
    $messages.insertAdjacentHTML('beforeend', html);
    //console.log(loc)
})
