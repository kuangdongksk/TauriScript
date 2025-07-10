import axios from "axios";

// https://webapi.blizzard.cn/hs-cards-api-server/api/web/cards/tavern

export type Tier = 1 | 2 | 3 | 4 | 5 | 6 | 7

export enum EBgGameMode {
  双打 = "duos",
  单人 = "solos",
}

export enum EBgCardType {
  畸变 = "anomaly",
  英雄 = "hero",
  随从 = "minion",
  任务 = "quest",
  奖励 = "reward",
  法术 = "spell",
  饰品 = "trinket",
}

export enum EMinionType {
  亡灵 = "undead",
  恶魔 = "demon",
  海盗 = "pirate",
  机械 = "mech",
  龙 = "dragon",
  娜迦 = "naga",
  野兽 = "beast",
  野猪人 = 'quilboar',
  鱼人 = 'murloc',
  元素 = 'elemental',
}

export interface IGetCardsRequestParams {
  attack: number;
  bgCardType: EBgCardType;
  bgGameMode: EBgGameMode;
  health: number;
  minionType: EMinionType;
  page: number;
  pageSize: number;
  sort: string;
  textFilter: string;
  tier: Tier[];
  spell_school: 'greater_trinket' | 'lesser_trinket';
}

export function getCards(params?: IGetCardsRequestParams) {

  return axios({
    method: 'post',
    url: 'https://webapi.blizzard.cn/hs-cards-api-server/api/web/cards/tavern',
    data: params,
    headers: { 'Content-Type': 'application/json' },
  })
}