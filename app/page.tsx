"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, TrendingDown, TrendingUp, Minus } from "lucide-react"
import JapanMap from "@/components/japan-map"
import DataManagement from "@/components/data-management"
import EmbedWidget from "@/components/embed-widget"

// Sample data structure for CO2 reduction
const co2Data = {
  prefectures: {
    tokyo: {
      name: "Tokyo",
      reduction: 15.2,
      target: 20.0,
      status: "progress",
      population: 14000000,
      cities: {
        shibuya: { name: "Shibuya", reduction: 18.5, target: 25.0, status: "good" },
        shinjuku: { name: "Shinjuku", reduction: 12.3, target: 20.0, status: "warning" },
        minato: { name: "Minato", reduction: 22.1, target: 25.0, status: "excellent" },
      },
    },
    osaka: {
      name: "Osaka",
      reduction: 12.8,
      target: 18.0,
      status: "warning",
      population: 8800000,
      cities: {
        "osaka-city": { name: "Osaka City", reduction: 14.2, target: 20.0, status: "progress" },
        sakai: { name: "Sakai", reduction: 10.5, target: 15.0, status: "warning" },
      },
    },
    kanagawa: {
      name: "Kanagawa",
      reduction: 18.7,
      target: 22.0,
      status: "good",
      population: 9200000,
      cities: {
        yokohama: { name: "Yokohama", reduction: 20.1, target: 25.0, status: "good" },
        kawasaki: { name: "Kawasaki", reduction: 16.8, target: 20.0, status: "progress" },
      },
    },
  },
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "bg-green-500"
    case "good":
      return "bg-blue-500"
    case "progress":
      return "bg-yellow-500"
    case "warning":
      return "bg-orange-500"
    case "danger":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "excellent":
    case "good":
      return <TrendingDown className="h-4 w-4" />
    case "progress":
      return <Minus className="h-4 w-4" />
    case "warning":
    case "danger":
      return <TrendingUp className="h-4 w-4" />
    default:
      return <MapPin className="h-4 w-4" />
  }
}

export default function CO2ReductionDashboard() {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)
  const [viewLevel, setViewLevel] = useState<"prefecture" | "city">("prefecture")
  const [activeTab, setActiveTab] = useState("map")

  const selectedData = selectedPrefecture ? co2Data.prefectures[selectedPrefecture] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">CO₂ Reduction Status</h1>
          <p className="text-lg text-gray-600">Real-time visualization of carbon reduction progress across Japan</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="embed">Embed Widget</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  View Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2">
                    <Button
                      variant={viewLevel === "prefecture" ? "default" : "outline"}
                      onClick={() => setViewLevel("prefecture")}
                    >
                      Prefecture Level
                    </Button>
                    <Button
                      variant={viewLevel === "city" ? "default" : "outline"}
                      onClick={() => setViewLevel("city")}
                      disabled={!selectedPrefecture}
                    >
                      City Level
                    </Button>
                  </div>
                  {selectedPrefecture && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedPrefecture(null)
                        setViewLevel("prefecture")
                      }}
                    >
                      Reset Selection
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {viewLevel === "prefecture" ? "Japan - Prefecture View" : `${selectedData?.name} - City View`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <JapanMap
                    data={co2Data}
                    selectedPrefecture={selectedPrefecture}
                    onPrefectureSelect={setSelectedPrefecture}
                    viewLevel={viewLevel}
                  />
                </CardContent>
              </Card>

              {/* Details Panel */}
              <div className="space-y-4">
                {/* Legend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Status Legend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { status: "excellent", label: "Excellent (>20%)", color: "bg-green-500" },
                      { status: "good", label: "Good (15-20%)", color: "bg-blue-500" },
                      { status: "progress", label: "In Progress (10-15%)", color: "bg-yellow-500" },
                      { status: "warning", label: "Needs Attention (<10%)", color: "bg-orange-500" },
                    ].map(({ status, label, color }) => (
                      <div key={status} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Selected Area Details */}
                {selectedData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(selectedData.status)}
                        {selectedData.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current Reduction:</span>
                          <Badge className={getStatusColor(selectedData.status)}>{selectedData.reduction}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Target:</span>
                          <span className="font-semibold">{selectedData.target}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Population:</span>
                          <span>{selectedData.population.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round((selectedData.reduction / selectedData.target) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getStatusColor(selectedData.status)}`}
                            style={{ width: `${Math.min((selectedData.reduction / selectedData.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Cities List */}
                      {viewLevel === "city" && selectedData.cities && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Cities & Towns</h4>
                          {Object.entries(selectedData.cities).map(([key, city]) => (
                            <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{city.name}</span>
                              <Badge className={getStatusColor(city.status)} variant="secondary">
                                {city.reduction}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <DataManagement data={co2Data} />
          </TabsContent>

          <TabsContent value="embed">
            <EmbedWidget />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
