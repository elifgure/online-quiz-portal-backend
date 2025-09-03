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
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    // ✅ JWT ile kimlik doğrulama
    this.io.use(async (socket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.replace("Bearer ", "");
        if (!token) return next(new Error("Authentication error"));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return next(new Error("User not found"));
        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.userName = user.name;
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    });
    // ✅ Bağlantı yönetimi
    this.io.on("connection", (socket) => {
      console.log(`User Connected: ${socket.userName} (${socket.userRole})`);
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
      });
      // Online kullanıcı sayısını gönder
      this.broadcastOnlineUsers();
      // Çıkış
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userName}`);
        this.connectedUsers.delete(socket.userId);
        this.broadcastOnlineUsers();
      });
    });
    return this.io;
  }
  // Online Kullanıcı sayısı
  broadcastOnlineUsers() {
    this.io.emit("online_users_count", { count: this.connectedUsers.size });
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
    const creatorSocketId = this.connectedUsers.get(quiz.createdBy.toString())
    if (creatorSocketId) {
      this.io.to(creatorSocketId).emit('notification', notification);
    }
  }
}
const socketService = new SocketService();
module.exports = socketService;