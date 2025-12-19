import { _decorator } from 'cc';
import { BaseObject } from '../base/BaseObject';

const { ccclass } = _decorator;

/**
 * Service基类
 */
@ccclass('BaseService')
export abstract class BaseService extends BaseObject {}
