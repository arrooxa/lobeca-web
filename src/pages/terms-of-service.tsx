import { Footer, Header } from "@/components";

const TermsOfService = () => {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Termos de Uso – Lobeca
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Estes Termos de Uso regulam a utilização da plataforma Lobeca
            ("Plataforma"), que oferece funcionalidades de agendamento, gestão
            de horários e serviços para barbearias, além de pagamentos de
            assinatura. Ao acessar ou utilizar a Lobeca, o usuário concorda
            integralmente com os presentes Termos de Uso. Caso não concorde, não
            deverá utilizar a Plataforma.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Definições
          </h2>
          <div className="space-y-3">
            <div>
              <strong className="text-gray-900">Usuário:</strong>
              <span className="text-gray-700 ml-1">
                pessoa física ou jurídica que acessa e utiliza a Lobeca.
              </span>
            </div>
            <div>
              <strong className="text-gray-900">
                Barbeiro/Estabelecimento:
              </strong>
              <span className="text-gray-700 ml-1">
                profissional ou empresa que oferece serviços de barbearia por
                meio da Lobeca.
              </span>
            </div>
            <div>
              <strong className="text-gray-900">Cliente:</strong>
              <span className="text-gray-700 ml-1">
                pessoa que agenda ou contrata serviços por meio da Lobeca.
              </span>
            </div>
            <div>
              <strong className="text-gray-900">Assinatura:</strong>
              <span className="text-gray-700 ml-1">
                plano pago pelo barbeiro/estabelecimento para utilização da
                Plataforma.
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Elegibilidade
          </h2>
          <p className="text-gray-700 mb-4">
            O uso da Lobeca está condicionado a:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Ser maior de 18 anos ou emancipado legalmente</li>
            <li>Possuir um número de telefone válido para autenticação</li>
            <li>Fornecer informações verdadeiras e atualizadas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Serviços oferecidos
          </h2>
          <p className="text-gray-700 mb-4">A Lobeca disponibiliza:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Agendamento de horários entre clientes e
              barbeiros/estabelecimentos
            </li>
            <li>Gestão de serviços, agenda e histórico de atendimentos</li>
            <li>
              Processamento de pagamentos de assinaturas dos
              barbeiros/estabelecimentos via Pagar.me (cartão de crédito)
            </li>
          </ul>
          <p className="text-gray-700 mt-4 font-medium">
            A Lobeca não presta serviços de barbearia, apenas intermedia a
            relação entre clientes e barbeiros/estabelecimentos por meio da
            tecnologia.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Assinaturas e Pagamentos
          </h2>
          <div className="text-gray-700 space-y-4">
            <p>
              O uso da Lobeca pelos barbeiros/estabelecimentos depende da
              contratação de um plano de assinatura. Os pagamentos são
              realizados exclusivamente via cartão de crédito, processados pelo
              Pagar.me.
            </p>
            <p>
              Em caso de não pagamento ou falha na cobrança, a assinatura poderá
              ser suspensa ou cancelada. A política de reembolso seguirá a
              legislação aplicável e as condições especificadas no momento da
              contratação.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Responsabilidades dos Usuários
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                a) Clientes
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Utilizar a Plataforma de forma lícita e respeitosa</li>
                <li>Fornecer informações corretas ao agendar serviços</li>
                <li>
                  Comparecer nos horários agendados ou cancelar com
                  antecedência, quando necessário
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                b) Barbeiros/Estabelecimentos
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  Prestar os serviços agendados com qualidade e responsabilidade
                </li>
                <li>
                  Manter informações de agenda e serviços sempre atualizadas
                </li>
                <li>
                  Garantir que o conteúdo enviado (ex: fotos, descrições) não
                  infrinja direitos de terceiros
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Limitações de Responsabilidade
          </h2>
          <p className="text-gray-700 mb-4">
            A Lobeca não se responsabiliza por:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Qualidade, execução ou preço dos serviços prestados pelos
              barbeiros/estabelecimentos
            </li>
            <li>
              Cancelamentos, atrasos ou não comparecimento de clientes ou
              barbeiros
            </li>
            <li>
              Problemas decorrentes de falhas na internet, no dispositivo do
              usuário ou em serviços de terceiros (ex: Pagar.me, Google Cloud,
              Supabase)
            </li>
            <li>
              Danos indiretos, lucros cessantes ou perda de oportunidades
              decorrentes do uso da Plataforma
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Propriedade Intelectual
          </h2>
          <div className="text-gray-700 space-y-4">
            <p>
              Todo o conteúdo da Plataforma, incluindo logotipos, design, código
              e funcionalidades, é de propriedade exclusiva da Lobeca ou de seus
              licenciantes.
            </p>
            <p>
              É proibido copiar, reproduzir, distribuir, modificar ou explorar
              comercialmente qualquer parte da Lobeca sem autorização prévia por
              escrito.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Suspensão e Encerramento
          </h2>
          <p className="text-gray-700 mb-4">
            A Lobeca poderá suspender ou encerrar o acesso do usuário em caso
            de:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Descumprimento destes Termos de Uso</li>
            <li>Uso indevido ou ilegal da Plataforma</li>
            <li>Falta de pagamento da assinatura</li>
          </ul>
          <p className="text-gray-700 mt-4">
            O usuário também poderá encerrar sua conta a qualquer momento,
            solicitando pelo suporte.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Alterações nos Termos
          </h2>
          <p className="text-gray-700">
            A Lobeca poderá atualizar estes Termos de Uso periodicamente para
            refletir melhorias, mudanças legais ou operacionais. Notificaremos
            os usuários por meio da própria Plataforma ou por SMS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            10. Lei Aplicável e Foro
          </h2>
          <p className="text-gray-700">
            Estes Termos de Uso são regidos pela legislação brasileira.
            Eventuais disputas deverão ser solucionadas no foro da comarca da
            sede da empresa responsável pela Lobeca, salvo disposição legal em
            contrário.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            11. Contato
          </h2>
          <p className="text-gray-700">
            Em caso de dúvidas ou solicitações relacionadas a estes Termos de
            Uso, entre em contato com a Lobeca:
          </p>
          <p className="text-gray-700 mt-2">
            📧{" "}
            <a
              href="mailto:contato@lobeca.com.br"
              className="text-blue-600 hover:text-blue-800"
            >
              contato@lobeca.com.br
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;
