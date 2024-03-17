import { CameraOptions, isAvailable, requestCameraPermissions, takePicture } from '@nativescript/camera'
import { Dialogs, EventData, Frame, Image, ImageAsset } from '@nativescript/core'

export const DEFAULT_CAMERA_OPTIONS: CameraOptions = {
    width: 500,
    height: 500,
    keepAspectRatio: true,
    saveToGallery: false,
    modalPresentationStyle: (__IOS__) ? UIModalPresentationStyle.Custom : null // FullScreen creates some layout problems with icons
}

class CameraService {
    
    constructor(cameraOptions: CameraOptions = DEFAULT_CAMERA_OPTIONS) {
        this.cameraOptions = cameraOptions
    }

    private cameraOptions: CameraOptions
    private permission: boolean = false

    public get isPermission() {
        return this.permission
    }
    public set isPermission(value: boolean) {
        this.permission = value
    }


    public async solicitPermission(): Promise<boolean> {
        // request camera permissions, if not yet done
        return await requestCameraPermissions().then(
            () => {
                // permission granted
                // console.log(`Camera permission granted.`)
                this.isPermission = true
                return true
            },
            () => {
                //permission denied
                // console.log(`Camera permission denied.`)
                this.isPermission = false
                return false
            }
        )
    }

    public async takePhoto() {
        try {
            // take a photo
            const imageAsset: ImageAsset = await takePicture(this.cameraOptions);
            const image = new Image()
            image.src = imageAsset;
            return image
        } catch (err) {
            return Promise.reject(err)
        }
    }
    
}

export const cameraService = new CameraService()