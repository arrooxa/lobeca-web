import PublicLayout from "@/layouts/public";
import { NavLink } from "react-router";

const PrivacyPolicyPage = () => {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Política de Privacidade – Lobeca
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Esta Política de Privacidade descreve como a Lobeca coleta, usa,
            armazena e protege as informações pessoais dos usuários. A
            plataforma oferece funcionalidades de agendamento, gestão de
            horários e serviços, além de pagamentos de assinatura realizados
            exclusivamente via cartão de crédito. Ao utilizar a Lobeca, você
            concorda com os termos desta Política de Privacidade. Recomendamos
            que leia atentamente antes de prosseguir.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Informações que coletamos
          </h2>
          <p className="text-gray-700 mb-4">
            Coletamos as seguintes informações para oferecer a melhor
            experiência aos usuários da Lobeca:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                a) Dados de autenticação
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>
                  Número de telefone (utilizado para login e autenticação via
                  Supabase)
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Observação:</strong> a Lobeca não armazena e-mail nem
                senha. O acesso é feito exclusivamente por autenticação com
                número de telefone.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                b) Dados de agendamento e uso
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Horários marcados, reagendados ou cancelados</li>
                <li>Serviços contratados</li>
                <li>Histórico de atendimentos</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                c) Dados de pagamento
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>
                  Informações de cartão de crédito (processadas exclusivamente
                  pelo Pagar.me, não armazenadas pela Lobeca)
                </li>
                <li>Histórico de assinaturas e transações</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                d) Dados técnicos e de mídia
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>
                  Endereço IP e informações do dispositivo (modelo, sistema
                  operacional, versão do app)
                </li>
                <li>
                  Fotos armazenadas em Google Cloud Storage (como imagens de
                  perfil, logotipos ou registros visuais de estabelecimentos)
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Como usamos suas informações
          </h2>
          <p className="text-gray-700 mb-4">
            As informações coletadas pela Lobeca podem ser utilizadas para:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Gerenciar agendamentos</li>
            <li>Processar pagamentos de assinaturas via cartão de crédito</li>
            <li>
              Enviar confirmações, lembretes e notificações sobre serviços
            </li>
            <li>
              Armazenar e exibir imagens associadas ao perfil ou estabelecimento
            </li>
            <li>Melhorar a experiência de uso da plataforma</li>
            <li>Cumprir obrigações legais e regulatórias</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Compartilhamento de informações
          </h2>
          <p className="text-gray-700 mb-4">
            A Lobeca compartilha informações somente nas seguintes situações:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Com o Pagar.me, para processar pagamentos com segurança</li>
            <li>
              Com o Google Cloud, para armazenamento seguro de fotos e arquivos
            </li>
            <li>
              Com o Supabase, para autenticação e gerenciamento de sessões de
              usuário
            </li>
            <li>
              Quando exigido por lei, ordem judicial ou autoridade competente
            </li>
          </ul>
          <p className="text-gray-700 font-medium mt-4">
            Nunca vendemos ou alugamos informações pessoais a terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Armazenamento e segurança
          </h2>
          <p className="text-gray-700 mb-4">
            A Lobeca adota medidas técnicas e administrativas para proteger suas
            informações contra acessos não autorizados, perda, alteração ou
            divulgação indevida:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Dados de cartão são tratados diretamente pelo Pagar.me, em
              conformidade com os padrões PCI-DSS
            </li>
            <li>
              O armazenamento de fotos é realizado no Google Cloud Storage, que
              segue padrões internacionais de segurança
            </li>
            <li>
              A autenticação é realizada por meio do Supabase, com tokens
              temporários e verificação por SMS
            </li>
            <li>
              A Lobeca não armazena senhas nem dados de cartão em seus
              servidores
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Direitos dos usuários
          </h2>
          <p className="text-gray-700 mb-4">
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
            direito a:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Confirmar a existência de tratamento de seus dados</li>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>
              Solicitar a exclusão de seus dados, quando permitido por lei
            </li>
            <li>Revogar o consentimento para uso de informações</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Para exercer seus direitos, entre em contato pelo e-mail:
            <NavLink
              to="mailto:contato@lobeca.com.br"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              contato@lobeca.com.br
            </NavLink>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Retenção de dados
          </h2>
          <p className="text-gray-700 mb-4">
            A Lobeca manterá seus dados pelo tempo necessário para:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Cumprir os objetivos descritos nesta Política</li>
            <li>Atender a requisitos legais ou regulatórios</li>
            <li>Resolver disputas e garantir a execução de contratos</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Após esse período, os dados poderão ser anonimizados ou excluídos de
            forma segura.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Alterações nesta Política
          </h2>
          <p className="text-gray-700">
            A Lobeca poderá atualizar esta Política de Privacidade
            periodicamente para refletir melhorias, mudanças legais ou
            operacionais. Sempre que isso ocorrer, notificaremos os usuários
            através da própria plataforma ou por SMS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Contato
          </h2>
          <p className="text-gray-700">
            Se você tiver dúvidas, solicitações ou preocupações em relação à sua
            privacidade, entre em contato com a Lobeca:
          </p>
          <p className="text-gray-700 mt-2">
            📧{" "}
            <NavLink
              to="mailto:contato@lobeca.com.br"
              className="text-blue-600 hover:text-blue-800"
            >
              contato@lobeca.com.br
            </NavLink>
          </p>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicyPage;
