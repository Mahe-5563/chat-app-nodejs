const users = [];


const addUser = ({id, username, roomname}) => {

    username = username.toUpperCase();
    roomname = roomname.toUpperCase();

    if(!username || !roomname){
        return{
            error:"No User name or room"
        }
    }

    const existingUser = users.find((user) => user.roomname === roomname && user.username === username)

    if(existingUser){
        return{
            error:"User or room already exists!"
        }
    }

    const user = {id, username, roomname}
    users.push(user);
    return { user }

}

const removeUser = (id) => {

    const index = users.findIndex( user => user.id === id)

    if(index != -1){
        return users.splice(index, 1)[0]
    }
}


const getUser = (id) => {

    return users.find( user => user.id === id);
}

const getUsersInRoom = (roomname) => {
    roomname = roomname.toUpperCase();
    return users.find( user => user.roomname === roomname)
}


module.exports = {
    addUser,
    getUser, 
    getUsersInRoom, 
    removeUser
}