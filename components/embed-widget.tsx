"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, Code } from "lucide-react"

export default function EmbedWidget() {
  const [widgetConfig, setWidgetConfig] = useState({
    width: 800,
    height: 600,
    showLegend: true,
    showTooltips: true,
    theme: "light",
    defaultView: "prefecture",
    allowLevelSwitch: true,
  })

  const generateEmbedCode = () => {
    const config = encodeURIComponent(JSON.stringify(widgetConfig))
    return `<iframe 
  src="https://your-domain.com/embed/co2-map?config=${config}"
  width="${widgetConfig.width}"
  height="${widgetConfig.height}"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
></iframe>`
  }

  const generateJavaScriptCode = () => {
    return `<div id="co2-reduction-widget"></div>
<script>
  (function() {
    const config = ${JSON.stringify(widgetConfig, null, 2)};
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/widget.js';
    script.onload = function() {
      CO2Widget.init('co2-reduction-widget', config);
    };
    document.head.appendChild(script);
  })();
</script>`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Widget Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={widgetConfig.width}
                onChange={(e) => setWidgetConfig({ ...widgetConfig, width: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={widgetConfig.height}
                onChange={(e) => setWidgetConfig({ ...widgetConfig, height: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="legend">Show Legend</Label>
              <Switch
                id="legend"
                checked={widgetConfig.showLegend}
                onCheckedChange={(checked) => setWidgetConfig({ ...widgetConfig, showLegend: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tooltips">Show Tooltips</Label>
              <Switch
                id="tooltips"
                checked={widgetConfig.showTooltips}
                onCheckedChange={(checked) => setWidgetConfig({ ...widgetConfig, showTooltips: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="levelSwitch">Allow Level Switching</Label>
              <Switch
                id="levelSwitch"
                checked={widgetConfig.allowLevelSwitch}
                onCheckedChange={(checked) => setWidgetConfig({ ...widgetConfig, allowLevelSwitch: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Widget Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
            style={{
              width: `${Math.min(widgetConfig.width, 600)}px`,
              height: `${Math.min(widgetConfig.height, 400)}px`,
            }}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl">🗾</div>
              <p className="text-sm text-gray-600">CO₂ Reduction Widget Preview</p>
              <div className="flex gap-2 justify-center">
                <Badge variant="secondary">Prefecture View</Badge>
                {widgetConfig.showLegend && <Badge variant="outline">Legend</Badge>}
                {widgetConfig.showTooltips && <Badge variant="outline">Tooltips</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Embed Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>HTML Embed (iframe)</Label>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(generateEmbedCode())}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea readOnly value={generateEmbedCode()} className="font-mono text-sm h-24" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>JavaScript Widget</Label>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(generateJavaScriptCode())}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea readOnly value={generateJavaScriptCode()} className="font-mono text-sm h-32" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Step 1: Choose Integration Method</h4>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>
                <strong>iframe:</strong> Simple, secure, works everywhere
              </li>
              <li>
                <strong>JavaScript Widget:</strong> More customizable, better performance
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Step 2: Configure Widget</h4>
            <p className="text-sm text-gray-600">
              Adjust the settings above to match your website's design and requirements.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Step 3: Copy & Paste</h4>
            <p className="text-sm text-gray-600">
              Copy the generated code and paste it into your website where you want the widget to appear.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Step 4: Data Updates</h4>
            <p className="text-sm text-gray-600">
              The widget automatically updates when you modify data through the management interface.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
