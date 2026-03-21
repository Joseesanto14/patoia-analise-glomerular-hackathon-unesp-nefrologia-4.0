import { useNavigate } from "react-router";
import { ArrowLeft, Microscope, Eye, Trash2, Calendar, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { toast } from "sonner";

// Mock data para histórico
const mockHistory = [
  {
    id: "1742101961",
    date: "2026-03-21",
    time: "14:32",
    filename: "amostra_renal_paciente_001.jpg",
    totalGlomeruli: 8,
    healthyCount: 4,
    sclerosisCount: 4,
    sclerosisRate: 50,
  },
  {
    id: "1742001850",
    date: "2026-03-20",
    time: "11:15",
    filename: "biopsia_rim_direito_002.tiff",
    totalGlomeruli: 12,
    healthyCount: 9,
    sclerosisCount: 3,
    sclerosisRate: 25,
  },
  {
    id: "1741901740",
    date: "2026-03-19",
    time: "09:45",
    filename: "corte_histologico_003.png",
    totalGlomeruli: 6,
    healthyCount: 5,
    sclerosisCount: 1,
    sclerosisRate: 17,
  },
  {
    id: "1741801630",
    date: "2026-03-18",
    time: "16:20",
    filename: "amostra_renal_004.jpg",
    totalGlomeruli: 15,
    healthyCount: 7,
    sclerosisCount: 8,
    sclerosisRate: 53,
  },
  {
    id: "1741701520",
    date: "2026-03-17",
    time: "13:55",
    filename: "biopsia_paciente_005.tiff",
    totalGlomeruli: 10,
    healthyCount: 10,
    sclerosisCount: 0,
    sclerosisRate: 0,
  },
];

export function History() {
  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/results/${id}`);
  };

  const handleDelete = (id: string, filename: string) => {
    toast.success("Análise excluída", {
      description: `${filename} foi removida do histórico`,
    });
  };

  const handleExport = (id: string, filename: string) => {
    toast.success("Relatório exportado", {
      description: `PDF de ${filename} foi gerado`,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    });
  };

  const getSeverityColor = (rate: number) => {
    if (rate === 0) return "bg-green-100 text-green-800";
    if (rate < 25) return "bg-yellow-100 text-yellow-800";
    if (rate < 50) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

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
                <h1 className="text-xl font-semibold text-slate-900">Histórico de Análises</h1>
                <p className="text-xs text-slate-500">Visualize e gerencie análises anteriores</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total de Análises</CardDescription>
                <CardTitle className="text-3xl">{mockHistory.length}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Glomérulos Analisados</CardDescription>
                <CardTitle className="text-3xl">
                  {mockHistory.reduce((acc, item) => acc + item.totalGlomeruli, 0)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Taxa Média de Esclerose</CardDescription>
                <CardTitle className="text-3xl">
                  {Math.round(
                    mockHistory.reduce((acc, item) => acc + item.sclerosisRate, 0) / 
                    mockHistory.length
                  )}%
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Última Análise</CardDescription>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {formatDate(mockHistory[0].date)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Análises Recentes</CardTitle>
              <CardDescription>
                Lista completa de todas as análises realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Saudáveis</TableHead>
                    <TableHead className="text-center">Esclerose</TableHead>
                    <TableHead className="text-center">Taxa</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{formatDate(item.date)}</span>
                          <span className="text-xs text-slate-500">{item.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col max-w-xs">
                          <span className="text-sm font-medium truncate">{item.filename}</span>
                          <span className="text-xs text-slate-500">ID: {item.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {item.totalGlomeruli}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {item.healthyCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {item.sclerosisCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getSeverityColor(item.sclerosisRate)}>
                          {item.sclerosisRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExport(item.id, item.filename)}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.filename)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
