//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    public avatar: Object;

    constructor() {
        super();

        this.avatar = new Object();
        this.avatar["body"] = new AvatarPart("body");
        this.avatar["wing"] = new AvatarPart("wing");
        this.avatar["weapon"] = new AvatarPart("weapon");
        this.avatar["skill"] = new AvatarPart("skill");
    }

    // 加载纸娃娃部件
    public loadAvatarPart(type:string, resname:string) {
        var self = this;
        var part = self.avatar[type];

        if (part.mc && part.mc.parent) {
            self.removeChild(part.mc);
            part.mc = null;
        }

        if (resname == "") {
            return;
        }

        loadMovieClip("resource/" + resname, "act", function(mc: egret.MovieClip){
            part.mc = mc;
            self.drawAvatar();
        }, true, 6);
    }

    // 重绘角色动画
    public drawAvatar() {
        this.removeChildren();

        var parts = ["body", "wing", "weapon", "skill"];

        for (let partname of parts) {
            let part = this.avatar[partname];
            if (part.mc) {
                this.addChild(part.mc);
                part.mc.gotoAndPlay(1, -1);
                part.mc.x = 200;
                part.mc.y = 200;

                console.log(partname, part.mc.currentFrame);
            }
        } 
    }

    protected createChildren(): void {
        super.createChildren();

        main = this;

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        // const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }


    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
     
        this.loadAvatarPart("body", "p_401_act0_1_1");
        this.loadAvatarPart("wing", "cb_wing02_act0_1_1");
        this.loadAvatarPart("weapon", "w_201_act0_1_1");
        this.loadAvatarPart("skill", "skill_1_act1_1_1");
    }
}
