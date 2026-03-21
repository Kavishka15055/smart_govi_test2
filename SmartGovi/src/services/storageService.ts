import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

class StorageService {
  async uploadProfilePhoto(uri: string, userId: string): Promise<string> {
    try {
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      
      const fileRef = ref(storage, `profilePhotos/${userId}_${Date.now()}`);
      await uploadBytes(fileRef, blob);
      
      // We're done with the blob, close and release it
      if ((blob as any).close) {
        (blob as any).close();
      }
      
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading profile photo:', error);
      throw new Error(error.message || 'Failed to upload photo');
    }
  }
}

export const storageService = new StorageService();
