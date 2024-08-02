module.exports = (app, io) => {
    app.use('/api/v1/auth', require('./routes/api/v1/auth'));
    app.use('/api/v1/user', require('./routes/api/v1/user'));
    app.use('/api/v1/company', require('./routes/api/v1/company'));
    app.use('/api/v1/waRoutes', require('./routes/api/v1/waRoutes'));
    app.use('/api/v1/payment', require('./routes/api/v1/payment'));
    app.use('/api/v1/sendMessage', require('./routes/api/v1/messageRoute'));
    app.use('/api/v1/createTicket', require('./routes/api/v1/ticketRoutes'))
    app.use('/api/v1/ticket', require('./routes/api/v1/tickets'))

    const { initializeSocket } = require('./sockets');
    initializeSocket(io);

}