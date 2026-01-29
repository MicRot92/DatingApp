import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../../../Types/photo';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/services/account-service';
import { Member } from '../../../Types/member';
import { StarButton } from "../../../shared/star-button/star-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
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

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({

      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) {
          this.accountService.setCurrentUser({
            ...currentUser,
            photoUrl: photo.url
          });
        }
        this.memberService.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member);
      }
    });
  };
}


