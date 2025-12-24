import { BaseEntry } from '@framework/BaseEntry';
import { I18nManager } from '@extension/i18n/I18nManager';

export class Entry extends BaseEntry {
    /** 多语言 */
    public static I18n: I18nManager = null;
}
