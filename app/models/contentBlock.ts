import { Image } from '@nativescript/core'

export interface ContentBlock {
    type: 'blank-slate' | 'image' | 'audio' | 'video' | 'text'
    text?: string,
    image?: Image,
    audio?: string,
    video?: string,
    isPlaying?: boolean
}