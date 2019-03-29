
cc.Class({
    extends: cc.Component,

    properties: {
        curDirection: 1, //-1面向右，1面向左
        moveSpeed: 0, //像素每秒
    },

    start: function () {
        console.log('enemy_crawl__start');
    },

    onLoad: function () {
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.play('mucus');
        this.rigidbody = this.node.getComponent(cc.RigidBody);
    },

    update: function (dt) {
        // this.moveAction(this.moveSpeed * dt);
    },
    //刚体碰撞组件回调
    //只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("__role_contact_begin");
        if (otherCollider.node.name != 'role') {
            //todo 改变方向
            this.curDirection = -this.curDirection;
            this.node.scaleX = this.curDirection;

        } else {
            //tode 死亡
        }
    },
    //每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        // console.log("_role_contact_preSolve..");
        // var manifold = contact.getManifold();
        // var localPoints = manifold.points;
        // for (var i = 0; i < localPoints.length; i++) {
        //     console.log('xxx_local_point[' + i + ']=' + '(' + localPoints[i].localPoint.x + ',' + localPoints[i].localPoint.y + ')');
        // }
        // var worldManifold = contact.getWorldManifold();
        // var worldPoints = worldManifold.points;
        // for (var i = 0; i < worldPoints.length; i++) {
        //     console.log('xxx_wrold_point[' + i + ']=' + '(' + worldPoints[i].x + ',' + worldPoints[i].y + ')');
        // }
    },
    //每次处理完碰撞体接触逻辑时被调用
    onPostContact: function (contact, selfCollider, otherCollider) {

    },
    //只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

    }
});
