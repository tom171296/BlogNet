import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';
import { RecentlyPlacedComponent } from './recently-placed/recently-placed.component';
import { FeaturedPostsComponent } from './featured-posts/featured-posts.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    RecentlyPlacedComponent,
    FeaturedPostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
