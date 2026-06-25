import { DataSource, Repository } from "typeorm";
import { ScenicSpot, TicketType, RoutePackage, RouteItinerary } from "./entity";

/**
 * 种子数据模块
 * 仅在 SEED_DATA 环境变量不为 'false' 时运行
 * 用于开发/测试环境快速初始化演示数据
 */
export async function seedTestData(dataSource: DataSource) {
  if (process.env.SEED_DATA === "false") return;

  const scenicRepo = dataSource.getRepository(ScenicSpot);
  const ticketRepo = dataSource.getRepository(TicketType);
  const routeRepo = dataSource.getRepository(RoutePackage);
  const itineraryRepo = dataSource.getRepository(RouteItinerary);

  // ---- 清空旧数据 ----
  await scenicRepo.createQueryBuilder().delete().where("deleted_at IS NULL").execute();
  await ticketRepo.createQueryBuilder().delete().where("deleted_at IS NULL").execute();
  await routeRepo.createQueryBuilder().delete().where("deleted_at IS NULL").execute();
  await itineraryRepo.createQueryBuilder().delete().where("deleted_at IS NULL").execute();

  // ---- 1. 插入景区 ----
  const scenicSpots = [
    scenicRepo.create({
      name: "喜洲古镇",
      coverImage: "https://picsum.photos/800/400?random=1",
      images: ["https://picsum.photos/800/500?random=10", "https://picsum.photos/800/500?random=11"],
      description: "喜洲古镇位于大理古城北部，是白族文化的发祥地之一。古镇保存了大量明清时期的白族民居建筑，街巷格局完整，民风淳朴。",
      address: "大理白族自治州大理市喜洲镇",
      lat: 25.837,
      lng: 100.129,
      status: 1,
      sort: 1,
    }),
    scenicRepo.create({
      name: "洱海生态廊道",
      coverImage: "https://picsum.photos/800/400?random=2",
      images: ["https://picsum.photos/800/500?random=20", "https://picsum.photos/800/500?random=21"],
      description: "洱海生态廊道全长约128公里，环绕整个洱海，是大理最热门的骑行和徒步路线。",
      address: "大理白族自治州大理市洱海周边",
      lat: 25.795,
      lng: 100.242,
      status: 1,
      sort: 2,
    }),
    scenicRepo.create({
      name: "崇圣寺三塔",
      coverImage: "https://picsum.photos/800/400?random=3",
      images: ["https://picsum.photos/800/500?random=30", "https://picsum.photos/800/500?random=31"],
      description: "崇圣寺三塔是大理最著名的地标性建筑，由一大二小三座古塔组成，距今已有千年历史。",
      address: "大理白族自治州大理市崇圣寺",
      lat: 25.701,
      lng: 100.142,
      status: 1,
      sort: 3,
    }),
    scenicRepo.create({
      name: "苍山风景名胜区",
      coverImage: "https://picsum.photos/800/400?random=4",
      images: ["https://picsum.photos/800/500?random=40", "https://picsum.photos/800/500?random=41"],
      description: "苍山又名点苍山，位于大理盆地和西洱河之间，是大理旅游的精华所在。",
      address: "大理白族自治州大理市苍山路",
      lat: 25.733,
      lng: 100.105,
      status: 1,
      sort: 4,
    }),
    scenicRepo.create({
      name: "大理古城",
      coverImage: "https://picsum.photos/800/400?random=5",
      images: ["https://picsum.photos/800/500?random=50", "https://picsum.photos/800/500?random=51"],
      description: "大理古城始建于明洪武年间，城内街道呈棋盘式布局，以洋人街为中心。",
      address: "大理白族自治州大理市复兴路",
      lat: 25.687,
      lng: 100.169,
      status: 1,
      sort: 5,
    }),
  ];
  await scenicRepo.save(scenicSpots);
  console.log("[Seed] 已插入 5 个测试景区");

  // ---- 2. 插入票种 ----
  const tickets = [
    { scenicId: 1, name: "喜洲古镇成人票", price: 60, sellPrice: 50, stock: 500, validDays: 1, description: "含白族民居建筑群参观" },
    { scenicId: 1, name: "喜洲古镇学生票", price: 30, sellPrice: 25, stock: 300, validDays: 1, description: "凭学生证购买，半价优惠" },
    { scenicId: 2, name: "洱海生态廊道通行券", price: 0, sellPrice: 0, stock: 9999, validDays: 1, description: "免费开放" },
    { scenicId: 3, name: "崇圣寺三塔门票", price: 75, sellPrice: 65, stock: 400, validDays: 1, description: "含三塔参观及崇圣寺游览" },
    { scenicId: 3, name: "崇圣寺三塔+三塔倒影联票", price: 110, sellPrice: 95, stock: 200, validDays: 1, description: "含三塔及三塔倒影公园联票" },
    { scenicId: 4, name: "苍山前山门票", price: 40, sellPrice: 35, stock: 1000, validDays: 1, description: "前山线路：洗马潭索道+七龙女池" },
    { scenicId: 4, name: "苍山后山门票", price: 30, sellPrice: 25, stock: 800, validDays: 1, description: "后山线路：苍山神路+中和潭" },
    { scenicId: 5, name: "大理古城通行券", price: 0, sellPrice: 0, stock: 9999, validDays: 1, description: "免费开放" },
  ];
  for (const d of tickets) {
    await ticketRepo.save(ticketRepo.create({ ...d, dailyStock: {} }));
  }
  console.log("[Seed] 已插入 8 个测试票种");

  // ---- 3. 插入路线 ----
  const savedRoutes = [];
  const routes = [
    { scenicId: 1, name: "喜洲一日深度游", coverImage: "https://picsum.photos/800/400?random=100", images: ["https://picsum.photos/800/500?random=110", "https://picsum.photos/800/500?random=111"], description: "上午参观喜洲古镇白族民居，下午体验白族扎染手工。", price: 198, originalPrice: 268, durationDays: 1, minPeople: 2, maxPeople: 15, stock: 200, status: 1, sort: 1 },
    { scenicId: 2, name: "洱海环湖骑行3日游", coverImage: "https://picsum.photos/800/400?random=200", images: ["https://picsum.photos/800/500?random=210", "https://picsum.photos/800/500?random=211"], description: "第一天海西生态廊道骑行，第二天海东环湖自驾。", price: 588, originalPrice: 788, durationDays: 3, minPeople: 2, maxPeople: 10, stock: 100, status: 1, sort: 2 },
    { scenicId: 4, name: "苍山日出云海2日游", coverImage: "https://picsum.photos/800/400?random=300", images: ["https://picsum.photos/800/500?random=310", "https://picsum.photos/800/500?random=311"], description: "第一天上午登洗马潭索道，第二天凌晨登顶看日出云海。", price: 458, originalPrice: 598, durationDays: 2, minPeople: 2, maxPeople: 12, stock: 150, status: 1, sort: 3 },
  ];
  for (const d of routes) {
    const rp = routeRepo.create({ ...d, dailyStock: {} });
    savedRoutes.push(await routeRepo.save(rp));
  }
  console.log("[Seed] 已插入 3 条测试路线");

  // ---- 4. 插入行程明细 ----
  const itineraryData = [
    { routeId: savedRoutes[0].id, dayOrder: 1, title: "上午：喜洲古镇探秘", content: "参观喜林苑、严家大院，体验白族扎染工艺" },
    { routeId: savedRoutes[0].id, dayOrder: 2, title: "下午：稻田风光与白族文化", content: "漫步喜洲稻田，参观白族本主庙，体验白族三道茶" },
    { routeId: savedRoutes[1].id, dayOrder: 1, title: "第一天：海西生态廊道骑行", content: "才村码头出发，途经龙龛码头、小普陀" },
    { routeId: savedRoutes[1].id, dayOrder: 2, title: "第二天：海东环湖自驾", content: "海东公路自驾，打卡南诏风情岛" },
    { routeId: savedRoutes[1].id, dayOrder: 3, title: "第三天：日出摄影与休闲", content: "龙龛码头观日出，才村古镇闲逛" },
    { routeId: savedRoutes[2].id, dayOrder: 1, title: "第一天：登苍山游感通寺", content: "乘坐洗马潭索道至中和峰，游览清碧溪" },
    { routeId: savedRoutes[2].id, dayOrder: 2, title: "第二天：凌晨登顶观日出", content: "凌晨登顶马龙峰，观赏洱海日出云海" },
  ];
  for (const d of itineraryData) {
    await itineraryRepo.save(itineraryRepo.create(d));
  }
  console.log("[Seed] 已插入 7 条行程明细");
  console.log("[Seed] ===== 测试数据全部插入完成 =====");
}
