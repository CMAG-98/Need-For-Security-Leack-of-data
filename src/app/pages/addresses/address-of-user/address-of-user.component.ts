import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'app-address-of-user',
  templateUrl: './address-of-user.component.html',
  styleUrls: ['./address-of-user.component.scss']
})
export class AddressOfUserComponent implements OnInit {

  userId!: number;
  theFormGroup!: FormGroup;
  options!: L.MapOptions;
  layers!: L.Layer[];

  constructor(
    private addressService: AddressService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadAddress();
      }
    });
  }

  loadAddress(): void {
    this.addressService.getByUserId(this.userId).subscribe(address => {
      this.theFormGroup = this.fb.group({
        id: [address.id],
        street: [address.street],
        number: [address.number],
        latitude: [address.latitude],
        longitude: [address.longitude]
      });

      this.theFormGroup.disable(); // Hacer solo lectura

      const lat = address.latitude;
      const lng = address.longitude;
      this.options = this.getMapOptions(lat, lng);
      this.layers = this.getMapLayers(lat, lng);
    });
  }

  back(): void {
    this.router.navigate(['/users/list']);
  }

  getMapOptions(lat: number, lng: number): L.MapOptions {
    return {
      center: L.latLng(lat, lng),
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    };
  }

  getMapLayers(lat: number, lng: number): L.Layer[] {
    return [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      L.marker([lat, lng])
    ];
  }
}
