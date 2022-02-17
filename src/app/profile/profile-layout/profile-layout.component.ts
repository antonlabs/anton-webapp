import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalService} from "../../modal.service";
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent extends AntiMemLeak implements OnInit, AfterViewInit {

  @ViewChild('cropImage', {static: true}) cropImage: TemplateRef<any> | undefined;
  currentModal: TemplateRef<any> | undefined;
  croppedImage: any = '';
  imageToCropBase64: string | undefined;

  modalsRoutes: {[key: string]: TemplateRef<any> | undefined} = {};

  constructor(
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.modalsRoutes = {
      cropImage: this.cropImage
    };
    this.sub.add(
      this.activatedRoute.queryParams.subscribe(queryParams => {
        this.imageToCropBase64 = localStorage.getItem(queryParams['lsK'])!;
        this.currentModal = this.modalsRoutes[queryParams['modal']];
      })
    );
  }

  closeModal() {
    this.modalService.closeModal();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }



}
