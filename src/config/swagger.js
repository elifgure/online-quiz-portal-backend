const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Quiz Portal API',
      version: '1.0.0',
      description: 'Online Quiz Portal için RESTful API dokümantasyonu.\n\n**Authenticate Etmek İçin:**\n1. Önce `/api/auth/register` ile kayıt olun\n2. `/api/auth/login` ile giriş yapıp JWT token alın\n3. Sağ üstteki "Authorize" butonuna tıklayın\n4. Açılan pencerede "Bearer" yazmadan sadece JWT tokenı yapıştırın\n5. "Authorize" butonuna tıklayın',
      contact: {
        name: 'API Desteği',
        url: 'https://github.com/elifgure'
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Kimlik doğrulama ve yetkilendirme'
      },
      {
        name: 'Users',
        description: 'Kullanıcı yönetimi'
      },
      {
        name: 'Questions',
        description: 'Soru yönetimi'
      },
      {
        name: 'Quizzes',
        description: 'Quiz yönetimi'
      },
      {
        name: 'Results',
        description: 'Sonuç yönetimi'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
