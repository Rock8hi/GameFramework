import { _decorator } from 'cc';
import { BaseObject } from '../base/BaseObject';

const { ccclass } = _decorator;

/**
 * Control基类
 */
@ccclass('BaseController')
export abstract class BaseController extends BaseObject {}
