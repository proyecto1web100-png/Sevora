import type { ComponentType } from "react";
import { HeroRipple } from "../HeroRipple";
import { ArchFrame } from "./ArchFrame";
import { Bottle3D } from "./Bottle3D";
import { BottleFill } from "./BottleFill";
import { Dunes } from "./Dunes";
import { LiveRing } from "./LiveRing";
import { Mist } from "./Mist";
import { Orbit } from "./Orbit";

// Opciones de animación para la portada. `Slot` va encima del título, `Frame` rodea
// el bloque de texto y `Backdrop` ocupa el fondo de la sección.
export interface HeroVariant {
  id: string;
  label: string;
  Slot?: ComponentType;
  Frame?: ComponentType;
  Backdrop?: ComponentType;
  className?: string;
}

export const heroVariants: HeroVariant[] = [
  { id: "1", label: "Gota y ondas", Slot: HeroRipple },
  { id: "2", label: "Bruma", Slot: Mist },
  { id: "3", label: "Frasco que se llena", Slot: BottleFill },
  { id: "4", label: "Frasco 3D", Slot: Bottle3D },
  { id: "7", label: "Arco árabe", Frame: ArchFrame, className: "hero--arch" },
  { id: "8", label: "Dunas", Backdrop: Dunes, className: "hero--dunes" },
  { id: "9", label: "Notas en órbita", Slot: Orbit },
  { id: "10", label: "Aro vivo", Slot: LiveRing },
];

export const DEFAULT_VARIANT = "1";
