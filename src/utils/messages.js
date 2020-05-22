const generateMessage = (message, username) => {
    return({
        username,
        message,
        createdAt: new Date().getTime()
    })
}

module.exports = {
    generateMessage
}