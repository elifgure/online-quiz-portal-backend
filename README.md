# Online Quiz Portal Backend

Bu proje, online quiz portal uygulamasının backend API servisidir. Node.js, Express.js ve MongoDB kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- 👥 Kullanıcı Yönetimi (Kayıt, Giriş, Token Yenileme)
- 🔐 JWT tabanlı kimlik doğrulama
- 🛡️ Rol tabanlı yetkilendirme (Admin, Öğretmen, Öğrenci)
- 📝 Quiz ve Soru yönetimi
- 📊 Sonuç takibi
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

### Kullanıcı İşlemleri
- `GET /api/users/profile` - Kullanıcı profili görüntüleme
- `GET /api/users` - Tüm kullanıcıları listele (Admin)
- `PATCH /api/users/:id` - Kullanıcı rolü güncelleme (Admin)

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
