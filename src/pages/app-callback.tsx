import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Smartphone } from "lucide-react";
import { APP_SCHEME } from "@/constants";

const AppCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone");
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  const appDeepLink = `${APP_SCHEME}://auth/callback?phone=${encodeURIComponent(phone || "")}`;

  useEffect(() => {
    if (phone && !redirectAttempted) {
      setRedirectAttempted(true);
      window.location.href = appDeepLink;
    }
  }, [phone, redirectAttempted, appDeepLink]);

  const handleOpenApp = () => {
    window.location.href = appDeepLink;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-fill-color/30">
      <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Cadastro realizado!
              </h1>
              <p className="text-foreground-muted">
                Sua conta foi criada com sucesso. Volte para o app para fazer
                login.
              </p>
            </div>

            <Button onClick={handleOpenApp} className="w-full gap-2" size="lg">
              <Smartphone className="h-5 w-5" />
              Abrir no App
            </Button>

            <p className="text-sm text-foreground-subtle">
              Se o app não abrir automaticamente, toque no botão acima.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppCallbackPage;
