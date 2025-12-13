import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorite/favorite.module';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { RequestResponseLoggingInterceptor } from './common/interceptors/errors-logging-inteceptor';
import { LoggingService } from './common/services/logging.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggingService,
    { provide: APP_INTERCEPTOR, useClass: RequestResponseLoggingInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
