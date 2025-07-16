import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import { AppConfigService } from './config/config.service';
import { setupSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    try {
        const app = await NestFactory.create(MainModule);

        app.use(compression());
        app.use(json({ limit: '50mb' }));
        app.use(urlencoded({ limit: '50mb', extended: true }));
        app.getHttpAdapter().getInstance().set('trust proxy', 1);

        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

        app.enableCors({
            origin: '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });

        const configService = app.get(AppConfigService);
        const port = configService.runPort;

        setupSwagger(app);

        // Define routes
        const server = app.getHttpAdapter().getInstance();
        server.get('/', (_req: any, res: { send: (arg0: string) => void }) => {
            res.send('job-api');
        });
        server.get('/api', (_req: any, res: { send: (arg0: string) => void }) => {
            res.send('job-api');
        });

        await app.listen(port);
        console.log(`✅ Server is running on: ${await app.getUrl()}`);
    } catch (error) {
        console.error('Error during bootstrap:', error);
    }
}
void bootstrap();
