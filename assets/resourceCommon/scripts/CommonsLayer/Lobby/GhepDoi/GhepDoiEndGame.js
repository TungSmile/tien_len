
cc.Class({
    extends: cc.Component,

    properties: {
        findPlayerNode: cc.Node,
    },
    getFindPlayerNode: function () {
        if (this.findPlayerNode && cc.isValid(this.findPlayerNode)) {
            return this.findPlayerNode;
        }
        return null;
    },
    resetGhepDoiStatus: function () {
        var rePlayScript = this.getReplayPanelComponent();
        if (rePlayScript) {
            rePlayScript.showReadyButton(true);
            rePlayScript.showFindNewPlayer(true);
        }
    },
    getReplayPanelComponent: function () {
        var rePlayNode = this.node.getChildByName("Replay");
        if (rePlayNode) {
            var rePlayScript = rePlayNode.getComponent("ReplayPanel");
            if (rePlayScript) {
                return rePlayScript;
            }
        }
        return null;
    },
    updateReplayPopup: function (message) {
        var rePlayScript = this.getReplayPanelComponent();
        if (rePlayScript) {
            rePlayScript.updateReplayPopup(message);
        }
    },
    onEnable: function () {
        this.showAvataFinding();
    },
    showAvataFinding: function () {
        var rePlayScript = this.getReplayPanelComponent();
        if (rePlayScript) {
            rePlayScript.showAvataFinding();
        }
    }

    // update (dt) {},
});
