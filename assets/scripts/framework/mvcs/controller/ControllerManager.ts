import { _decorator } from 'cc';
import { ContainerManager } from '../base/ContainerManager';
import { BaseController } from './BaseController';

const { ccclass } = _decorator;

/**
 * controller管理
 */
@ccclass('ControllerManager')
export class ControllerManager extends ContainerManager<BaseController> {
    protected OnInit() {
        // 根据配置列表实例化ctrl
        // this.HandInitContainer(['SampleCtrl']);

        // 自动抓取BaseController的派生类列表，并实例化，存放在容器中
        this.AutoInitContainer(BaseController);
    }
}
