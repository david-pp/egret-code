// TypeScript file

//
// 纸娃娃部件
//
class AvatarPart {
    constructor(type:string) {
        this.type = type;
    }

    public type: string;
    public mc: egret.MovieClip 
}

//
// 选择事件处理
//
var main: Main;

function onSelectBody(value) {
    main.loadAvatarPart("body", value);
}

function onSelectWeapon(value) {
    main.loadAvatarPart("weapon", value);
}

function onSelectWing(value) {
    main.loadAvatarPart("wing", value);
}

function onSelectSkill(value) {
    main.loadAvatarPart("skill", value);
}

//
// 加载动画资源
//
function loadMovieClip(resname: string, act:string, callback: Function, isChuanQi:boolean = false, frameRate:number = 6) {
    var load_texture;  // png
    var load_data;     // json
    var self = this;

    // ChuanQi -> MovieClip
    var chuanqi2MC = function(chuanqi) {
        var mc = new Object();
        mc["file"] = chuanqi["resName"] + ".png";
        mc["mc"] = {};
        mc["res"] = {};
        mc["mc"]["act"] = {
            "frameRate": frameRate,
            "frames":[],
        };

        var frames = mc["mc"]["act"]["frames"];

        // 第一种形式(SubTexture数组)
        if (chuanqi.SubTexture) {
            for (let tex of chuanqi.SubTexture) {
                console.log(tex);

                // 资源在SpriteSheet中的位置
                mc["res"][tex.name] = {
                    "x": tex.x,
                    "y": tex.y,
                    "w": tex.width,
                    "h": tex.height,
                }  

                // 每一帧及其显示偏移
                var frame = {
                    "duration":1,
                    "x": tex.ofx,
                    "y": tex.ofy,
                    "res": tex.name,
                };
                frames.push(frame);
            }
        }
        // 第二种形式(subtexture对象) 
        else if (chuanqi.subtexture) {
            for (let texname in chuanqi.subtexture) {
                var tex = chuanqi.subtexture[texname];
                //  console.log(tex);
                mc["res"][tex.name] = {
                    "x": tex.x,
                    "y": tex.y,
                    "w": tex.width,
                    "h": tex.height,
                }  

                var frame = {
                    "duration":1,
                    "x": tex.ofx,
                    "y": tex.ofy,
                    "res": tex.name,
                };
                frames.push(frame);
            }
        }

        frames.sort(function(a:any, b:any):any {
            return a.res > b.res;
        });

        return mc;
    }

    var check = function (loader: any) {
        if (loader.dataFormat == egret.URLLoaderDataFormat.TEXTURE) {
            load_texture = loader.data;
        } else if (loader.dataFormat == egret.URLLoaderDataFormat.TEXT) {
            load_data = JSON.parse(loader.data);
        }

        if (load_data && load_texture) {

            var data = load_data;
            if (isChuanQi) {
                data = chuanqi2MC(load_data);
            }

            var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, load_texture);
            var mc:egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData(act));
            callback(mc);
        }
    }

    // png
    var loader = new egret.URLLoader();
    loader.addEventListener(egret.Event.COMPLETE, function loadOver(e) {
        check(e.currentTarget);
    }, this);

    loader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
    var request = new egret.URLRequest(resname + ".png");
    loader.load(request);

    // json
    var loader = new egret.URLLoader();
    loader.addEventListener(egret.Event.COMPLETE, function loadOver(e) {
       check(e.currentTarget);
    }, this);
    loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
    var request = new egret.URLRequest(resname + ".json");
    loader.load(request);
}
