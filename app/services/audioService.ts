import { Application, Utils, Dialogs, File, knownFolders } from '@nativescript/core';
import { TNSPlayer, TNSRecorder, AudioRecorderOptions, AudioPlayerOptions } from '@nativescript-community/audio'
import { request } from '@nativescript-community/perms';

export class AudioPlayer {
    private _meterInterval: number
    private _player: TNSPlayer
    public currentVolume: any
    audioMeter: any = 0
    audioTrackDuration: number
    remainingDuration: number // used to show the remaining time of the audio track
    private durationTracker: any
    private volumeTracker: any
    
    constructor(permissionsCallback=(args:any) => console.log(args), debugMode: boolean = false, volumeLevel: number = 1) {
        this._player = new TNSPlayer();
        this._player.debug = debugMode; // set true for tns_player logs

        this.currentVolume = volumeLevel;

        request({
            storage:{}
        }).then(permissionsCallback)
    }

    public getFilePath() {
        const audioFolder = knownFolders.externalDocuments().getFolder('audio');
        const filePath = `${audioFolder.path}/recording.${this.platformExtension}`
        // const audioFolder = knownFolders.currentApp().getFolder('audio');
        // const recordedFile: File = audioFolder.getFile(`recording.${this.platformExtension}`);
        return filePath
    }

    /**
     * Check whether audio is currently playing
     */
    public get isPlaying() {
        return this._player.isAudioPlaying()
    }

    async start(audioFile: string, loop=false, completeCallBack=(args:any)=>null, errorCallback=(err:any)=>null, infoCallback=(args:any)=>null) {
        const fileType = audioFile.startsWith('http') ? 'remote' : 'local'
        try {
            const playerOptions: AudioPlayerOptions = {
                audioFile,
                loop,
                completeCallback: async (args:any) => {
                    await this._player.dispose();
                    this._stopDurationTracking()
                    this._stopVolumeTracking()
                    completeCallBack(args)
                },
                errorCallback: (err:any) => {
                    this._stopDurationTracking()
                    this._stopVolumeTracking()
                    errorCallback(err)
                },
                infoCallback: (args:any) => {
                    infoCallback(args)
                }
            };


            if (fileType === 'local') {
                await this._player.playFromFile(playerOptions).catch((err: any) => {
                    errorCallback(err)
                });
                this.audioTrackDuration = await this._player.getAudioTrackDuration()
                // start audio duration tracking
                this.durationTracker = this._startDurationTracking(this.audioTrackDuration)
                this.volumeTracker = this._startVolumeTracking()
            } else if (fileType === 'remote') {
                await this._player.playFromUrl(playerOptions).catch((err: any) => {
                    errorCallback(err)
                });
            }
        } catch (err: any) {
            this._stopDurationTracking()
            this._stopVolumeTracking()
            errorCallback(err)
        }
    }

    public resume() {
        this._player.resume()
        this._startDurationTracking(this.audioTrackDuration)
        this._startVolumeTracking()
    }

    /**
     * PAUSE PLAYING
     */
    public async pause() {
        try {
            await this._player.pause();
            this._stopDurationTracking()
            this._stopVolumeTracking()
        } catch (error) {
        }
    }

    /**
     * STOP PLAYING
     */
    public async stop() {
        await this._player.dispose();
        this._stopDurationTracking()
        this._stopVolumeTracking()
        
    }

    mute() {
        this.currentVolume = this._player.volume;
        this._player.volume = 0;
    }

    unmute() {
        this._player.volume = 0.2;
    }

    skipTo(time: number) {
        this._player.seekTo(time);
    }

    playSpeed(speed: number) {
        this._player.changePlayerSpeed(speed);
    }

    private get platformExtension() {
        // 'mp3'
        return `${__ANDROID__ ? 'm4a' : 'caf'}`;
    }

    private async _startDurationTracking(duration) {
        if (this._player && this._player.isAudioPlaying()) {
            const tracker = Utils.setInterval(() => {
                this.remainingDuration = duration - this._player.currentTime;
                // console.log(`this.remainingDuration = ${this.remainingDuration}`);
            }, 1000);
            return tracker
        }
    }

    private _startVolumeTracking() {
        if (this._player) {
            const tracker = Utils.setInterval(() => {
                console.log('volume tracking', this._player.volume);
                this.currentVolume = this._player.volume;
            }, 2000);
            return tracker
        }
    }


    private _stopDurationTracking() {
        if (this.durationTracker) {
            clearInterval(this.durationTracker);
            this.durationTracker = undefined;
        }
    }

    private _stopVolumeTracking() {
        if (this.volumeTracker) {
            clearInterval(this.volumeTracker);
            this.volumeTracker = undefined;
        }
    }

}

export class AudioRecorder {
    private _recorder: TNSRecorder
    private _meterInterval: number
    isRecording:boolean = false
    audioMeter: any = 0
    recordedAudioFile: string
    currentVolume: number

    constructor(permissionsCallback=(r:any) => console.log(r), debugMode: boolean = false) {
        this._recorder = new TNSRecorder();
        this._recorder.debug = debugMode; // set true for tns_recorder logs

        request({
            microphone:{},
            storage:{}
        }).then(permissionsCallback)
    }

    async start(args) {
        try {
            if (!TNSRecorder.CAN_RECORD()) {
                Promise.reject('This device cannot record audio.')
                return;
            }

            let androidFormat: number
            let androidEncoder: number
            if (__ANDROID__) {
                // m4a
                // static constants are not available, using raw values here
                // androidFormat = android.media.MediaRecorder.OutputFormat.MPEG_4;
                androidFormat = 2;
                // androidEncoder = android.media.MediaRecorder.AudioEncoder.AAC;
                androidEncoder = 3
            }

            const recordingPath = this.getFilePath()

            const recorderOptions: AudioRecorderOptions = {
                filename: recordingPath,
                format: androidFormat,
                sampleRate: 48000,
                android: __ANDROID__ ? {
                    encoder: androidEncoder
                } :  undefined,

                metering: true,

                infoCallback: (infoObject) => {
                    console.log(JSON.stringify(infoObject))
                },

                errorCallback: (errorObject) => {
                    console.log(JSON.stringify(errorObject))
                }
            };

            await this._recorder.start(recorderOptions)
            this.isRecording = true;
            if (recorderOptions.metering) {
                this._initMeter()
            }
        } catch (err) {
            this.isRecording = false;
            this._resetMeter()
            Promise.reject(err)
        }
    }

    async stop(args) {
        this._resetMeter();
        await this._recorder.stop().catch((ex) => {
            console.log(ex);
            this.isRecording = false;
            this._resetMeter();
        });

        this.isRecording = false;
        // alert('Recorder stopped.');
        this._resetMeter();
    }

    private _initMeter() {
        this._resetMeter();
        this._meterInterval = setInterval(() => {
            this.audioMeter = this._recorder.getMeters()
            console.log(this.audioMeter);
        }, 300);
    }

    private _resetMeter() {
        if (this._meterInterval) {
            this.audioMeter = 0
            clearInterval(this._meterInterval);
            this._meterInterval = undefined;
        }
    }

    public getFilePath() {
        const audioFolder = knownFolders.externalDocuments().getFolder('audio');
        const filePath = `${audioFolder.path}/recording.${this.platformExtension}`
        // const audioFolder = knownFolders.currentApp().getFolder('audio');
        // const recordedFile: File = audioFolder.getFile(`recording.${this.platformExtension}`);
        return filePath
    }

    public getFile(filePath) {
        try {
            console.log('recording exists: ' + File.exists(filePath))
            this.recordedAudioFile = filePath
        } catch (ex) {
            console.log(ex)
        }
    }

    private get platformExtension() {
        // 'mp3'
        return __ANDROID__ ? 'm4a' : 'caf'
    }

}


