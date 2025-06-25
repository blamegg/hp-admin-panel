import * as TbIcons from "react-icons/tb";
import * as Fa6Icons from "react-icons/fa6";
import * as MdIcons from "react-icons/md";
import React from "react";

// Available icon packs
const iconPacks = {
  Tb: TbIcons,
  Fa: Fa6Icons,
  Fa6: Fa6Icons,
  Md: MdIcons,
};

export function getIconComponent(iconKey: string, size: number = 18): React.ReactNode {
  if (!iconKey || typeof iconKey !== "string") return null;

  // Extract prefix (like 'Md', 'Fa', 'Tb')
  const prefixMatch = iconKey.match(/^[A-Za-z]+/);
  if (!prefixMatch) return null;

  const prefix = prefixMatch[0] as keyof typeof iconPacks;
  const iconPack = iconPacks[prefix];

  // If the prefix doesn't match a known pack, return null
  if (!iconPack) return null;

  const IconComponent = (iconPack as any)[iconKey];

  // If the specific icon isn't found in the pack, return null
  if (!IconComponent) return null;

  // Use React.createElement for dynamic components to avoid JSX-related type issues
  return React.createElement(IconComponent, { size });
}
