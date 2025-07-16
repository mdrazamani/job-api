import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('job-api')
        .setDescription('API documentation')
        .setVersion('1.0.0')
        .addBearerAuth({
            description: 'Please enter token:',
            name: 'Authorization',
            bearerFormat: 'Bearer',
            scheme: 'Bearer',
            type: 'http',
            in: 'Header'
        })
        .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api/docs', app, document, {
        explorer: true,
        swaggerOptions: {
            filter: true,
            showRequestDuration: true,
            url: '/api/docs-json',
            layout: 'StandaloneLayout'
        },
        jsonDocumentUrl: '/docs/json',
        yamlDocumentUrl: '/docs/yaml'
    });

    // Endpoint to download Swagger JSON
    app.getHttpAdapter()
        .getInstance()
        .get('/api/docs.json', (_req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=swagger.json');
            res.send(document);
        });
}
