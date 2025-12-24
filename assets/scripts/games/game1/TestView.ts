import { _decorator, Node, Label } from 'cc';
import { BaseView } from '@framework/mvcs/view/BaseView';
import { ViewType } from '@framework/mvcs/view/ViewDefine';
import { BundleName } from '@config/Config';
import { Toast } from '../common/Toast';
import { SysBox } from '../common/SysBox';

const { ccclass, property } = _decorator;

/** 测试界面 */
@ccclass('TestView')
export class TestView extends BaseView {
    @property({ type: Label, displayName: '测试节点' })
    private mLabel: Label = null;

    protected GetPrefabURL(): { bundle: string; prefab: string } {
        return { bundle: BundleName.GAME1, prefab: 'prefabs/TestView' };
    }

    protected GetDrawLevel(): ViewType {
        return ViewType.scene;
    }

    protected OnLoad(): void {
        super.OnLoad();
    }

    private OnClick1() {
        this.mLabel && (this.mLabel.string = '你好世界');
        Toast.Show('Hello World 你好世界')
    }

    private OnClick2() {
        SysBox.Show('Hello World 你好世界')
    }
}