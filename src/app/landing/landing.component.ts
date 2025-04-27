import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, RippleModule, StyleClassModule, ButtonModule, DividerModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingComponent implements OnInit {
  showAnimation = true;  // To control if the animation is visible

  ngOnInit(): void {

  }


}
