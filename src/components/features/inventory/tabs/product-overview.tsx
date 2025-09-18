"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, X, TrendingUp } from "lucide-react";
import type {
  Item,
  ItemSettings,
} from "@/app/(dashboard)/dashboard/inventory/_types/inventory";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchItemSettings,
  updateItem,
} from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";


interface ProductOverviewProps {
  product: Item;
}

// Mock stock trend data
const stockTrendData = [
  { date: "2024-01-01", stock: 45 },
  { date: "2024-01-05", stock: 52 },
  { date: "2024-01-10", stock: 38 },
  { date: "2024-01-15", stock: 65 },
  { date: "2024-01-20", stock: 42 },
  { date: "2024-01-25", stock: 58 },
  { date: "2024-01-30", stock: 35 },
];

export function ProductOverview({ product }: ProductOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<ItemSettings | null>(null);
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    fetchItemSettings().then(({ settings }) => {
      if (settings) {
        // Convert null to undefined for stockAlertThreshold
        const convertedSettings = {
          ...settings,
          stockAlertThreshold: settings.stockAlertThreshold ?? undefined
        } as ItemSettings;
        setSettings(convertedSettings);
      }
    });
  }, []);

  const handleSave = async () => {
    try {
      await updateItem({ ...formData, id: product.id });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setFormData(product);
    setIsEditing(false);
  };

  const totalStock = product.inventory.reduce(
    (sum, inv) => sum + inv.quantity,
    0
  );

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm mt-1">{product.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm mt-1">
                  {product.description || "No description"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                {isEditing ? (
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm mt-1">{product.sku}</p>
                )}
              </div>

              <div>
                <Label htmlFor="barcode">Barcode</Label>
                {isEditing ? (
                  <Input
                    id="barcode"
                    value={formData.barcode || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm mt-1">{product.barcode || "N/A"}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Product Type</Label>
              <div className="mt-1">
                <Badge
                  variant={product.type === "GOODS" ? "default" : "secondary"}
                >
                  {product.type}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <p className="text-sm mt-1">
                {product.category?.name || "Uncategorized"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
                disabled={!isEditing}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Sale Price</Label>
                {isEditing ? (
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p className="text-sm mt-1">${product.price.toFixed(2)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="costPrice">Cost Price</Label>
                {isEditing ? (
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costPrice: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p className="text-sm mt-1">
                    ${product.costPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {settings?.showItemWiseMRP && (
              <div>
                <Label htmlFor="mrp">MRP</Label>
                {isEditing ? (
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    value={formData.mrp || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mrp: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p className="text-sm mt-1">
                    ${product.mrp?.toFixed(2) || "N/A"}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unit">Unit</Label>
                {isEditing ? (
                  <Select
                    value={formData.unitId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unitId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="ltr">Liters</SelectItem>
                      <SelectItem value="hour">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm mt-1">{product.unitId}</p>
                )}
              </div>

              {product.type === "GOODS" && (
                <div>
                  <Label>Current Stock</Label>
                  <p className="text-sm mt-1 font-medium">
                    {totalStock} {product.unitId}
                  </p>
                </div>
              )}
            </div>

            {product.type === "GOODS" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStock">Min Stock</Label>
                  {isEditing ? (
                    <Input
                      id="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStock: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{product.minStock}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="maxStock">Max Stock</Label>
                  {isEditing ? (
                    <Input
                      id="maxStock"
                      type="number"
                      value={formData.maxStock || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxStock: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{product.maxStock || "N/A"}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dynamic Fields */}
        {settings && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.showMfgDate && (
                <div>
                  <Label htmlFor="mfgDate">Manufacturing Date</Label>
                  {isEditing ? (
                    <Input
                      id="mfgDate"
                      type="date"
                      value={
                        formData.mfgDate
                          ? new Date(formData.mfgDate)
                            .toISOString()
                            .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mfgDate: new Date(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">
                      {product.mfgDate
                        ? new Date(product.mfgDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  )}
                </div>
              )}

              {settings.showExpDate && (
                <div>
                  <Label htmlFor="expDate">Expiry Date</Label>
                  {isEditing ? (
                    <Input
                      id="expDate"
                      type="date"
                      value={
                        formData.expDate
                          ? new Date(formData.expDate)
                            .toISOString()
                            .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expDate: new Date(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">
                      {product.expDate
                        ? new Date(product.expDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  )}
                </div>
              )}

              {settings.showBatchNo && (
                <div>
                  <Label htmlFor="batchNo">Batch Number</Label>
                  {isEditing ? (
                    <Input
                      id="batchNo"
                      value={formData.batchNo || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, batchNo: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{product.batchNo || "N/A"}</p>
                  )}
                </div>
              )}

              {settings.showModelNo && (
                <div>
                  <Label htmlFor="modelNo">Model Number</Label>
                  {isEditing ? (
                    <Input
                      id="modelNo"
                      value={formData.modelNo || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, modelNo: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{product.modelNo || "N/A"}</p>
                  )}
                </div>
              )}

              {settings.showModelNo && (
                <div>
                  <Label htmlFor="modelNo">Model Number</Label>
                  {isEditing ? (
                    <Input
                      id="modelNo"
                      value={formData.modelNo || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, modelNo: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{product.modelNo || "N/A"}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No images available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stock Trend Chart */}
        {product.type === "GOODS" && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Stock Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="stock"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
