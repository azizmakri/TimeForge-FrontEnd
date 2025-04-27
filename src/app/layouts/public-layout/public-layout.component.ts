import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './public-layout.component.html',
  standalone: true,
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {
  ngAfterViewInit(): void {
    const toggleButton = document.getElementById("menu-toggle");
    const wrapper = document.getElementById("wrapper");

    if (toggleButton && wrapper) {
      toggleButton.addEventListener("click", () => {
        wrapper.classList.toggle("toggled");
      });
    }
  }

}
