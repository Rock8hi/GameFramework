import { _decorator } from 'cc';
import { BaseObject } from '../base/BaseObject';

const { ccclass } = _decorator;

/**
 * Model基类
 */
@ccclass('BaseModel')
export abstract class BaseModel extends BaseObject {}
