import { useParams, useSearchParams } from "react-router";
import PublicLayout from "@/layouts/public";
import ServiceSelectionStep from "./components/service-selection-step";
import DateSelectionStep from "./components/date-selection-step";
import TimeSelectionStep from "./components/time-selection-step";
import ConfirmationStep from "./components/confirmation-step";
import { useGetWorkerInfo } from "@/services/users/queries";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";

const BookingPage = () => {
  const { workerUUID } = useParams<{ workerUUID: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const serviceID = searchParams.get("serviceID");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const appointmentUUID = searchParams.get("appointmentUUID");

  const {
    data: worker,
    isLoading: isLoadingWorker,
    error: workerError,
  } = useGetWorkerInfo(workerUUID || "", Boolean(workerUUID));

  const getCurrentStep = () => {
    if (!serviceID) return "service";
    if (!date) return "date";
    if (!time) return "time";
    return "confirm";
  };

  const currentStep = getCurrentStep();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  if (isLoadingWorker) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="text-lg text-foreground-subtle">Carregando...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (workerError || !worker) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-red-500">
                Profissional não encontrado
              </h1>
              <p className="text-foreground-subtle">
                Não foi possível carregar as informações do profissional.
              </p>
              <Button onClick={() => navigate(-1)}>Voltar</Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case "service":
        return (
          <ServiceSelectionStep
            worker={worker}
            appointmentUUID={appointmentUUID}
          />
        );
      case "date":
        return (
          <DateSelectionStep
            worker={worker}
            serviceID={serviceID!}
            appointmentUUID={appointmentUUID}
          />
        );
      case "time":
        return (
          <TimeSelectionStep
            worker={worker}
            serviceID={serviceID!}
            date={date!}
            appointmentUUID={appointmentUUID}
          />
        );
      case "confirm":
        return (
          <ConfirmationStep
            worker={worker}
            serviceID={serviceID!}
            date={date!}
            time={time!}
            appointmentUUID={appointmentUUID}
          />
        );
      default:
        return (
          <ServiceSelectionStep
            worker={worker}
            appointmentUUID={appointmentUUID}
          />
        );
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm bg-card/95">
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => {
                  if (currentStep === "confirm") {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("time");
                    navigate(`/agendar/${workerUUID}?${newParams.toString()}`, {
                      replace: true,
                    });
                  } else if (currentStep === "time") {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("date");
                    navigate(`/agendar/${workerUUID}?${newParams.toString()}`, {
                      replace: true,
                    });
                  } else if (currentStep === "date") {
                    navigate(
                      `/agendar/${workerUUID}${
                        appointmentUUID
                          ? `?appointmentUUID=${appointmentUUID}`
                          : ""
                      }`,
                      { replace: true }
                    );
                  } else {
                    navigate(-1);
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>

              <div className="flex items-center gap-2">
                {["service", "date", "time", "confirm"].map((step, index) => {
                  const stepIndex = [
                    "service",
                    "date",
                    "time",
                    "confirm",
                  ].indexOf(currentStep);
                  const isActive = index === stepIndex;
                  const isCompleted = index < stepIndex;

                  return (
                    <div
                      key={step}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isActive
                          ? "w-8 bg-brand-primary"
                          : isCompleted
                          ? "w-2 bg-brand-primary"
                          : "w-2 bg-gray-300"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className="container mx-auto px-4 py-12 max-w-2xl min-h-[calc(100vh-80px)] flex items-center justify-center"
        >
          <div
            key={currentStep}
            className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out"
          >
            {renderStep()}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BookingPage;
