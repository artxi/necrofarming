import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { JoinComponent } from './join/join.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MyPicksComponent } from './my-picks/my-picks.component';
import { AuthGuard } from './auth.guard';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    JoinComponent,
    HomeComponent,
    ProfileComponent,
    MyPicksComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
