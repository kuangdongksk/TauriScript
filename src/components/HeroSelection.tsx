import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useState } from "react";

// 定义英雄类型
interface Hero {
  id: string;
  name: string;
  race: string;
  skill: {
    icon: string;
    name: string;
    description: string;
    cost: number;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
}

// 创建英雄原子状态
export const heroesAtom = atomWithStorage<Hero[]>("heroes", [
  {
    id: "001",
    name: "雷克萨",
    race: "兽人",
    skill: {
      icon: "hunt",
      name: "野性呼唤",
      description: "召唤一个随机野兽随从",
      cost: 2,
    },
    rarity: "epic",
  },
  {
    id: "002",
    name: "乌瑟尔",
    race: "人类",
    skill: {
      icon: "heal",
      name: "圣光之力",
      description: "治疗自身3点生命值",
      cost: 1,
    },
    rarity: "rare",
  },
  {
    id: "003",
    name: "古尔丹",
    race: "恶魔",
    skill: {
      icon: "skull",
      name: "牺牲治疗",
      description: "失去3生命获得6护甲",
      cost: 0,
    },
    rarity: "epic",
  },
  {
    id: "004",
    name: "伊利丹",
    race: "暗夜精灵",
    skill: {
      icon: "eye",
      name: "眼棱",
      description: "对随机敌人造成3伤害",
      cost: 1,
    },
    rarity: "legendary",
  },
]);

export const selectedHeroAtom = atomWithStorage<Hero | null>(
  "selectedHero",
  null
);

// 英雄卡牌组件
const HeroCard: React.FC<{
  hero: Hero;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ hero, isSelected, onSelect }) => {
  return (
    <div
      className={`relative w-[300px] h-[400px] md:w-[160px] md:h-[220px] rounded-lg transition-all duration-300 transform hover:scale-105 ${
        isSelected ? "ring-4 ring-gold" : ""
      }`}
      onClick={onSelect}
    >
      {/* 卡牌背景 */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url('/images/heroes/${hero.id}.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 种族徽章 */}
      <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
        <span className="text-xs font-bold">{hero.race.slice(0, 2)}</span>
      </div>

      {/* 稀有度边框 */}
      <div
        className={`absolute inset-0 rounded-lg border-4 ${
          hero.rarity === "common"
            ? "border-gray-300"
            : hero.rarity === "rare"
            ? "border-blue-300"
            : hero.rarity === "epic"
            ? "border-purple-300"
            : "border-orange-300"
        }`}
      ></div>

      {/* 英雄信息 */}
      <div className="absolute bottom-0 p-4 text-white">
        <h3 className="text-xl md:text-lg font-bold">{hero.name}</h3>
        <div className="mt-2 bg-black/60 p-2 rounded">
          <div className="flex items-center">
            <span className="text-sm">技能：{hero.skill.name}</span>
          </div>
          <p className="text-xs mt-1">{hero.skill.description}</p>
          <p className="text-xs mt-1">消耗：{hero.skill.cost}金币</p>
        </div>
      </div>
    </div>
  );
};

// 英雄选择组件
export const HeroSelection = () => {
  const [heroes] = useAtom(heroesAtom);
  const [selectedHero, setSelectedHero] = useAtom(selectedHeroAtom);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  // 加载英雄数据
  useEffect(() => {
    // 模拟加载动画
    setTimeout(() => {
      setShowLoading(false);
    }, 1500);
  }, []);

  const handleSelectHero = (hero: Hero) => {
    setSelectedHero(hero);
  };

  const handleConfirmSelection = () => {
    setIsConfirmed(true);
    // 模拟发送选择结果
    setTimeout(() => {
      console.log("进入招募阶段");
    }, 500);
  };

  const handleRefreshHeroes = () => {
    // 实际开发中应调用API获取新英雄
    console.log("刷新英雄列表");
  };

  return (
    <div className="bg-tavern bg-cover min-h-full p-4">
      {/* 加载动画 */}
      {showLoading && (
        <div className="hero-selection-loader absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-center">
            <div className="w-16 h-16 border-4 border-t-gold border-r-gold border-b-gray-800 border-l-gray-800 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">正在抽取英雄...</p>
          </div>
        </div>
      )}

      {!isConfirmed ? (
        <>
          {/* 标题栏 */}
          <h1 className="text-center text-3xl font-medieval py-6">
            {selectedHero ? "确认你的选择" : "选择你的英雄"}
          </h1>

          {/* 英雄展示容器 */}
          <div
            className={`flex ${
              selectedHero ? "justify-center" : "justify-center"
            } flex-wrap gap-8 transition-all duration-500 mt-8`}
          >
            {heroes.map((hero) => (
              <div
                key={hero.id}
                className={`transition-all duration-300 ${
                  selectedHero && hero.id !== selectedHero.id
                    ? "opacity-30 scale-90"
                    : "opacity-100 scale-100"
                }`}
              >
                <HeroCard
                  hero={hero}
                  isSelected={selectedHero?.id === hero.id}
                  onSelect={() => handleSelectHero(hero)}
                />

                {/* 操作按钮组 */}

                <div className="mt-4 flex justify-center gap-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-black w-24 py-1 rounded transition-all"
                    onClick={handleRefreshHeroes}
                  >
                    刷新
                  </button>
                  <button
                    className="bg-gold hover:bg-gold-dark text-black w-24 py-1 rounded transition-all"
                    onClick={handleConfirmSelection}
                  >
                    确认
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // 确认后视图
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-3xl font-bold text-white mb-8 animate-pulse">
            等待其他玩家选择中...
          </h2>

          <div className="relative w-[400px] h-[500px] transform transition-all duration-700">
            {selectedHero && (
              <>
                <HeroCard
                  hero={selectedHero}
                  isSelected={true}
                  onSelect={() => {}}
                />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gold animate-bounce">
                  已选择
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
