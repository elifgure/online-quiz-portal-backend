const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
  }
  init(server) {
    // express server'a socket io bağlıyor.
    this.io = new Server(server, {
      path: '/socket.io/', // Explicit path tanımı
      cors: {
        origin: "*", // Geliştirme için tüm origin'lere izin ver
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
      },
      transports: ['websocket', 'polling'], // Her iki transport'u da destekle
      allowEIO3: true, // Eski socket.io versiyonları için uyumluluk
      serveClient: true, // Client dosyalarını serve et - 
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Engine.IO event listeners için debugging
    this.io.engine.on("connection_error", (err) => {
      console.log('❌ Socket.IO Engine Connection Error:');
      console.log('Request URL:', err.req?.url);
      console.log('Error Code:', err.code);
      console.log('Error Message:', err.message);
      console.log('Error Context:', err.context);
      console.log('Headers:', err.req?.headers);
    });

    // Raw socket'lar için middleware (namespace sorunu için)
    this.io.engine.use((req, res, next) => {
      console.log('🔧 Engine middleware - URL:', req.url);
      console.log('🔧 Engine middleware - Headers:', req.headers);
      next();
    });

    // ✅ JWT ile kimlik doğrulama - Root namespace için
    this.io.use(async (socket, next) => {
      try {
        console.log('🔐 Socket.IO Auth Middleware triggered');
        console.log('🔐 Socket handshake query:', socket.handshake.query);
        console.log('🔐 Socket handshake headers:', socket.handshake.headers);
        console.log('🔐 Socket handshake auth:', socket.handshake.auth);

        // Token'ı farklı yerlerden alma denemesi
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.replace("Bearer ", "") ||
          socket.handshake.query.token ||
          socket.handshake.headers.token;

        console.log('🔐 Extracted token:', token ? 'Token found' : 'No token');

        if (!token) {
          console.log('❌ No token provided in auth middleware');
          return next(new Error("No authentication token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔐 JWT decoded successfully:', { id: decoded.id, role: decoded.role });
        
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
          console.log('❌ User not found for decoded token');
          return next(new Error("User not found"));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.userName = user.name;
        
        console.log('✅ Socket authentication successful:', {
          userId: socket.userId,
          userName: socket.userName,
          userRole: socket.userRole
        });
        
        next();
      } catch (error) {
        console.error('❌ Socket authentication error:', error.message);
        next(new Error(`Authentication failed: ${error.message}`));
      }
    });
    
    // Namespace explicit tanımı - Bu kritik!
    console.log('🔧 Initializing Socket.IO namespaces...');
    
    // Root namespace için explicit handler
    const rootNamespace = this.io.of('/');
    rootNamespace.use(async (socket, next) => {
      // Aynı auth middleware'i namespace için de uygula
      try {
        console.log('🔐 Namespace Auth Middleware triggered for:', socket.id);
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.replace("Bearer ", "") ||
          socket.handshake.query.token ||
          socket.handshake.headers.token;

        if (!token) {
          return next(new Error("No authentication token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
          return next(new Error("User not found"));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.userName = user.name;
        
        console.log('✅ Namespace authentication successful for:', socket.userName);
        next();
      } catch (error) {
        console.error('❌ Namespace authentication error:', error.message);
        next(new Error(`Namespace auth failed: ${error.message}`));
      }
    });

    // ✅ Bağlantı yönetimi
    this.io.on("connection", (socket) => {
      console.log(`🔗 User Connected: ${socket.userName} (${socket.userRole}) - Socket ID: ${socket.id}`);
      
      // Listeye ekle
      this.connectedUsers.set(socket.userId, socket.id);
      
      // Rol ve kullanıcı odalarına ekle
      socket.join(socket.userRole);
      socket.join(`user_${socket.userId}`);
      
      // İlk mesaj
      socket.emit("connected", {
        message: "Successfully connected to notification service",
        userId: socket.userId,
        role: socket.userRole,
        socketId: socket.id,
        timestamp: new Date()
      });
      
      // Online kullanıcı sayısını gönder
      this.broadcastOnlineUsers();

      // Test event'i ekleyelim
      socket.on('test_message', (data) => {
        console.log('Test message received:', data);
        socket.emit('test_response', {
          message: 'Test successful',
          receivedData: data,
          timestamp: new Date()
        });
      });

      // Ping-pong test
      socket.on('ping', () => {
        console.log('Ping received from:', socket.userName);
        socket.emit('pong', { 
          message: 'pong',
          timestamp: new Date(),
          user: socket.userName 
        });
      });
      
      // Çıkış
      socket.on("disconnect", (reason) => {
        console.log(`❌ User disconnected: ${socket.userName} - Reason: ${reason}`);
        this.connectedUsers.delete(socket.userId);
        this.broadcastOnlineUsers();
      });

      // Error handling
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
    return this.io;
  }
  // Online Kullanıcı sayısı
  broadcastOnlineUsers() {
    this.io.emit("online_users_count", { count: this.connectedUsers.size });
  }

  // Belirli bir role notification gönder
  sendNotificationToRole(role, notificationData) {
    try {
      console.log(`📢 Sending notification to role: ${role}`, notificationData);
      this.io.to(role).emit("notification", notificationData);
      return {
        success: true,
        message: `Notification sent to ${role} role`,
        data: notificationData
      };
    } catch (error) {
      console.error('❌ Error sending notification to role:', error);
      throw error;
    }
  }

  // Belirli bir kullanıcıya notification gönder
  sendNotificationToUser(userId, notificationData) {
    try {
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        console.log(`📢 Sending notification to user: ${userId}`, notificationData);
        this.io.to(socketId).emit("notification", notificationData);
        return {
          success: true,
          message: `Notification sent to user ${userId}`,
          data: notificationData
        };
      } else {
        console.log(`⚠️ User ${userId} is not connected`);
        return {
          success: false,
          message: `User ${userId} is not connected`,
          data: notificationData
        };
      }
    } catch (error) {
      console.error('❌ Error sending notification to user:', error);
      throw error;
    }
  }

  // IO instance'ı dış kullanım için
  getIO() {
    return this.io;
  }
  // Öğretmen quiz oluşturduğunda → tüm öğrencilere
  notifyNewQuiz(quiz, createdBy) {
    const notification = {
      type: "NEW_QUIZ",
      title: "Yeni Quiz Oluşturuldu!",
      message: `${createdBy.name} "${quiz.title}" adlı yeni bir quiz oluşturdu.`,
      quiz: {
        id: quiz._id,
        title: quiz.title,
      },
      createdBy: {
        name: createdBy.name,
        role: createdBy.role,
      },
      timestamp: new Date(),
    };
    this.io.to("student").emit("notification", notification);
  }
  //  Öğrenci quiz bitirdiğinde → sadece ilgili öğretmene
  notifyQuizCompleted(result, student, quiz) {
    const notification = {
      type: "QUIZ_COMPLETED",
      title: "Quiz Tamamlandı!",
      message: `${student.name} "${quiz.title}" quizi tamamladı. Puan: ${result.score}/${result.totalQuestions}`,
      result: {
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        percentage: (
          (result.correctAnswers / result.totalQuestions) *
          100
        ).toFixed(2),
      },
      student: {
        name: student.name,
        email: student.email,
      },
      quiz: {
        id: quiz._id,
        title: quiz.title,
      },
      timestamp: new Date(),
    };
    // Sadece quiz'i oluşturan öğretmene gönder
    const creatorSocketId = this.connectedUsers.get(quiz.createdBy.toString());
    if (creatorSocketId) {
      this.io.to(creatorSocketId).emit("notification", notification);
    }
  }
}
const socketService = new SocketService();
module.exports = socketService;
