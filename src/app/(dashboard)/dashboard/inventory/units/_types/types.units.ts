// Define clean interfaces for the transformed data (Decimal -> number)
export interface TransformedUnitConversion {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  conversionFactor: number; // Transformed from Decimal to number
  baseUnitId: string;
  secondaryUnitId: string;
  secondaryUnit: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    shortName: string;
  };
}

export interface UnitWithConversions {
  id: string;
  name: string;
  shortName: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  baseConversions: TransformedUnitConversion[];
}

export interface UnitConversion {
  id: string;
  baseUnitId: string;
  baseUnit?: Unit;
  secondaryUnitId: string;
  secondaryUnit: Unit;
  conversionFactor: number; // Changed from Decimal to number to match transformed data
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

export type UnitExportData = {
  units: Array<{
    name: string;
    shortName: string;
  }>;
  conversions: Array<{
    from: string;
    to: string;
    factor: number;
  }>;
};
