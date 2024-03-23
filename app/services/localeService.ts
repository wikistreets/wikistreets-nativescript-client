import { Application, ApplicationSettings, Device, File, Utils } from '@nativescript/core';
import { getString } from '@nativescript/core/application-settings';
import { l, lc, lt, lu, loadLocaleJSON } from '@nativescript-community/l';
import { writable, derived } from 'svelte/store';

// let default24Clock = false;
// default24Clock = android.text.format.DateFormat.is24HourFormat(Utils.ad.getApplicationContext());
// if (__ANDROID__) {
//     default24Clock = android.text.format.DateFormat.is24HourFormat(Utils.ad.getApplicationContext());
// }
// export let clock_24 = ApplicationSettings.getBoolean('clock_24', default24Clock) || default24Clock;

export const getLanguage = () => {
    let selectedLanguage: string = Device.language.split('-')[0] // get device default language
    let appPrefsLang = getString('__app__language__') // only available after the first time you use overrideLocaleNative(langName);
    selectedLanguage = appPrefsLang ? appPrefsLang : selectedLanguage    
    return selectedLanguage
}

export const lang = writable(getLanguage(), () => {
    console.log(`lang store got a subscriber!`)
    return () => {
        console.log(`lang store has no more subscribers!`)
    }
})

/**
 * Load the language file for the app.
 * @param selectedLanguage The language to load, e.g. 'en', 'fr', 'es', etc.
 */
export const loadLanguage = (selectedLanguage: string) => {
    console.log(`Locale: ${selectedLanguage}`)
    try {
        // try first
        loadLocaleJSON(require(`~/i18n/${selectedLanguage}`))
      }
      catch {
        try {
            // try second
            loadLocaleJSON(require(`~/i18n/${selectedLanguage}.default`))
        }
        catch {
            // give up
            console.error(`Error loading locale file for ${selectedLanguage}`)
        }
      }
    }

/**
 * Set the language for the app by subscribing to the Svelte lang store and triggering the loadLocaleJSON function.
 */
export const languageListener = () => {
    lang.subscribe( (newLang: string) => {
        loadLanguage(newLang)
    })
}

 export { l, lc, lt, lu }
 