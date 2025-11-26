import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingBarber } from "@/components/ui";
import { ROUTES, WHATSAPP_WEB_LINK } from "@/constants";
import PublicLayout from "@/layouts/public";
import { useGetSubscriptionsPlans } from "@/services/subscriptions/queries";
import { formatMoney } from "@/utils/money";
import {
  Calendar,
  Users,
  TrendingUp,
  Shield,
  CreditCard,
  Clock,
  Smartphone,
  CheckCircle,
  X,
} from "lucide-react";
import { NavLink } from "react-router";
import { useState, useRef } from "react";

export default function ForBarbersPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [showDemo, setShowDemo] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  const {
    data: plans,
    isLoading: isLoadingPlans,
    error: plansError,
  } = useGetSubscriptionsPlans();

  const handleDemoClick = () => {
    setShowDemo(true);
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  if (isLoadingPlans) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingBarber size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (plansError || !plans) {
    return <div>Error loading plans</div>;
  }

  // Filtra planos pelo billing interval selecionado
  const filteredPlans = plans.filter(
    (p) => p.billingInterval === billingInterval
  );

  const popularPlan = filteredPlans.find((plan) => plan.name === "Growth");

  const enterprisePlan = filteredPlans.find(
    (plan) => plan.maxWorkers === undefined
  );

  function getFeatures(planName: string) {
    switch (planName) {
      case "Solo":
        return [
          "Agendamentos ilimitados",
          "Acesso ao app mobile",
          "Gestão de serviços e horários",
          "Agendamento automatizado",
          "Gerenciamento de agendamentos",
          "Relatórios básicos",
          "Segurança dos dados",
        ];
      case "Starter":
        return [
          "Agendamentos ilimitados",
          "Acesso ao app mobile",
          "Gestão inteligente de serviços e horários",
          "Agendamento automatizado",
          "Gerenciamento de agendamentos",
          "Relatórios detalhados",
          "Segurança avançada dos dados",
          "Acompanhamento inicial",
          "Vitrine digital pública",
        ];
      case "Growth":
        return [
          "Agendamentos ilimitados",
          "Acesso ao app mobile",
          "Gestão inteligente de serviços e horários",
          "Agendamento automatizado",
          "Gerenciamento de agendamentos",
          "Relatórios detalhados",
          "Segurança avançada dos dados",
          "Acompanhamento inicial",
          "Prioridade em novas funcionalidades",
        ];
      case "Professional":
        return [
          "Agendamentos ilimitados",
          "Acesso ao app mobile",
          "Gestão inteligente de serviços e horários",
          "Agendamento automatizado",
          "Gerenciamento de agendamentos",
          "Relatórios detalhados",
          "Segurança avançada dos dados",
          "Acompanhamento inicial",
          "Prioridade em novas funcionalidades",
          "Suporte dedicado 24/7",
        ];
      case "Enterprise":
        return [
          "Agendamentos ilimitados",
          "Acesso ao app mobile",
          "Gestão inteligente de serviços e horários",
          "Agendamento automatizado",
          "Gerenciamento de agendamentos",
          "Relatórios detalhados",
          "Segurança avançada dos dados",
          "Acompanhamento inicial",
          "Prioridade em novas funcionalidades",
          "Suporte dedicado 24/7",
        ];
      default:
        return [];
    }
  }

  return (
    <PublicLayout>
      <section className="py-20 px-4 bg-gradient-to-br from-fill-color to-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground">
            Transforme sua <span className="text-brand-primary">barbearia</span>{" "}
            em um negócio digital
          </h1>
          <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto text-pretty">
            Gerencie agendamentos, atraia novos clientes e aumente sua receita
            com nossa plataforma completa de gestão para barbearias.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <NavLink to={ROUTES.REGISTER}>Começar Teste Grátis</NavLink>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3"
              onClick={handleDemoClick}
            >
              Ver Demonstração
            </Button>
          </div>

          <div className="text-sm text-foreground-muted">
            ✓ Plano Solo gratuito • ✓ Sem cadastrar cartão de crédito • ✓ Sem
            compromisso • ✓ Suporte completo
          </div>
        </div>
      </section>

      {/* Demo Video Section - Hidden preload */}
      <div className="hidden">
        <iframe
          src="https://www.youtube.com/embed/R8-0IXQXyh8?autoplay=0"
          title="Preload video"
          aria-hidden="true"
        />
      </div>

      {showDemo && (
        <section ref={demoRef} className="py-16 px-4 bg-white animate-fade-in">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-foreground">
                  Demonstração da Plataforma
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDemo(false)}
                  className="rounded-full"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div
                className="relative w-full rounded-lg overflow-hidden shadow-2xl"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src="https://www.youtube.com/embed/R8-0IXQXyh8?autoplay=1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                  title="Demonstração da Plataforma Lobeca"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Tudo que você precisa para gerenciar sua barbearia
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="h-8 w-8 text-brand-primary" />,
                title: "Agendamentos Automatizados",
                description:
                  "Sistema inteligente que gerencia horários, evita conflitos e envia lembretes automáticos aos clientes",
              },
              {
                icon: <CreditCard className="h-8 w-8 text-brand-primary" />,
                title: "Pagamentos no App",
                description:
                  "Receba pagamentos via PIX, cartão e dinheiro. Controle total do fluxo de caixa em tempo real",
              },
              {
                icon: <Users className="h-8 w-8 text-brand-primary" />,
                title: "Gestão de Clientes",
                description:
                  "Histórico completo, preferências e dados de contato. Fidelização através de promoções personalizadas",
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-brand-primary" />,
                title: "Relatórios Inteligentes",
                description:
                  "Análise de vendas, horários de pico e performance. Tome decisões baseadas em dados reais",
              },
              {
                icon: <Smartphone className="h-8 w-8 text-brand-primary" />,
                title: "App Mobile Completo",
                description:
                  "Gerencie sua barbearia de qualquer lugar. Interface otimizada para celular e tablet",
              },
              {
                icon: <Shield className="h-8 w-8 text-brand-primary" />,
                title: "Segurança Total",
                description:
                  "Dados protegidos com criptografia. Backup automático e conformidade com LGPD",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow border-color-border"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-center text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-foreground-muted text-center text-pretty">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-fill-color/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Planos que se adaptam ao seu negócio
          </h2>
          <p className="text-center text-foreground-muted mb-8 max-w-2xl mx-auto">
            Escolha o plano ideal para sua barbearia. Todos incluem suporte
            completo e atualizações gratuitas.
          </p>

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-color-border rounded-lg p-1">
              <Button
                variant={billingInterval === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingInterval("monthly")}
                className="px-6"
              >
                Mensal
              </Button>
              <Button
                variant={billingInterval === "annual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingInterval("annual")}
                className="px-6"
              >
                Anual
                <Badge variant="secondary" className="ml-2">
                  Economize 17%
                </Badge>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8  mx-auto">
            {filteredPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-color-border h-full ${
                  plan.id === popularPlan?.id
                    ? "border-brand-primary shadow-lg scale-105"
                    : ""
                }`}
              >
                {plan.id === popularPlan?.id && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">
                      {plan.name}
                    </h3>
                    <p className="text-foreground-muted mb-4">
                      {plan.description}
                    </p>
                    {enterprisePlan?.id !== plan.id && (
                      <div>
                        {plan.billingInterval === "annual" ? (
                          <>
                            <div className="flex items-baseline justify-center">
                              <span className="text-4xl font-bold text-foreground">
                                R${formatMoney(plan.price / 12)}
                              </span>
                              <span className="text-foreground-muted ml-1">
                                /mês
                              </span>
                            </div>
                            <p className="text-sm text-foreground-muted mt-2">
                              R${formatMoney(plan.price)} cobrados anualmente
                            </p>
                          </>
                        ) : (
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-foreground">
                              R${formatMoney(plan.price)}
                            </span>
                            <span className="text-foreground-muted ml-1">
                              /mês
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {getFeatures(plan.name).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-brand-primary mr-3 flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-auto"
                    variant={
                      enterprisePlan?.id === plan.id
                        ? "outline"
                        : plan.name === "Solo"
                        ? "default"
                        : "default"
                    }
                    size="lg"
                    asChild
                  >
                    <NavLink
                      to={
                        enterprisePlan?.id === plan.id
                          ? WHATSAPP_WEB_LINK
                          : ROUTES.REGISTER
                      }
                    >
                      {enterprisePlan?.id === plan.id
                        ? "Entrar em contato"
                        : plan.name === "Solo"
                        ? "Começar grátis"
                        : popularPlan?.id === plan.id
                        ? "Começar agora"
                        : "Começar agora"}
                    </NavLink>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      {/* <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Barbeiros que já transformaram seus negócios
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Marcos Barbeiro",
                business: "Barbearia do Marcos",
                result: "+150% de agendamentos",
                comment:
                  "O Lobeca revolucionou minha barbearia. Agora tenho controle total e meus clientes adoram a praticidade.",
                avatar: "/man-profile.png",
              },
              {
                name: "Rafael Silva",
                business: "Classic Barber Shop",
                result: "+80% na receita",
                comment:
                  "Desde que comecei a usar, minha agenda está sempre cheia. O sistema de pagamentos é fantástico!",
                avatar: "/young-man-profile.png",
              },
              {
                name: "André Costa",
                business: "Barbearia Moderna",
                result: "3x mais clientes",
                comment:
                  "A plataforma me ajudou a profissionalizar meu negócio. Agora tenho uma barbearia de verdade!",
                avatar: "/professional-man-profile-photo.jpg",
              },
            ].map((story, index) => (
              <Card
                key={index}
                className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in border-color-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={story.avatar || "/placeholder.svg"}
                      alt={story.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {story.name}
                      </h4>
                      <p className="text-sm text-foreground-muted">
                        {story.business}
                      </p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-brand-secondary text-brand-secondary"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-brand-primary/10 rounded-lg p-3 mb-4">
                    <p className="font-semibold text-brand-primary text-center">
                      {story.result}
                    </p>
                  </div>
                  <p className="text-foreground-muted text-pretty">
                    "{story.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* How it Works */}
      <section className="py-16 px-4 bg-fill-color/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Como funciona
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Cadastre-se",
                description: "Crie sua conta em menos de 2 minutos",
                icon: <Users className="h-8 w-8 text-brand-primary" />,
              },
              {
                step: "2",
                title: "Configure",
                description:
                  "Adicione seus serviços e horários de funcionamento",
                icon: <Calendar className="h-8 w-8 text-brand-primary" />,
              },
              {
                step: "3",
                title: "Receba Clientes",
                description:
                  "Clientes encontram e agendam com você automaticamente",
                icon: <Smartphone className="h-8 w-8 text-brand-primary" />,
              },
              {
                step: "4",
                title: "Gerencie Tudo",
                description:
                  "Controle agendamentos, pagamentos e relatórios em um só lugar",
                icon: <TrendingUp className="h-8 w-8 text-brand-primary" />,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  <div className="flex justify-center">{step.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-foreground-muted text-pretty">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-brand-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para revolucionar sua barbearia?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-xl mx-auto text-pretty">
            Junte-se a centenas de barbeiros que já transformaram seus negócios
            com o Lobeca
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              variant="outline"
              size="lg"
              className="text-lg text-foreground px-8 py-3"
              asChild
            >
              <NavLink to={ROUTES.REGISTER}>Começar Teste Grátis</NavLink>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-brand-primary bg-transparent"
              asChild
            >
              <NavLink to={WHATSAPP_WEB_LINK} target="_blank">
                Falar com Especialista
              </NavLink>
            </Button>
          </div>
          <div className="text-sm opacity-80">
            <Clock className="inline h-4 w-4 mr-1" />
            Implementação em minutos • Suporte completo incluído
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
