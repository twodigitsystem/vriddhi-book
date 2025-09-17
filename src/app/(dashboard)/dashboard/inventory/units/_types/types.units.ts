import { Prisma } from "@prisma/client";

export type UnitWithConversions = Prisma.UnitGetPayload<{
  include: {
    baseConversions: {
      include: {
        secondaryUnit: true;
      };
    };
  };
}>;

export interface UnitConversion {
  id: string;
  baseUnitId: string;
  baseUnit?: Unit;
  secondaryUnitId: string;
  secondaryUnit: Unit;
  conversionFactor: number;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Unit = {
  id: string;
  name: string;
  shortName: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UnitFormValues = {
  name: string;
  shortName: string;
};

export type UnitConversionValues = {
  baseUnitId: string;
  secondaryUnitId: string;
  conversionFactor: number;
};
