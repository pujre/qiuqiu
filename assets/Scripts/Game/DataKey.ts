
export enum DataKey {
    /**金币 */
    Coin = 'Coin_',
    /**已解锁关卡 */
    UnLockLevel='UnLockLevel_',
    /**当前签到时间戳*/
    SigininTimeKey = 'SigininTimeKey_',
    /**当前总共签到天数*/
    SigininNumber = 'SigininNumber_',
    /**新手引导 */
    NewGuide = 'NewGuide_',
    /**当前拥有道具的数量*/
    Prop = 'Prop_',
    /**奖励类型是否已经领取 */
    TaskreWard='TaskreWard_',
    /**任务类型 */
    TaskType='TaskType',
    /**玩家等级 */
    Level='Level_',
    /**当前玩家的经验值 */
    Exp='Exp_',
    /**当前玩家解锁的角色 */
    PlayerId='PlayerId_',
    /**震动 */
    Shake='Shake_',
    /**皮肤 */
    SkillId='SkillId_',
    /**当前使用的皮肤id */
    NowSkillId='NowSkillId_',
    /**是否已添加桌面快捷方式*/
    addDeskTopIsOn='addDeskTopIsOn_',
}

/**事件消息头 */
export enum EventHead{
    /**开始游戏 */
    StarGame='StarGame',
    /**游戏结束 */
    GameOver='GameOverWin',
    /**游戏结束（胜利） */
    GameOverWin='GameOverWin',
    /**游戏结束（失败） */
    GameOverLose='GameOverWin',
    /**更新当前金币余额 */
    UpDateCoin='UpDateCoinCoin',
    /**更新当前道具剩余数量 */
    UpDateProp='UpDateProp',
    /**男球皮肤更换 */
    PlayerSkillUpdate='PlayerSkillUpdate',
    /**女球皮肤更换 */
    ArmsSkillUpdate='ArmsSkillUpdate',
}

/**游戏状态 */
export enum GameStatus{
     /**空闲 */
     Idel='Idel',
     /**游戏中*/
     Gameing='Gameing',
     /**暂停*/
     Pause='Pause',
     /**游戏结束 */
     GameOver='GameOver',
}


