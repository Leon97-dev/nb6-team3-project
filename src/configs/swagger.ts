import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dear Carmate API',
            version: '1.0.0',
            description: '3조 Dear Carmate 프로젝트 API 문서입니다.',
        },
        servers: [
            {
                url: 'http://localhost:3001', // 환경에 맞게 수정 필요
                description: 'Local Server',
            },
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
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/modules/**/*-route.ts', './src/modules/**/*-route.js'], // 라우트 파일 경로 패턴
};

export const specs = swaggerJsdoc(options);
