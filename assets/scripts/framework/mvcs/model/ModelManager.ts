import { _decorator } from 'cc';
import { ContainerManager } from '../base/ContainerManager';
import { BaseModel } from './BaseModel';

const { ccclass } = _decorator;

/**
 * model管理
 */
@ccclass('ModelManager')
export class ModelManager extends ContainerManager<BaseModel> {
    protected OnInit() {
        // 根据配置列表实例化model
        // this.HandInitContainer(['TestModel']);
        // this.HandInitContainer([TestModel]);

        // 自动抓取BaseModel的派生类列表，并实例化，存放在容器中
        this.AutoInitContainer(BaseModel);
    }
}
