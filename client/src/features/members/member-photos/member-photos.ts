import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../../../Types/photo';
import { AsyncPipe } from '@angular/common';
import { ImageUpload } from "../../../shared/image-upload/image-upload";

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe, ImageUpload],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe(photos => {
        this.photos.set(photos);
      });
    }
  }


  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.loading.set(false);
        this.memberService.editMode.set(false);
        this.photos.update(photos => [...photos, photo]);
      },
      error: (error) => {
        console.error('Error uploading photo:', error);
        this.loading.set(false);
      }
    })
  };

  getPhotoMocks() {
    return Array.from({ length: 20 }, (_, i) => ({
      url: '/user.png'
    }));
  }
}
