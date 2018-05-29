// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//
// 纸娃娃部件
//
var AvatarPart = (function () {
    function AvatarPart(type) {
        this.type = type;
    }
    return AvatarPart;
}());
__reflect(AvatarPart.prototype, "AvatarPart");
//
// 选择事件处理
//
var main;
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
function loadMovieClip(resname, act, callback, isChuanQi, frameRate) {
    if (isChuanQi === void 0) { isChuanQi = false; }
    if (frameRate === void 0) { frameRate = 6; }
    var load_texture; // png
    var load_data; // json
    var self = this;
    // ChuanQi -> MovieClip
    var chuanqi2MC = function (chuanqi) {
        var mc = new Object();
        mc["file"] = chuanqi["resName"] + ".png";
        mc["mc"] = {};
        mc["res"] = {};
        mc["mc"]["act"] = {
            "frameRate": frameRate,
            "frames": [],
        };
        var frames = mc["mc"]["act"]["frames"];
        // 第一种形式(SubTexture数组)
        if (chuanqi.SubTexture) {
            for (var _i = 0, _a = chuanqi.SubTexture; _i < _a.length; _i++) {
                var tex_1 = _a[_i];
                console.log(tex_1);
                // 资源在SpriteSheet中的位置
                mc["res"][tex_1.name] = {
                    "x": tex_1.x,
                    "y": tex_1.y,
                    "w": tex_1.width,
                    "h": tex_1.height,
                };
                // 每一帧及其显示偏移
                var frame = {
                    "duration": 1,
                    "x": tex_1.ofx,
                    "y": tex_1.ofy,
                    "res": tex_1.name,
                };
                frames.push(frame);
            }
        }
        else if (chuanqi.subtexture) {
            for (var texname in chuanqi.subtexture) {
                var tex = chuanqi.subtexture[texname];
                //  console.log(tex);
                mc["res"][tex.name] = {
                    "x": tex.x,
                    "y": tex.y,
                    "w": tex.width,
                    "h": tex.height,
                };
                var frame = {
                    "duration": 1,
                    "x": tex.ofx,
                    "y": tex.ofy,
                    "res": tex.name,
                };
                frames.push(frame);
            }
        }
        frames.sort(function (a, b) {
            return a.res > b.res;
        });
        return mc;
    };
    var check = function (loader) {
        if (loader.dataFormat == egret.URLLoaderDataFormat.TEXTURE) {
            load_texture = loader.data;
        }
        else if (loader.dataFormat == egret.URLLoaderDataFormat.TEXT) {
            load_data = JSON.parse(loader.data);
        }
        if (load_data && load_texture) {
            var data = load_data;
            if (isChuanQi) {
                data = chuanqi2MC(load_data);
            }
            var mcFactory = new egret.MovieClipDataFactory(data, load_texture);
            var mc = new egret.MovieClip(mcFactory.generateMovieClipData(act));
            callback(mc);
        }
    };
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
//# sourceMappingURL=Avatar.js.map