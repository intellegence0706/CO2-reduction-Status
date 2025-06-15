"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Download, Upload } from "lucide-react"

interface DataManagementProps {
  data: any
}

export default function DataManagement({ data }: DataManagementProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItemData, setNewItemData] = useState({
    name: "",
    reduction: 0,
    target: 0,
    population: 0,
  })

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "co2-reduction-data.json"
    link.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          console.log("Imported data:", importedData)
          // Here you would update your data state
        } catch (error) {
          console.error("Error parsing JSON:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Data Management
            <div className="flex gap-2">
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prefectures" className="w-full">
            <TabsList>
              <TabsTrigger value="prefectures">Prefectures</TabsTrigger>
              <TabsTrigger value="cities">Cities</TabsTrigger>
              <TabsTrigger value="api">API Structure</TabsTrigger>
            </TabsList>

            <TabsContent value="prefectures" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Prefecture Data</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prefecture
                </Button>
              </div>

              <div className="grid gap-4">
                {Object.entries(data.prefectures).map(([key, prefecture]: [string, any]) => (
                  <Card key={key}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{prefecture.name}</h4>
                          <div className="flex gap-2">
                            <Badge variant="secondary">Reduction: {prefecture.reduction}%</Badge>
                            <Badge variant="outline">Target: {prefecture.target}%</Badge>
                            <Badge variant="outline">Pop: {prefecture.population.toLocaleString()}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cities" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">City Data</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add City
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(data.prefectures).map(([prefKey, prefecture]: [string, any]) => (
                  <Card key={prefKey}>
                    <CardHeader>
                      <CardTitle className="text-base">{prefecture.name} Cities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {prefecture.cities &&
                          Object.entries(prefecture.cities).map(([cityKey, city]: [string, any]) => (
                            <div key={cityKey} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{city.name}</span>
                                <div className="flex gap-2 mt-1">
                                  <Badge size="sm" variant="secondary">
                                    {city.reduction}%
                                  </Badge>
                                  <Badge size="sm" variant="outline">
                                    Target: {city.target}%
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Data Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    value={`{
  "prefectures": {
    "prefecture_id": {
      "name": "Prefecture Name",
      "reduction": 15.2,        // Current CO2 reduction %
      "target": 20.0,           // Target CO2 reduction %
      "status": "progress",     // excellent|good|progress|warning|danger
      "population": 14000000,
      "lastUpdated": "2024-01-15",
      "cities": {
        "city_id": {
          "name": "City Name",
          "reduction": 18.5,
          "target": 25.0,
          "status": "good",
          "population": 500000,
          "lastUpdated": "2024-01-15"
        }
      }
    }
  },
  "metadata": {
    "lastSync": "2024-01-15T10:00:00Z",
    "version": "1.0",
    "source": "Environmental Agency"
  }
}`}
                    className="h-64 font-mono text-sm"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-2 bg-gray-100 rounded font-mono text-sm">GET /api/co2-data - Get all data</div>
                  <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                    GET /api/co2-data/prefecture/:id - Get prefecture data
                  </div>
                  <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                    PUT /api/co2-data/prefecture/:id - Update prefecture data
                  </div>
                  <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                    GET /api/co2-data/city/:prefId/:cityId - Get city data
                  </div>
                  <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                    PUT /api/co2-data/city/:prefId/:cityId - Update city data
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
