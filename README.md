# 🚀 Özellikler

- 👥 Kullanıcı Yönetimi (Kayıt, Giriş, Token Yenileme)
- 🔐 JWT tabanlı kimlik doğrulama ve yetkilendirme
- 🛡️ Rol tabanlı erişim kontrolü (Admin, Öğretmen, Öğrenci)
- 🔑 Şifre sıfırlama ve email doğrulama sistemi
- 📝 Kapsamlı Quiz ve Soru Yönetimi
  - Çoktan seçmeli sorular
  - Doğru/Yanlış soruları
  - Metin tabanlı sorular
  - Soru güncelleme ve silme
- 📊 Detaylı Sonuç Takibi
  - Öğrenci bazlı sonuç görüntüleme
  - Quiz bazlı performans analizi
  - Doğru/yanlış cevap istatistikleri
- 🔒 Güvenlik Önlemleri
  - CORS koruması
  - Rate Limiting
  - XSS Koruması
  - MongoDB Injection önleme
  - HTTP Parameter Pollution koruması
- ✅ Input Validasyonu
  - Express Validator entegrasyonu
  - Özelleştirilmiş hata mesajları
- 📝 Detaylı Loglama Sistemi
  - Winston logger entegrasyonu
  - Ortam bazlı log yapılandırması
  - Hata ve performans takibiortal Backend

Bu proje, online quiz portal uygulamasının backend API servisidir. Node.js, Express.js ve MongoDB kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- 👥 Kullanıcı Yönetimi (Kayıt, Giriş, Token Yenileme)
- 🔐 JWT tabanlı kimlik doğrulama
- 🛡️ Rol tabanlı yetkilendirme (Admin, Öğretmen, Öğrenci)
- � Şifre sıfırlama ve email doğrulama sistemi
- �📝 Quiz ve Soru yönetimi
- 📊 Sonuç takibi ve detaylı analiz
- 🔒 Güvenlik önlemleri (CORS, Rate Limiting, XSS Protection vb.)
- 📝 Input validasyonu
- 🪵 Winston logger entegrasyonu

## 🛠️ Teknolojiler

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Winston (Loglama)
- Express Validator
- Bcrypt (Şifreleme)
- Nodemailer (Email servisi)
- ve diğer güvenlik araçları (helmet, cors, xss-clean vb.)

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

3. Çevre değişkenlerini ayarlayın:
`.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri doldurun:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/your_db_name
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

# Email ayarları (Şifre sıfırlama için)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
FRONTEND_URL=http://localhost:5173
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
├── config/          # Yapılandırma dosyaları (DB, logger)
├── controllers/     # Route handler'lar
├── middlewares/     # Express middleware'leri
├── models/         # Mongoose modelleri
├── routes/         # API route'ları
├── utils/          # Yardımcı fonksiyonlar
├── validators/     # Input validasyon şemaları
├── loaders/        # Uygulama başlatıcıları
└── server.js       # Ana uygulama dosyası
```

## 🔑 API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/refresh` - Access token yenileme
- `POST /api/auth/logout` - Çıkış yapma
- `POST /api/auth/forgot-password` - Şifre sıfırlama talebi
- `POST /api/auth/reset-password/:token` - Yeni şifre belirleme

### Kullanıcı İşlemleri
- `GET /api/users/profile` - Kullanıcı profili görüntüleme
- `GET /api/users` - Tüm kullanıcıları listele (Admin)
- `PATCH /api/users/:id` - Kullanıcı rolü güncelleme (Admin)

### Quiz İşlemleri
- `GET /api/quizzes` - Quizleri listele (Role'e göre farklı içerik)
- `POST /api/quizzes` - Yeni quiz oluştur (Teacher, Admin)
- `PUT /api/quizzes/:id` - Quiz güncelle (Teacher, Admin)
- `DELETE /api/quizzes/:id` - Quiz sil (Teacher, Admin)

### Soru İşlemleri
- `POST /api/questions` - Yeni soru oluştur (Teacher, Admin)
- `PUT /api/questions/:id` - Soru güncelle (Teacher, Admin)

### Sonuç İşlemleri
- `POST /api/results/submit` - Quiz sonucu gönder (Student)
- `GET /api/results/my-results` - Kendi sonuçlarını listele (Student)
- `GET /api/results/my-results/:id` - Belirli bir sonucu görüntüle (Student)
- `GET /api/results/my-quiz-results` - Kendi quizlerinin sonuçları (Teacher)
- `GET /api/results/teacher/:id` - Belirli bir sonucu detaylı görüntüle (Teacher)
- `GET /api/results` - Tüm sonuçları listele (Admin)

## 🔒 Güvenlik

Proje aşağıdaki güvenlik önlemlerini içerir:

- Helmet (HTTP headers güvenliği)
- CORS yapılandırması
- Rate limiting
- XSS koruması
- MongoDB injection koruması
- HTTP Parameter Pollution koruması
- JWT tabanlı kimlik doğrulama

## 🪵 Loglama

Winston logger kullanılarak:
- Development ortamında console'a
- Production ortamında dosyalara (`logs/error.log`, `logs/combined.log`) log kaydı yapılır

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
