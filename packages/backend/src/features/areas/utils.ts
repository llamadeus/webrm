import { AreaType } from "webrm-shared";
import { Area, type RawArea } from "~/models";


export interface Areas {
  [AreaType.Kitchen]: RawArea;
  [AreaType.Bar]: RawArea;
}

export async function getAreas(restaurantId: string): Promise<Areas> {
  const [kitchen, bar] = await Promise.all([
    Area.findOne({ restaurantId, type: AreaType.Kitchen }),
    Area.findOne({ restaurantId, type: AreaType.Bar }),
  ]);

  return {
    [AreaType.Kitchen]: {
      restaurantId,
      type: AreaType.Kitchen,
      enabled: kitchen?.enabled ?? false,
      categories: kitchen?.categories ?? [],
      createdAt: kitchen?.createdAt ?? new Date(),
    },
    [AreaType.Bar]: {
      restaurantId,
      type: AreaType.Bar,
      enabled: bar?.enabled ?? false,
      categories: bar?.categories ?? [],
      createdAt: bar?.createdAt ?? new Date(),
    },
  };
}

export function isValidAreaCode(code: string) {
  return code === AreaType.Kitchen || code === AreaType.Bar;
}
