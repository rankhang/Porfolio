import { CustomComponents } from '../common';
import * as i0 from "@angular/core";
/**
 * Stores and provides custom components that users provide with `amplify-slot`.
 */
export declare class CustomComponentsService {
    private _customComponents;
    get customComponents(): CustomComponents;
    set customComponents(customComponents: CustomComponents);
    static ɵfac: i0.ɵɵFactoryDeclaration<CustomComponentsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CustomComponentsService>;
}
