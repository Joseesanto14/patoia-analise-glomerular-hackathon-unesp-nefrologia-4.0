import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Loader2, CheckCircle2, Microscope } from "lucide-react";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  progress: number;
  status: "pending" | "processing" | "completed";
}

export function Analysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AnalysisStep[]>([
    {
      id: "upload",
      label: "Preparação da Imagem",
      description: "Processando e otimizando imagem para análise",
      progress: 0,
      status: "processing",
    },
    {
      id: "detection",
      label: "Detecção de Glomérulos",
      description: "Identificando estruturas glomerulares no corte",
      progress: 0,
      status: "pending",
    },
    {
      id: "sclerosis",
      label: "Análise de Esclerose",
      description: "Detectando presença de esclerose glomerular",
      progress: 0,
      status: "pending",
    },
    {
      id: "classification",
      label: "Classificação",
      description: "Categorizando glomérulos saudáveis vs esclerosados",
      progress: 0,
      status: "pending",
    },
    {
      id: "maturation",
      label: "Maturação Patológica",
      description: "Analisando níveis de progressão patológica",
      progress: 0,
      status: "pending",
    },
  ]);

  useEffect(() => {
    // Simular progresso de análise
    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        const currentStepIndex = newSteps.findIndex((s) => s.status === "processing");
        
        if (currentStepIndex === -1) return prevSteps;

        // Incrementar progresso
        if (newSteps[currentStepIndex].progress < 100) {
          newSteps[currentStepIndex].progress += 5;
        } else {
          // Completar step atual
          newSteps[currentStepIndex].status = "completed";
          
          // Iniciar próximo step
          if (currentStepIndex < newSteps.length - 1) {
            newSteps[currentStepIndex + 1].status = "processing";
            setCurrentStep(currentStepIndex + 1);
          } else {
            // Análise completa - navegar para resultados
            setTimeout(() => {
              navigate(`/results/${id}`);
            }, 1000);
          }
        }

        return newSteps;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [id, navigate]);

  const overallProgress = Math.round(
    (steps.reduce((acc, step) => acc + step.progress, 0) / (steps.length * 100)) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Microscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">GlomeruloAI</h1>
            <p className="text-xs text-slate-500">Análise em Progresso</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Overall Progress */}
          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Analisando Imagem
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    ID da Análise: {id}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {overallProgress}%
                  </div>
                  <p className="text-xs text-slate-500">Progresso Total</p>
                </div>
              </div>

              <Progress value={overallProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card
                key={step.id}
                className={`transition-all ${
                  step.status === "processing"
                    ? "border-blue-500 shadow-md"
                    : step.status === "completed"
                    ? "border-green-500"
                    : "opacity-50"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {step.status === "completed" ? (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                      ) : step.status === "processing" ? (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <span className="text-slate-400 font-semibold">{index + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{step.label}</h3>
                        <p className="text-sm text-slate-500">{step.description}</p>
                      </div>

                      {step.status !== "pending" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">
                              {step.status === "completed" ? "Concluído" : "Processando..."}
                            </span>
                            <span className="font-medium text-slate-900">
                              {step.progress}%
                            </span>
                          </div>
                          <Progress value={step.progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-blue-900">
                A análise pode levar alguns minutos dependendo do tamanho da imagem e 
                quantidade de glomérulos detectados. Por favor, aguarde...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
