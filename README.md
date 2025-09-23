# Online Quiz Portal Backend

Bu proje, online quiz portal uygulamasının backend API servisidir. Node.js, Express.js ve MongoDB kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- 👥 **Kullanıcı Yönetimi**
  - Kayıt, Giriş, Token Yenileme
  - JWT tabanlı kimlik doğrulama ve yetkilendirme
  - Rol tabanlı erişim kontrolü (Admin, Öğretmen, Öğrenci)
  - Şifre sıfırlama ve email doğrulama sistemi

- 📝 **Kapsamlı Quiz ve Soru Yönetimi**
  - Çoktan seçmeli sorular
  - Doğru/Yanlış soruları
  - Metin tabanlı sorular
  - Quiz oluşturma, güncelleme ve silme
  - Soru güncelleme ve silme
  - Quiz başlatma optimizasyonu 

- 📊 **Detaylı Sonuç Takibi**
  - Öğrenci bazlı sonuç görüntüleme
  - Quiz bazlı performans analizi
  - Doğru/yanlış cevap istatistikleri
  - Öğretmen için quiz sonuçları dashboard'u
  - Quiz çözme sistemı 

- 🌐 **Gerçek Zamanlı Bildirimler (Socket.IO)**
  - Yeni quiz oluşturulduğunda öğrencilere bildirim
  - Quiz tamamlandığında öğretmene bildirim
  - Online kullanıcı sayısı takibi
  - JWT tabanlı Socket.IO authentication
  - Test endpoint'leri ile debugging

- 📚 **API Dokümantasyonu (Swagger UI)**
  - Tüm endpoint'lerin detaylı dokümantasyonu
  - Interaktif API test arayüzü
  - JWT authentication entegrasyonu
  - Role-based endpoint documentation

- 🔒 **Güvenlik Önlemleri**
  - CORS koruması
  - Rate Limiting
  - Helmet (HTTP headers güvenliği)
  - XSS Koruması (xss-clean)
  - MongoDB Injection önleme
  - HTTP Parameter Pollution koruması

- ✅ **Input Validasyonu**
  - Express Validator entegrasyonu
  - Özelleştirilmiş hata mesajları
  - Comprehensive error handling

- 📝 **Detaylı Loglama Sistemi**
  - Winston logger entegrasyonu
  - Ortam bazlı log yapılandırması
  - Hata ve performans takibi

## 🛠️ Teknolojiler

### Backend Framework
- **Node.js** v18+
- **Express.js** v5.1.0 (Latest)

### Database
- **MongoDB** (Mongoose ODM v8.17.2)

### Authentication & Security
- **JWT** (JSON Web Tokens) v9.0.2
- **Bcrypt** v6.0.0 (Password hashing)
- **Helmet** v8.1.0 (HTTP headers security)
- **CORS** v2.8.5
- **Express Rate Limit** v8.0.1
- **XSS Clean** (via hpp v0.2.3)

### Real-time Communication
- **Socket.IO** v4.8.1 (WebSocket support)

### API Documentation
- **Swagger UI Express** v5.0.1
- **Swagger JSDoc** v6.2.8

### Validation & Logging
- **Express Validator** v7.2.1
- **Winston** v3.17.0 (Logging)
- **Morgan** v1.10.1 (HTTP request logger)

### Email Service
- **Nodemailer** v7.0.6

### Development Tools
- **Nodemon** v3.1.10 (Development server)
- **Dotenv** v17.2.1 (Environment variables)

## 📦 Kurulum

1. Repoyu klonlayın:
```bash
git clone <repo-url>
cd online-quiz-portal-backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. **Çevre değişkenlerini ayarlayın:**
`.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri doldurun:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/quiz_portal
# veya MongoDB Atlas için:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz_portal

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration (Şifre sıfırlama için)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
FRONTEND_URL=http://localhost:5173

# Security
BCRYPT_SALT_ROUNDS=12
```

4. Uygulamayı başlatın:
```bash
# Development modunda
npm run dev

# Production modunda
npm start
```

## 📁 Proje Yapısı

```
src/
├── config/          # Yapılandırma dosyaları
│   ├── db.js        # MongoDB bağlantı yapılandırması
│   ├── logger.js    # Winston logger yapılandırması
│   └── socket.js    # Socket.IO yapılandırması ve service
├── controllers/     # Route handler'lar
│   ├── auth.controller.js      # Authentication işlemleri
│   ├── quiz.controller.js      # Quiz CRUD ve startQuiz
│   ├── question.controller.js  # Soru yönetimi
│   ├── result.controller.js    # Quiz çözme ve sonuç takibi
│   └── user.controller.js      # Kullanıcı profil işlemleri
├── middlewares/     # Express middleware'leri
├── models/         # Mongoose modelleri
│   ├── User.js        # Kullanıcı modeli (Admin/Teacher/Student)
│   ├── Quizzes.js     # Quiz modeli
│   ├── Questions.js   # Soru modeli (multiple types)
│   └── Results.js     # Quiz sonuçları modeli
├── routes/         # API route'ları
│   ├── auth.routes.js     # Authentication endpoints
│   ├── quiz.routes.js     # Quiz management endpoints
│   ├── question.routes.js # Question management endpoints
│   ├── result.routes.js   # Quiz solving endpoints
│   ├── user.routes.js     # User management endpoints
│   └── test.routes.js     # Socket.IO test endpoints
├── utils/          # Yardımcı fonksiyonlar
├── validators/     # Input validasyon şemaları
├── loaders/        # Uygulama başlatıcıları
│   └── express.js  # Express app yapılandırması
├── .env.example    # Environment variables örneği
└── server.js       # Ana uygulama dosyası
```

## 🔑 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)
- `POST /register` - Yeni kullanıcı kaydı
- `POST /login` - Kullanıcı girişi
- `POST /refresh` - Access token yenileme
- `POST /logout` - Çıkış yapma
- `POST /forgot-password` - Şifre sıfırlama talebi
- `POST /reset-password/:token` - Yeni şifre belirleme

### 👥 User Management (`/api/users`)
- `GET /profile` - Kullanıcı profili görüntüleme
- `GET /` - Tüm kullanıcıları listele (Admin only)
- `PATCH /:id` - Kullanıcı rolü güncelleme (Admin only)

### 📝 Quiz Management (`/api/quizzes`)
- `GET /` - Quizleri listele (Role-based content)
- `GET /:id` - Belirli quiz detayları
- `POST /` - Yeni quiz oluştur (Teacher, Admin)
- `PUT /:id` - Quiz güncelle (Teacher, Admin)
- `DELETE /:id` - Quiz sil (Teacher, Admin)
- `POST /:id/start` - Quiz başlat (Student) - **Optimized endpoint**

### ❓ Question Management (`/api/questions`)
- `POST /` - Yeni soru oluştur (Teacher, Admin)
- `PUT /:id` - Soru güncelle (Teacher, Admin)
- `DELETE /:id` - Soru sil (Teacher, Admin)

### 📊 Result Management (`/api/results`)
- `POST /solve-quiz` - Quiz çöz ve sonucu gönder (Student)
- `GET /my-results` - Kendi sonuçlarını listele (Student)
- `GET /my-results/:id` - Belirli bir sonucu görüntüle (Student)
- `GET /my-quiz-results` - Kendi quizlerinin sonuçları (Teacher)
- `GET /teacher/:id` - Belirli bir sonucu detaylı görüntüle (Teacher)
- `GET /` - Tüm sonuçları listele (Admin)

### 🧪 Test & Debug (`/api/test`)
- `GET /socket-status` - Socket.IO durumu (Authenticated)
- `GET /connected-clients` - Bağlı Socket.IO clientları (Authenticated)
- `POST /broadcast` - Test broadcast mesajı (Authenticated)

## 🌐 Gerçek Zamanlı Bildirimler (Socket.IO)

Proje, Socket.IO v4.8.1 kullanarak gerçek zamanlı bildirim sistemi içerir:

### Bağlantı ve Authentication
- JWT tabanlı Socket.IO authentication
- Namespace-based connection management
- Real-time connection status tracking

### Bildirim Tipleri
- **NEW_QUIZ**: Yeni quiz oluşturulduğunda öğrencilere gönderilir
- **QUIZ_COMPLETED**: Quiz tamamlandığında öğretmene gönderilir
- **ONLINE_USERS_COUNT**: Online kullanıcı sayısı güncellemeleri

### Socket.IO Events
```javascript
// Client'dan dinlenecek events
'ping' - Bağlantı test eventi
'disconnect' - Kullanıcı bağlantı koptu

// Server'dan gönderilen events  
'online_users_count' - Online kullanıcı sayısı
'new_quiz_notification' - Yeni quiz bildirimi
'quiz_completed_notification' - Quiz tamamlanma bildirimi
```

### Debug Endpoints
- `GET /api/test/socket-status` - Socket.IO server durumu
- `GET /api/test/connected-clients` - Bağlı client listesi



```

## 📚 API Dokümantasyonu

Swagger UI ile detaylı API dokümantasyonu `/api-docs` endpoint'inde mevcuttur.

### Swagger Kullanımı
1. Sunucuyu başlatın
2. `http://localhost:5000/api-docs` adresine gidin
3. "Authorize" butonuna tıklayın
4. JWT token'ınızı girin (Bearer yazmadan)
5. API endpoint'lerini test edin

## 🔒 Güvenlik

Proje aşağıdaki güvenlik önlemlerini içerir:

### HTTP Security
- **Helmet** v8.1.0 - HTTP headers güvenliği
- **CORS** yapılandırması - Cross-origin resource sharing
- **Rate limiting** - API abuse prevention

### Input Validation & Sanitization
- **Express Validator** v7.2.1 - Input validation
- **XSS Protection** - Cross-site scripting prevention
- **MongoDB Injection** koruması
- **HTTP Parameter Pollution** koruması

### Authentication & Authorization
- **JWT** tabanlı kimlik doğrulama
- **Bcrypt** v6.0.0 ile password hashing
- **Role-based access control** (Admin, Teacher, Student)
- **Socket.IO JWT authentication**

### Security Headers
```javascript
// Helmet tarafından otomatik eklenen headers
Content-Security-Policy
Cross-Origin-Embedder-Policy
Cross-Origin-Opener-Policy
Cross-Origin-Resource-Policy
X-Content-Type-Options
X-DNS-Prefetch-Control
X-Frame-Options
X-Permitted-Cross-Domain-Policies
Referrer-Policy
```

## 🪵 Loglama

Winston logger v3.17.0 kullanılarak:

### Log Levels
- **Error**: Hata logları
- **Warn**: Uyarı mesajları  
- **Info**: Bilgi mesajları
- **Debug**: Debug bilgileri (sadece development)

### Log Destinations
- **Development**: Console output (colorized)
- **Production**: 
  - `logs/error.log` - Sadece error logları
  - `logs/combined.log` - Tüm log seviyeleri

### Log Format
```javascript
// Production log format
{
  "timestamp": "2025-09-23 21:05:47",
  "level": "info", 
  "message": "Server is running on port 5000"
}

// Development format (colorized console)
[2025-09-23 21:05:47] info: Server is running on port 5000
```

### HTTP Request Logging
Morgan middleware ile tüm HTTP requestler loglanır:
```
GET /api/quizzes 200 - 45.123 ms
POST /api/auth/login 200 - 156.789 ms
```

## � Deployment

### Environment Variables Checklist
```bash
# Required for production
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=secure_random_string
JWT_REFRESH_SECRET=another_secure_string
CORS_ORIGIN=https://yourdomain.com

# Optional (for email features)
EMAIL_SERVICE=gmail
EMAIL_USER=...
EMAIL_PASSWORD=...
FRONTEND_URL=https://yourdomain.com
```

### Production Considerations
- MongoDB Atlas cluster kurulumu
- Environment variables güvenli saklama
- HTTPS kullanımı
- Rate limiting yapılandırması
- Log dosyalarının yönetimi
- Socket.IO scaling (cluster mode)

## 🧪 Testing

### Socket.IO Test
1. Sunucuyu başlatın: `npm run dev`
2. `http://localhost:5000/api/test/socket-status` endpoint'ini test edin
3. Browser console'da Socket.IO bağlantısını kontrol edin

### API Test
- Swagger UI: `http://localhost:5000/api-docs`
- Postman collection'ları (`docs/` klasöründe)

## 🔧 Development

### Debugging
```bash
# Verbose logging ile başlatma
DEBUG=* npm run dev

# Sadece Socket.IO debugging
DEBUG=socket.io* npm run dev
```

### Code Structure Guidelines
- Controllers sadece request/response handling
- Business logic services'de
- Validation middleware'lerde
- Error handling centralized

## 📈 Performance

### Optimizations
- MongoDB indexing (User.email, Quiz.createdBy)
- JWT token caching
- Socket.IO connection pooling
- Rate limiting per endpoint
- Request/Response compression

### Monitoring
- Winston log analysis
- MongoDB performance metrics
- Socket.IO connection stats
