const express = require('express');
const { authenticate } = require('../middlewares/auth');
const socketService = require('../config/socket');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const router = express.Router();

// Test notification gönderme
router.post('/send-notification', authenticate, async (req, res) => {
    try {
        const { message, type = 'test', targetRole = 'student' } = req.body;
        
        if (!message) {
            throw new ApiError(400, 'Message gerekli');
        }

        // Notification gönder
        const result = await socketService.sendNotificationToRole(targetRole, {
            type,
            message,
            data: {
                sentBy: req.user.name,
                timestamp: new Date()
            }
        });

        res.status(200).json(new ApiResponse(200, result, 'Notification başarıyla gönderildi'));
    } catch (error) {
        throw new ApiError(500, `Notification gönderilemedi: ${error.message}`);
    }
});

// Socket.IO durumu kontrol
router.get('/socket-status', authenticate, (req, res) => {
    try {
        const io = socketService.getIO();
        const connectedSockets = io.engine.clientsCount || 0;
        
        // Namespace bilgileri
        const namespaces = [];
        io._nsps.forEach((nsp, name) => {
            namespaces.push({
                name: name,
                connectedClients: nsp.sockets.size
            });
        });

        const status = {
            isRunning: !!io,
            connectedSockets,
            namespaces,
            serverInfo: {
                transport: io.engine.transports,
                cors: io.engine.opts.cors
            }
        };

        res.status(200).json(new ApiResponse(200, status, 'Socket.IO durumu'));
    } catch (error) {
        throw new ApiError(500, `Socket durumu alınamadı: ${error.message}`);
    }
});

// Connected clients listesi
router.get('/connected-clients', authenticate, (req, res) => {
    try {
        const io = socketService.getIO();
        const clients = [];
        
        // Tüm namespace'lerdeki clientları listele
        io.of('/').sockets.forEach((socket) => {
            clients.push({
                id: socket.id,
                userId: socket.userId || 'unknown',
                role: socket.userRole || 'unknown',
                connected: socket.connected,
                handshake: {
                    time: socket.handshake.time,
                    address: socket.handshake.address
                }
            });
        });

        res.status(200).json(new ApiResponse(200, { 
            totalClients: clients.length, 
            clients 
        }, 'Bağlı clientlar'));
    } catch (error) {
        throw new ApiError(500, `Client listesi alınamadı: ${error.message}`);
    }
});

// Test ping mesajı
router.post('/ping', authenticate, (req, res) => {
    try {
        const io = socketService.getIO();
        const { targetSocketId } = req.body;
        
        if (targetSocketId) {
            // Belirli bir socket'e ping gönder
            const targetSocket = io.of('/').sockets.get(targetSocketId);
            if (targetSocket) {
                targetSocket.emit('ping', { 
                    message: 'ping from server', 
                    timestamp: new Date() 
                });
                res.status(200).json(new ApiResponse(200, { targetSocketId }, 'Ping gönderildi'));
            } else {
                throw new ApiError(404, 'Socket bulunamadı');
            }
        } else {
            // Tüm clientlara ping gönder
            io.emit('ping', { 
                message: 'broadcast ping', 
                timestamp: new Date() 
            });
            res.status(200).json(new ApiResponse(200, { broadcast: true }, 'Broadcast ping gönderildi'));
        }
    } catch (error) {
        throw new ApiError(500, `Ping gönderilemedi: ${error.message}`);
    }
});

module.exports = router;
