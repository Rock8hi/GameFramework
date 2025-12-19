import { _decorator } from 'cc';
import { ContainerManager } from '../base/ContainerManager';
import { BaseService } from './BaseService';

const { ccclass } = _decorator;

/**
 * service管理
 */
@ccclass('ServiceManager')
export class ServiceManager extends ContainerManager<BaseService> {
    protected OnInit() {
        // 根据配置列表实例化service
        // this.HandInitContainer(['SampleService']);

        // 自动抓取BaseService的派生类列表，并实例化，存放在容器中
        this.AutoInitContainer(BaseService);
    }
}
