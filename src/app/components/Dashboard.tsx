import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, History, FileImage, Info, Microscope } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function Dashboard() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validação de tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione uma imagem válida (PNG, JPG, TIFF)",
      });
      return;
    }

    toast.success("Imagem carregada com sucesso", {
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    });

    // Simular ID de análise
    const analysisId = Date.now().toString();
    
    // Navegar para tela de análise
    setTimeout(() => {
      navigate(`/analysis/${analysisId}`);
    }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">GlomeruloAI</h1>
              <p className="text-xs text-slate-500">Análise Inteligente de Glomérulos Renais</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/history")}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            Histórico
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold text-slate-900">
              Análise Automatizada de Glomérulos
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sistema de identificação e classificação de glomérulos renais com detecção automática 
              de esclerose e análise de maturação patológica
            </p>
          </div>

          {/* Upload Area */}
          <Card className={`transition-all ${isDragging ? 'border-blue-500 border-2 bg-blue-50' : ''}`}>
            <CardContent className="p-8">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center space-y-4 hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium text-slate-900">
                    Arraste sua imagem aqui
                  </p>
                  <p className="text-sm text-slate-500">
                    ou clique para selecionar um arquivo
                  </p>
                </div>

                <div className="text-xs text-slate-400">
                  Formatos suportados: PNG, JPG, TIFF • Tamanho máximo: 50MB
                </div>

                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Workflow Info */}
          <div className="grid md:grid-cols-4 gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-help">
                    <CardHeader className="pb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-blue-600 font-semibold">1</span>
                      </div>
                      <CardTitle className="text-sm">Identificação</CardTitle>
                      <CardDescription className="text-xs">
                        Detecção automática de glomérulos no corte seccional
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">O modelo identifica e delimita cada glomérulo presente na imagem histológica</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-help">
                    <CardHeader className="pb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-purple-600 font-semibold">2</span>
                      </div>
                      <CardTitle className="text-sm">Esclerose</CardTitle>
                      <CardDescription className="text-xs">
                        Detecção de esclerose glomerular
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Análise de cada glomérulo para identificar presença de esclerose</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-help">
                    <CardHeader className="pb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-green-600 font-semibold">3</span>
                      </div>
                      <CardTitle className="text-sm">Classificação</CardTitle>
                      <CardDescription className="text-xs">
                        Separação entre saudáveis e esclerosados
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Categorização e quantificação dos glomérulos por status de esclerose</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-help">
                    <CardHeader className="pb-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-amber-600 font-semibold">4</span>
                      </div>
                      <CardTitle className="text-sm">Maturação</CardTitle>
                      <CardDescription className="text-xs">
                        Análise dos níveis de maturação patológica
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Padronização e classificação do estágio de progressão patológica</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Additional Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 flex gap-4">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Dicas para melhores resultados
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Utilize imagens de alta resolução (mínimo 1024x1024px)</li>
                  <li>Certifique-se que o corte histológico está bem focado</li>
                  <li>Evite imagens com artefatos ou coloração irregular</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
