import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { 
  Download, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  Microscope,
  AlertCircle,
  CheckCircle2,
  Activity,
  BarChart3,
  FileText
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { toast } from "sonner";

// Mock data para resultados
const mockGlomeruli = [
  { id: 1, x: 120, y: 180, status: "healthy", maturation: 0, confidence: 0.95 },
  { id: 2, x: 340, y: 220, status: "sclerosis", maturation: 2, confidence: 0.89 },
  { id: 3, x: 560, y: 140, status: "healthy", maturation: 0, confidence: 0.92 },
  { id: 4, x: 280, y: 420, status: "sclerosis", maturation: 3, confidence: 0.87 },
  { id: 5, x: 480, y: 380, status: "sclerosis", maturation: 1, confidence: 0.91 },
  { id: 6, x: 160, y: 520, status: "healthy", maturation: 0, confidence: 0.94 },
  { id: 7, x: 620, y: 460, status: "sclerosis", maturation: 2, confidence: 0.88 },
  { id: 8, x: 400, y: 100, status: "healthy", maturation: 0, confidence: 0.96 },
];

const maturationLabels = ["Saudável", "Leve", "Moderada", "Avançada", "Severa"];
const maturationColors = ["#10b981", "#fbbf24", "#f97316", "#ef4444", "#7f1d1d"];

export function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);
  const [selectedGlomerulus, setSelectedGlomerulus] = useState<number | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const healthyCount = mockGlomeruli.filter(g => g.status === "healthy").length;
  const sclerosisCount = mockGlomeruli.filter(g => g.status === "sclerosis").length;
  const totalCount = mockGlomeruli.length;
  const sclerosisPercentage = Math.round((sclerosisCount / totalCount) * 100);

  // Dados para gráficos
  const statusData = [
    { name: "Saudáveis", value: healthyCount, color: "#10b981" },
    { name: "Com Esclerose", value: sclerosisCount, color: "#ef4444" },
  ];

  const maturationData = [
    { level: "Saudável", count: healthyCount },
    { level: "Leve", count: mockGlomeruli.filter(g => g.maturation === 1).length },
    { level: "Moderada", count: mockGlomeruli.filter(g => g.maturation === 2).length },
    { level: "Avançada", count: mockGlomeruli.filter(g => g.maturation === 3).length },
    { level: "Severa", count: mockGlomeruli.filter(g => g.maturation === 4).length },
  ];

  const handleExport = () => {
    toast.success("Relatório exportado", {
      description: "O relatório PDF foi gerado com sucesso",
    });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const selectedGlomerulusData = selectedGlomerulus 
    ? mockGlomeruli.find(g => g.id === selectedGlomerulus)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Resultados da Análise</h1>
                <p className="text-xs text-slate-500">ID: {id}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Image Viewer */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
                      <p className="text-xs text-slate-500">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{healthyCount}</p>
                      <p className="text-xs text-slate-500">Saudáveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{sclerosisCount}</p>
                      <p className="text-xs text-slate-500">Esclerose</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{sclerosisPercentage}%</p>
                      <p className="text-xs text-slate-500">Taxa</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image Viewer */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Imagem Analisada</CardTitle>
                    <CardDescription>
                      Clique nos marcadores para ver detalhes de cada glomérulo
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAnnotations(!showAnnotations)}
                    >
                      {showAnnotations ? "Ocultar" : "Mostrar"} Marcações
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">
                      {zoom}%
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-slate-100 rounded-lg overflow-hidden" style={{ height: "500px" }}>
                  {/* Imagem base (placeholder) */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"
                    style={{ 
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: "top left",
                      width: "700px",
                      height: "600px"
                    }}
                  >
                    {/* Renderizar marcadores de glomérulos */}
                    {showAnnotations && mockGlomeruli.map((glomerulus) => (
                      <div
                        key={glomerulus.id}
                        className={`absolute w-16 h-16 rounded-full border-4 cursor-pointer transition-all ${
                          selectedGlomerulus === glomerulus.id
                            ? "border-blue-500 bg-blue-500/20 scale-110"
                            : glomerulus.status === "healthy"
                            ? "border-green-500 bg-green-500/10 hover:bg-green-500/20"
                            : "border-red-500 bg-red-500/10 hover:bg-red-500/20"
                        }`}
                        style={{
                          left: `${glomerulus.x}px`,
                          top: `${glomerulus.y}px`,
                        }}
                        onClick={() => setSelectedGlomerulus(glomerulus.id)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded">
                            {glomerulus.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-500/20"></div>
                    <span className="text-sm text-slate-600">Saudável</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-red-500/20"></div>
                    <span className="text-sm text-slate-600">Com Esclerose</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500/20"></div>
                    <span className="text-sm text-slate-600">Selecionado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details & Analytics */}
          <div className="space-y-4">
            {/* Selected Glomerulus Details */}
            {selectedGlomerulusData ? (
              <Card className="border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Glomérulo #{selectedGlomerulusData.id}
                    <Badge variant={selectedGlomerulusData.status === "healthy" ? "default" : "destructive"}>
                      {selectedGlomerulusData.status === "healthy" ? "Saudável" : "Esclerose"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Detalhes da estrutura selecionada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Status</span>
                      <span className="text-sm font-medium">
                        {selectedGlomerulusData.status === "healthy" ? "Saudável" : "Com Esclerose"}
                      </span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Nível Patológico</span>
                      <Badge 
                        style={{ 
                          backgroundColor: maturationColors[selectedGlomerulusData.maturation],
                          color: "white"
                        }}
                      >
                        {maturationLabels[selectedGlomerulusData.maturation]}
                      </Badge>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Confiança</span>
                      <span className="text-sm font-medium">
                        {(selectedGlomerulusData.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Posição (x, y)</span>
                      <span className="text-sm font-medium font-mono">
                        ({selectedGlomerulusData.x}, {selectedGlomerulusData.y})
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedGlomerulus(null)}
                  >
                    Desselecionar
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    Clique em um glomérulo na imagem para ver seus detalhes
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Analytics Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Análise Estatística</CardTitle>
                <CardDescription>Distribuição e classificação</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="distribution" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="distribution">Distribuição</TabsTrigger>
                    <TabsTrigger value="maturation">Maturação</TabsTrigger>
                  </TabsList>

                  <TabsContent value="distribution" className="space-y-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-2">
                      {statusData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-slate-600">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {item.value} ({Math.round((item.value / totalCount) * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="maturation" className="space-y-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={maturationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="level" 
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="space-y-2">
                      {maturationData.map((item, index) => (
                        <div key={item.level} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: maturationColors[index] }}
                            />
                            <span className="text-sm text-slate-600">{item.level}</span>
                          </div>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Glomeruli List */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Glomérulos</CardTitle>
                <CardDescription>{totalCount} estruturas identificadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {mockGlomeruli.map((glomerulus) => (
                      <div
                        key={glomerulus.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedGlomerulus === glomerulus.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        onClick={() => setSelectedGlomerulus(glomerulus.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">Glomérulo #{glomerulus.id}</span>
                          <Badge 
                            variant={glomerulus.status === "healthy" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {glomerulus.status === "healthy" ? "Saudável" : "Esclerose"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{maturationLabels[glomerulus.maturation]}</span>
                          <span>{(glomerulus.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
